export interface IContact {
  _id: string;
  fullName: string;
  email: string;
  category: string;
  urgency: string;
  petAge?: string;
  message: string;

  replyStatus: string;
  replyMessage?: string | null;
  repliedAt?: string | null;

  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}
export interface ContactForm {
  fullName: string;
  email: string;
  message: string;
  category: string;
  urgency: string;
  petAge: string;
}