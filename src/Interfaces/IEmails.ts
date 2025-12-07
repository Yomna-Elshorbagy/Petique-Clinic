export interface IContact {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  status: string;
  replyStatus?: string | null;
  replyMessage?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IReplyContact {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  reply: string;
  repliedAt: string;
}

export interface ContactFilters {
  searchId?: string;
  searchEmail?: string;
  searchName?: string;
  status?: string;
}