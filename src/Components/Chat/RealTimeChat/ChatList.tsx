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
            className={`px-5 py-4 cursor-pointer transition-all duration-300 relative group ${isActive
                ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] z-10"
                : "hover:bg-white/50"
              }`}
          >
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-light-accent)] rounded-r-full" />
            )}

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${isActive ? "ring-2 ring-[var(--color-light-accent)] ring-offset-2" : "border border-[var(--color-border-light)]"
                  } bg-white shadow-sm`}>
                  {otherUser.image?.secure_url ? (
                    <img
                      src={otherUser.image.secure_url}
                      alt={otherUser.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-light-accent)]/10 flex items-center justify-center">
                      <span className="text-[var(--color-light-accent)] font-bold text-xl">
                        {otherUser.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white shadow-sm" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold transition-colors truncate ${isActive ? "text-[var(--color-light-accent)]" : "text-[var(--color-text-primary)]"
                    }`}>
                    {otherUser.userName}
                  </h4>
                  {conversation.lastMessageAt && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-text-muted)] opacity-60">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs truncate flex items-center gap-1.5 ${unreadCount > 0 ? "text-[var(--color-text-primary)] font-semibold" : "text-[var(--color-text-muted)]"
                    }`}>
                    {conversation.lastMessage?.messageType === "voice" ? (
                      <>
                        <span className="text-[var(--color-light-accent)]">🎤</span>
                        <span>Voice message</span>
                      </>
                    ) : conversation.lastMessage?.messageType === "image" ? (
                      <>
                        <span className="text-[var(--color-light-accent)]">📷</span>
                        <span>Photo</span>
                      </>
                    ) : (
                      conversation.lastMessage?.message || <span className="italic opacity-50">No messages yet</span>
                    )}
                  </p>

                  {unreadCount > 0 && (
                    <span className="flex-shrink-0 bg-[var(--color-light-accent)] text-white text-[10px] font-bold h-5 min-w-[20px] flex items-center justify-center px-1 rounded-full shadow-lg shadow-[var(--color-light-accent)]/30">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
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

