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
  const [showChat, setShowChat] = useState(true);

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
    <div className="h-screen flex flex-col bg-[var(--color-light-background)]">
      {/* Header */}
      <div className="bg-[var(--color-light-accent)] text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Petique Chat</h2>
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-sm">
              {isConnected ? "Online" : "Offline"}
            </span>
            {showChat ? (
              <button
                onClick={() => setShowChat(false)}
                className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition"
              >
                Minimize
              </button>
            ) : (
              <button
                onClick={() => setShowChat(true)}
                className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition"
              >
                Show Chat
              </button>
            )}
          </div>
        </div>
      </div>

      {showChat && (
        <div className="flex-1 flex overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="w-80 border-r border-[var(--color-border-light)] bg-white flex flex-col">
            <div className="p-4 border-b border-[var(--color-border-light)]">
              <button
                onClick={() => setShowUserSelector(true)}
                className="w-full px-4 py-2 bg-[var(--color-light-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition font-medium"
              >
                + New Chat
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

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {currentConversation && selectedUser ? (
              <ChatWindow
                conversation={currentConversation}
                selectedUser={selectedUser}
                messages={messages}
                onlineUsers={onlineUsers}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-cream)]">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Start a Conversation
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-4">
                    Select a conversation from the list or start a new chat
                  </p>
                  <button
                    onClick={() => setShowUserSelector(true)}
                    className="px-6 py-2 bg-[var(--color-light-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition"
                  >
                    New Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
