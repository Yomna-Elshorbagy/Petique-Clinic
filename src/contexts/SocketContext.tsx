import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { baseURL } from "../Apis/BaseUrl";
import type { IMessage, IConversation, IUser } from "../Interfaces/IChat";
import { jwtDecode } from "jwt-decode";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversations: IConversation[];
  currentConversation: IConversation | null;
  messages: IMessage[];
  selectedUser: IUser | null;
  typingUsers: Record<string, boolean>;
  onlineUsers: string[];
  setCurrentConversation: (conversation: IConversation | null) => void;
  setSelectedUser: (user: IUser | null) => void;
  sendMessage: (message: string, receiverId: string, conversationId?: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string, receiverId: string) => void;
  stopTyping: (conversationId: string, receiverId: string) => void;
  markAsRead: (conversationId: string, messageIds: string[]) => void;
  setConversations: (conversations: IConversation[]) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const [_currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ==> 1- get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        // ==> here i check => Backend uses _id in token, frontend might have id or _id
        setCurrentUserId(decoded._id || decoded.id || null);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // ===> 2- initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.log("No token found, skipping socket connection");
      return;
    }

    try {
      
      // ===> 3- create socket connection
      const newSocket = io(baseURL, {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket connected:", newSocket.id);
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      // ===> 4- listen for new messages
      newSocket.on("new_message", (data: { message: IMessage; conversationId: string }) => {
        console.log("📨 New message received:", data);
        
        setMessages((prev) => {
          // avoid duplicates
          if (prev.some((msg) => msg._id === data.message._id)) {
            return prev;
          }
          return [...prev, data.message];
        });

        // ===> Update conversation in list - this will be handled by conversation_updated event
        // ===> But we update state for immediate UI feedback
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv._id === data.conversationId) {
              const updatedConv = {
                ...conv,
                lastMessage: data.message,
                lastMessageAt: new Date(data.message.createdAt),
              };
              // ===> Only increment unread if not viewing this conversation
              if (conv._id !== currentConversation?._id) {
                updatedConv.unreadCount = (conv.unreadCount || 0) + 1;
              }
              return updatedConv;
            }
            return conv;
          })
        );
      });

      // ===> 5- listen for conversation updates
      newSocket.on("conversation_updated", (conversation: IConversation) => {
        setConversations((prev) => {
          const index = prev.findIndex((c) => c._id === conversation._id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = conversation;
            return updated;
          }
          // ===> If new conversation, add to beginning
          return [conversation, ...prev];
        });
      });

      // ===> 6- listen for typing indicators
      newSocket.on("user_typing", (data: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));

        // Clear typing indicator after 3 seconds
        if (data.isTyping) {
          const key = `${data.conversationId}_${data.userId}`;
          if (typingTimeoutRef.current[key]) {
            clearTimeout(typingTimeoutRef.current[key]);
          }
          typingTimeoutRef.current[key] = setTimeout(() => {
            setTypingUsers((prev) => ({
              ...prev,
              [data.userId]: false,
            }));
          }, 3000);
        }
      });

      // ===> 7- listen for online/offline status
      newSocket.on("user_online", (data: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => {
          if (data.isOnline && !prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
      });

      // ===> 8- listen for online/offline status
      newSocket.on("user_offline", (data: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
      });

      // ===> 9- listen for online users list
      newSocket.on("online_users", (data: { users: string[] }) => {
        setOnlineUsers(data.users);
      });

      // ===> 10- listen for error events
      newSocket.on("error", (error: { message: string }) => {
        console.error("Socket error:", error.message);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  }, []);

  // ===> 11- Join a conversation room
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("join_conversation", { conversationId });
      }
    },
    [socket, isConnected]
  );

  // ===> 12- leave a conversation room
  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit("leave_conversation", { conversationId });
      }
    },
    [socket, isConnected]
  );

  // ===> 13- Send a message
  const sendMessage = useCallback(
    (message: string, receiverId: string, conversationId?: string) => {
      if (socket && isConnected && message.trim()) {
        socket.emit("send_message", {
          conversationId,
          receiverId,
          message: message.trim(),
          messageType: "text",
        });
      }
    },
    [socket, isConnected]
  );

  // ===> 14- Start typing indicator
  const startTyping = useCallback(
    (conversationId: string, receiverId: string) => {
      if (socket && isConnected) {
        socket.emit("typing_start", { conversationId, receiverId });
      }
    },
    [socket, isConnected]
  );

  // ===> 15- Stop typing indicator
  const stopTyping = useCallback(
    (conversationId: string, receiverId: string) => {
      if (socket && isConnected) {
        socket.emit("typing_stop", { conversationId, receiverId });
      }
    },
    [socket, isConnected]
  );

  // ===> 16- Mark messages as read
  const markAsRead = useCallback(
    (conversationId: string, messageIds: string[]) => {
      if (socket && isConnected) {
        socket.emit("mark_as_read", { conversationId, messageIds });
      }
    },
    [socket, isConnected]
  );

  // ===> 17- Auto-join conversation when it changes
  useEffect(() => {
    if (currentConversation && socket && isConnected) {
      joinConversation(currentConversation._id);
      
      // Mark messages as read when opening conversation
      const unreadMessageIds = messages
        .filter((msg) => !msg.isRead && msg.receiverId._id !== socket.id)
        .map((msg) => msg._id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead(currentConversation._id, unreadMessageIds);
      }
    }

    return () => {
      if (currentConversation) {
        leaveConversation(currentConversation._id);
      }
    };
  }, [currentConversation?._id, socket, isConnected]);

  const value: SocketContextType = {
    socket,
    isConnected,
    conversations,
    currentConversation,
    messages,
    selectedUser,
    typingUsers,
    onlineUsers,
    setCurrentConversation,
    setSelectedUser,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markAsRead,
    setConversations,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

