export interface IUser {
  _id: string;
  userName: string;
  email: string;
  image?: {
    secure_url: string;
    public_id: string;
  };
  role: "petOwner" | "doctor" | "admin" | "owner" | "staff";
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: IUser;
  receiverId: IUser;
  message: string;
  messageType: "text" | "image" | "file";
  isRead: boolean;
  readAt?: Date;
  deletedFor: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: IMessage;
  lastMessageAt: Date;
  unreadCount: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatState {
  conversations: IConversation[];
  currentConversation: IConversation | null;
  messages: IMessage[];
  selectedUser: IUser | null;
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, boolean>;
  onlineUsers: string[];
}


