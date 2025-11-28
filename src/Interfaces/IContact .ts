export interface IContact {
  _id: string;
  fullName: string;
  email: string;
  category: "appointment" | "emergency" | "health" | "vaccination" | "general";
  urgency: "low" | "medium" | "high" | "emergency";
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