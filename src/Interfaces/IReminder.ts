export type ReminderType = "appointment" | "vaccination" | "medication";

export interface IReminder {
  _id: string;
  pet: string;
  petOwner: string;

  type: ReminderType;

  title?: string;
  remindAt: string;

  isSent: boolean;

  createdAt: string;
  updatedAt: string;
}
