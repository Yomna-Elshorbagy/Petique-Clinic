import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { Send, Smile, Mic, Square, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { deleteMessage } from "../../../Apis/ChatApis";
import Swal from "sweetalert2";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import type { IConversation, IUser, IMessage } from "../../../Interfaces/IChat";

interface ChatWindowProps {
  conversation: IConversation;
  selectedUser: IUser;
  messages: IMessage[];
  onlineUsers: string[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  selectedUser,
  messages,
  onlineUsers,
  isLoading,
  onLoadMore,
  hasMore,
  isLoadingMore,
  setMessages,
}) => {
  const { sendMessage, startTyping, stopTyping, typingUsers } =
    useSocket();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  // ===> Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Get current user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return "";
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded._id || decoded.id || "";
    } catch {
      return "";
    }
  };

  const userId = getCurrentUserId();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const otherUserTyping = typingUsers[selectedUser._id] || false;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isLoadingMore) {
      setPrevScrollHeight(container.scrollHeight);
    } else if (prevScrollHeight > 0) {
      const currentScrollHeight = container.scrollHeight;
      container.scrollTop = currentScrollHeight - prevScrollHeight;
      setPrevScrollHeight(0);
    } else {
      // my notes for handling smart scroll:
      //**** >> SMART SCROLL: Only auto-scroll to bottom if:
      // 1. User is already near the bottom (within 150px)
      // 2. It's the initial load (few messages or scroll is at 0)
      // 3. User just sent a message ( ===> we can detect this if the last message sender is current user)

      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      const isInitialLoad = container.scrollTop === 0 && messages.length <= 50;
      const lastMessage = messages[messages.length - 1];
      const sentByMe = lastMessage && (typeof lastMessage.senderId === 'object' ? lastMessage.senderId._id : lastMessage.senderId) === userId;

      if (isNearBottom || isInitialLoad || sentByMe) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isLoadingMore, userId]);

  // ===> Infinite Scroll Handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  };

  // ===> Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      startTyping(conversation._id, selectedUser._id);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversation._id, selectedUser._id);
    }, 1000);
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage, selectedUser._id, conversation._id);
      setInputMessage("");
      setIsTyping(false);
      stopTyping(conversation._id, selectedUser._id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  //===> emojis
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputMessage((prev) => prev + emojiData.emoji);
    // Focus back on input after selecting emoji
    const inputElement = document.getElementById("chat-input");
    if (inputElement) {
      inputElement.focus();
    }
  };

  // ===> Voice Recording Handlers
  const startRecording = async () => {
    try {
      // 1. Determine supported mime type
      const mimeType = [
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
        "audio/wav",
      ].find((type) => MediaRecorder.isTypeSupported(type)) || "";

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("🎤 Chunk received:", event.data.size);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("⏹️ Recording stopped. Chunks:", audioChunksRef.current.length);

        // Ensure we have data
        if (audioChunksRef.current.length === 0) {
          console.error("❌ No audio data captured");
          Swal.fire({
            title: "Recording Empty",
            text: "Recording was too short or failed to capture audio.",
            icon: "info",
            background: "var(--color-bg-cream)",
            color: "var(--color-text-primary)",
          });
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log("📤 Blob created, size:", audioBlob.size, "type:", mimeType);

        if (audioBlob.size > 0) {
          handleSendVoice(audioBlob);
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording with a timeslice to ensure dataavailable fires
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);

      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      Swal.fire({
        title: "Microphone Access Denied",
        text: "Could not access microphone. Please ensure permissions are granted.",
        icon: "error",
        background: "var(--color-bg-cream)",
        color: "var(--color-text-primary)",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; // Prevent sending
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      audioChunksRef.current = [];
    }
  };

  const handleSendVoice = async (blob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        console.log("✨ Base64 conversion complete, sending...");
        sendMessage(base64Audio, selectedUser._id, conversation._id, "voice");
      };
      reader.onerror = (err) => {
        console.error("❌ FileReader error:", err);
      };
    } catch (error) {
      console.error("❌ Error uploading voice message:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Invalid File",
          text: "Please select an image file.",
          icon: "warning",
          background: "var(--color-bg-cream)",
          color: "var(--color-text-primary)",
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        sendMessage(base64Image, selectedUser._id, conversation._id, "image");
      };
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (messageId: string) => {
    const result = await Swal.fire({
      title: "Delete message?",
      text: "This will remove the message for you. Other participants will still be able to see it.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-light-accent)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      background: "var(--color-bg-cream)",
      color: "var(--color-text-primary)",
      customClass: {
        popup: 'rounded-3xl'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      Swal.fire({
        title: "Deleted!",
        text: "Message removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "var(--color-bg-cream)",
        color: "var(--color-text-primary)",
      });
    } catch (error: any) {
      console.error("Error deleting message:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete message.",
        icon: "error",
        background: "var(--color-bg-cream)",
        color: "var(--color-text-primary)",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative h-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(var(--color-light-accent) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* Header */}
      <div className="px-8 py-5 border-b border-[var(--color-border-light)] bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-light-accent)]/10 flex items-center justify-center overflow-hidden border border-[var(--color-border-light)] shadow-sm">
                {selectedUser.image?.secure_url ? (
                  <img
                    src={selectedUser.image.secure_url}
                    alt={selectedUser.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[var(--color-light-accent)] font-bold text-xl">
                    {selectedUser.userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-white shadow-sm transition-colors duration-500 ${isOnline ? "bg-green-500" : "bg-gray-300"}`} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--color-text-primary)] text-lg leading-tight">
                {selectedUser.userName}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] opacity-70">
                {isOnline ? "Active now" : "Offline"} • {selectedUser.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-light-accent)] hover:bg-[var(--color-light-accent)]/5 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar relative z-10"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-light-accent) transparent' }}>
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-light-accent)]" />
          </div>
        )}
        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 border-4 border-[var(--color-light-accent)] border-t-transparent rounded-full animate-spin" />
            <div className="text-[var(--color-text-muted)] font-medium animate-pulse">
              Encrypting your chat...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs p-8 bg-[var(--color-bg-cream)]/30 rounded-3xl border border-dashed border-[var(--color-border-light)]">
              <div className="text-5xl mb-4 grayscale opacity-50">🤝</div>
              <p className="font-bold text-[var(--color-text-primary)] mb-1">New Connection</p>
              <p className="text-sm text-[var(--color-text-muted)]">Messages you send here are private and protected.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => {
              const senderId =
                typeof message.senderId === "object"
                  ? message.senderId._id
                  : message.senderId;
              const isSent = senderId === userId;

              const showAvatar = !isSent && (index === 0 || (typeof messages[index - 1].senderId === 'object' ? messages[index - 1].senderId._id : messages[index - 1].senderId) === userId);

              return (
                <div
                  key={message._id}
                  className={`flex ${isSent ? "justify-end" : "justify-start"} items-end gap-3 group`}
                >
                  {!isSent && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--color-border-light)] bg-white shadow-sm">
                          {selectedUser.image?.secure_url ? (
                            <img src={selectedUser.image.secure_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[var(--color-light-accent)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--color-light-accent)]">
                              {selectedUser.userName.charAt(0)}
                            </div>
                          )}
                        </div>
                      ) : <div className="w-8" />}
                    </div>
                  )}

                  <div className={`max-w-[75%] flex flex-col ${isSent ? "items-end" : "items-start"}`}>
                    <div
                      className={`relative px-5 py-3 shadow-md transition-all duration-300 ${isSent
                        ? "bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-accent-dark)] text-white rounded-[24px] rounded-br-[4px] hover:shadow-lg hover:shadow-[var(--color-light-accent)]/20"
                        : "bg-white text-[var(--color-text-primary)] rounded-[24px] rounded-bl-[4px] border border-[var(--color-border-light)] hover:border-[var(--color-light-accent)]/30"
                        }`}
                    >
                      <div className="text-[14.5px] leading-relaxed font-medium">
                        {message.messageType === "voice" ? (
                          <div className={`voice-player ${isSent ? "invert-controls" : ""}`}>
                            <audio
                              src={message.message}
                              controls
                              className="max-w-full h-10 filter"
                              style={{
                                filter: isSent ? 'invert(1) hue-rotate(180deg) brightness(1.5)' : 'none'
                              }}
                            />
                          </div>
                        ) : message.messageType === "image" ? (
                          <div className="relative group/img overflow-hidden rounded-xl">
                            <img
                              src={message.message}
                              alt="Shared"
                              className="max-sm:max-w-full max-w-sm rounded-xl cursor-zoom-in transition-transform group-hover/img:scale-[1.02]"
                              onClick={() => window.open(message.message, '_blank')}
                            />
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap break-words">{message.message}</p>
                        )}
                      </div>

                      {/* Delete Option (Visible on Hover for Sent Messages Only) */}
                      {isSent && (
                        <button
                          onClick={() => handleDelete(message._id)}
                          className={`absolute top-1/2 -translate-y-1/2 ${isSent ? "-left-10" : "-right-10"
                            } p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200`}
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-1.5 mt-1.5 px-1 text-[10px] font-bold uppercase tracking-wider transition-opacity duration-300 ${isSent ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)]"
                        }`}
                    >
                      {formatTime(message.createdAt)}
                      {isSent && (
                        <span className={`transition-colors ${message.isRead ? "text-blue-500" : "text-gray-300"}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12L9 17L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {message.isRead && <path d="M4 12L9 17L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(4, 0)" />}
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {otherUserTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--color-border-light)] bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-[var(--color-light-accent)]">
                  {selectedUser.userName.charAt(0)}
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-3 border border-[var(--color-border-light)] shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[var(--color-light-accent)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-[var(--color-light-accent)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-[var(--color-light-accent)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="px-8 py-6 border-t border-[var(--color-border-light)] bg-white relative z-20">
        <div className="flex items-end gap-3 max-w-5xl mx-auto">
          {!isRecording ? (
            <>
              {/* Action Buttons Group - Left */}
              <div className="flex items-center gap-1 mb-1">
                <div className="relative" ref={emojiPickerRef}>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-light-accent)] hover:bg-[var(--color-bg-cream)] rounded-2xl transition-all active:scale-90 shadow-sm"
                    type="button"
                  >
                    <Smile size={24} />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-4 z-50 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                        theme={Theme.LIGHT}
                        width={350}
                        height={400}
                        lazyLoadEmojis
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-light-accent)] hover:bg-[var(--color-bg-cream)] rounded-2xl transition-all active:scale-90 shadow-sm"
                  type="button"
                >
                  <ImageIcon size={24} />
                </button>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Input Field */}
              <div className="flex-1 bg-[var(--color-bg-cream)]/50 rounded-[24px] border border-[var(--color-border-light)] focus-within:border-[var(--color-light-accent)]/50 focus-within:shadow-xl focus-within:shadow-[var(--color-light-accent)]/5 transition-all duration-300 p-1.5 flex items-center">
                <input
                  id="chat-input"
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15.5px] font-medium px-4 py-2 placeholder:text-[var(--color-text-muted)] placeholder:opacity-50"
                />
              </div>

              {/* Action Buttons Group - Right */}
              <div className="mb-1">
                {inputMessage.trim() ? (
                  <button
                    onClick={handleSend}
                    className="p-4 bg-[var(--color-light-accent)] text-white rounded-2xl hover:bg-[var(--color-accent-dark)] transition-all shadow-xl shadow-[var(--color-light-accent)]/20 active:scale-90 group"
                  >
                    <Send size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="p-3 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 shadow-sm"
                    type="button"
                  >
                    <Mic size={24} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-between px-6 py-4 bg-red-50 rounded-[28px] border border-red-100 animate-in zoom-in-95 duration-200 shadow-lg shadow-red-100/50">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
                  <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono font-black text-xl text-red-600 tabular-nums leading-none">
                    {formatDuration(recordingDuration)}
                  </span>
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-1">
                    Recording Audio
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelRecording}
                  className="p-3 text-red-300 hover:text-red-600 hover:bg-white rounded-2xl transition-all shadow-sm"
                  title="Delete recording"
                >
                  <Trash2 size={24} />
                </button>
                <div className="h-8 w-[1px] bg-red-100 mx-1" />
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                >
                  <Square size={14} fill="currentColor" />
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
