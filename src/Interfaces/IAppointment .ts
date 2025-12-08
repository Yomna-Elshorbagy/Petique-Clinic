import type { IUser } from "./IUser";

export interface IAppointment {
  _id: string;
  user: string;
  pet: string;
  doctor: IUser;
  service: string;
  branch: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
