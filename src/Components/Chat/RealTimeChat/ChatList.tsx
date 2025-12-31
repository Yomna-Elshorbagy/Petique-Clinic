import React from "react";
import type { IConversation } from "../../../Interfaces/IChat";

interface ChatListProps {
  conversations: IConversation[];
  currentConversation: IConversation | null;
  onSelectConversation: (conversation: IConversation) => void;
  onlineUsers: string[];
  isLoading: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onlineUsers,
  isLoading,
}) => {
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return "";
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded._id || decoded.id || "";
    } catch {
      return "";
    }
  };

  const getOtherParticipant = (conversation: IConversation) => {
    const currentUserId = getCurrentUserId();
    const other = conversation.participants.find(p => p._id !== currentUserId);
    return other || conversation.participants[0];
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Loading conversations...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-[var(--color-text-muted)]">
          <div className="text-4xl mb-2">💬</div>
          <p>No conversations yet</p>
          <p className="text-sm mt-1">Start a new chat to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherUser = getOtherParticipant(conversation);
        const isOnline = onlineUsers.includes(otherUser._id);
        const isActive = currentConversation?._id === conversation._id;
        const unreadCount = conversation.unreadCount || 0;

        return (
          <div
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-[var(--color-border-light)] cursor-pointer transition-colors ${
              isActive
                ? "bg-[var(--color-light-accent)]/10 border-l-4 border-l-[var(--color-light-accent)]"
                : "hover:bg-[var(--color-bg-cream)]"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[var(--color-light-accent)] flex items-center justify-center overflow-hidden">
                  {otherUser.image?.secure_url ? (
                    <img
                      src={otherUser.image.secure_url}
                      alt={otherUser.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-lg">
                      {otherUser.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-[var(--color-text-primary)] truncate">
                    {otherUser.userName}
                  </h4>
                  {conversation.lastMessageAt && (
                    <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 ml-2">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--color-text-muted)] truncate">
                    {conversation.lastMessage?.message || "No messages yet"}
                  </p>
                  {unreadCount > 0 && (
                    <span className="flex-shrink-0 ml-2 bg-[var(--color-light-accent)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>

                {/* Role badge */}
                <div className="mt-1">
                  <span className="text-xs px-2 py-0.5 bg-[var(--color-bg-cream)] text-[var(--color-text-secondary)] rounded">
                    {otherUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;

