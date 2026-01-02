import React, { useState, useEffect } from "react";
import { useSocket } from "../../../contexts/SocketContext";
import {
  getConversations,
  getMessages,
  getAvailableUsers,
  getOrCreateConversation,
} from "../../../Apis/ChatApis";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import UserSelector from "./UserSelector";
import type { IConversation, IUser, IMessage } from "../../../Interfaces/IChat";

const ChatContainer: React.FC = () => {
  const {
    socket,
    isConnected,
    conversations: socketConversations,
    currentConversation,
    messages: socketMessages,
    setCurrentConversation,
    setSelectedUser,
    selectedUser,
    onlineUsers,
    setConversations: updateSocketConversations,
  } = useSocket();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat] = useState(true);

  // ===> 1- Use socket conversations directly
  const conversations = socketConversations;

  // ===> 2- Load conversations on mount
  useEffect(() => {
    loadConversations();
    loadAvailableUsers();
  }, []);

  // ===> 3- Sync socket messages with local state
  useEffect(() => {
    if (currentConversation) {
      setMessages(
        socketMessages.filter(
          (msg) => msg.conversationId === currentConversation._id
        )
      );
    }
  }, [socketMessages, currentConversation]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await getConversations();
      const loadedConversations = response.data || [];
      // ===> 4- Update socket context conversations
      updateSocketConversations(loadedConversations);
    } catch (error: any) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableUsers = async (search?: string) => {
    try {
      const response = await getAvailableUsers(undefined, search);
      setAvailableUsers(response.data || []);
    } catch (error: any) {
      console.error("Error loading users:", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response = await getMessages(conversationId);
      setMessages(response.data.messages || []);
    } catch (error: any) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSelectConversation = async (conversation: IConversation) => {
    setCurrentConversation(conversation);
    const currentUserId = getCurrentUserId();
    const otherParticipant = conversation.participants.find(
      (p) => p._id !== currentUserId
    );
    if (otherParticipant) {
      setSelectedUser(otherParticipant);
    }
    await loadMessages(conversation._id);
  };

  const handleSelectUser = async (user: IUser) => {
    setSelectedUser(user);
    setShowUserSelector(false);
    setIsLoading(true);

    try {
      // Find existing conversation in the list
      const existingConv = conversations.find(
        (conv) =>
          conv.participants.length === 2 &&
          conv.participants.some((p) => p._id === user._id)
      );

      if (existingConv) {
        // If conversation exists, just select it
        await handleSelectConversation(existingConv);
      } else {
        // If no conversation exists, create/get one from API
        const response = await getOrCreateConversation(user._id);
        const newConversation = response.data;

        // Add to conversations list
        updateSocketConversations([newConversation, ...conversations]);

        // Set as current conversation
        setCurrentConversation(newConversation);

        // Load messages (will be empty for new conversation)
        await loadMessages(newConversation._id);
      }
    } catch (error: any) {
      console.error("Error selecting user:", error);
      // Show error to user
      alert(error.response?.data?.message || "Failed to start conversation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[95vh] flex flex-col bg-[var(--color-bg-cream)]/20 max-w-7xl mx-auto my-4 rounded-3xl shadow-2xl overflow-hidden border border-[var(--color-border-light)]">
      {/* App Header */}
      <div className="bg-white px-8 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-light-accent)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--color-light-accent)]/20 rotate-3">
            <span className="font-black text-xl">P</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[var(--color-text-primary)]">
              PETIQUE <span className="text-[var(--color-light-accent)] italic">CLINIC</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] opacity-60">
              Professional Care Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-cream)]/50 rounded-full border border-[var(--color-border-light)]">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-xs font-bold text-[var(--color-text-primary)]">
              {isConnected ? "SYSTEMS ONLINE" : "SYSTEMS OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-[var(--color-border-light)] bg-[var(--color-bg-cream)]/30 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[var(--color-border-light)] bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Messages</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
              </div>
            </div>
            <button
              onClick={() => setShowUserSelector(true)}
              className="w-full px-4 py-3 bg-[var(--color-light-accent)] text-white rounded-xl hover:bg-[var(--color-accent-dark)] transition-all duration-300 font-semibold shadow-lg shadow-[var(--color-light-accent)]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              + New Conversation
            </button>
          </div>

          <ChatList
            conversations={conversations}
            currentConversation={currentConversation}
            onSelectConversation={handleSelectConversation}
            onlineUsers={onlineUsers}
            isLoading={isLoading}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {currentConversation && selectedUser ? (
            <ChatWindow
              conversation={currentConversation}
              selectedUser={selectedUser}
              messages={messages}
              onlineUsers={onlineUsers}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-cream)]/20 relative">
              {/* Decorative background element */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(var(--color-light-accent) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />

              <div className="text-center relative z-10 px-8">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl mb-6 mx-auto transform rotate-12 transition-transform hover:rotate-0 duration-500">
                  💬
                </div>
                <h3 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-3">
                  Your Inbox
                </h3>
                <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto text-lg">
                  Select a conversation to start messaging. Your chats with doctors and staff will appear here.
                </p>
                <button
                  onClick={() => setShowUserSelector(true)}
                  className="px-8 py-3 bg-[var(--color-light-accent)] text-white rounded-xl hover:bg-[var(--color-accent-dark)] transition-all font-bold shadow-lg shadow-[var(--color-light-accent)]/20"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Selector Modal */}
      {showUserSelector && (
        <UserSelector
          users={availableUsers}
          onSelectUser={handleSelectUser}
          onClose={() => setShowUserSelector(false)}
          onSearch={loadAvailableUsers}
        />
      )}
    </div>
  );
};

export default ChatContainer;
