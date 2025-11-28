export interface IAppointment {
  _id: string;
  user: string;
  pet: string;
  doctor: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
