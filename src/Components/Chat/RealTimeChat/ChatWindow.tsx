import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import type { IConversation, IUser, IMessage } from "../../../Interfaces/IChat";

interface ChatWindowProps {
  conversation: IConversation;
  selectedUser: IUser;
  messages: IMessage[];
  onlineUsers: string[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  selectedUser,
  messages,
  onlineUsers,
  isLoading,
}) => {
  const { sendMessage, startTyping, stopTyping, typingUsers, socket } =
    useSocket();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
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

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-cream)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[var(--color-light-accent)] flex items-center justify-center overflow-hidden">
                {selectedUser.image?.secure_url ? (
                  <img
                    src={selectedUser.image.secure_url}
                    alt={selectedUser.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {selectedUser.userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                {selectedUser.userName}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {isOnline ? "Online" : "Offline"} • {selectedUser.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-light-background)] min-h-0 max-h-[72vh]">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-muted)]">
              Loading messages...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[var(--color-text-muted)]">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const senderId =
                typeof message.senderId === "object"
                  ? message.senderId._id
                  : message.senderId;
              const isSent = senderId === userId;

              return (
                <div
                  key={message._id}
                  className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isSent
                        ? "bg-[var(--color-light-accent)] text-white rounded-br-sm"
                        : "bg-white text-[var(--color-text-primary)] rounded-bl-sm border border-[var(--color-border-light)]"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.message}
                    </p>
                    <div
                      className={`text-xs mt-1 ${
                        isSent
                          ? "text-white/70"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                      {isSent && message.isRead && (
                        <span className="ml-1">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {otherUserTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2 border border-[var(--color-border-light)]">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input  with emojis */}
      <div className="px-6 py-4 border-t border-[var(--color-border-light)] bg-white relative">
        <div className="flex items-center gap-3">
          <div className="relative" ref={emojiPickerRef}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-light-accent)] transition-colors rounded-lg hover:bg-gray-100"
              type="button"
            >
              <Smile size={24} />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50 shadow-xl">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  theme={Theme.LIGHT}
                  width={350}
                  height={400}
                />
              </div>
            )}
          </div>

          <input
            id="chat-input"
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-light-accent)] focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="p-2 bg-[var(--color-light-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
