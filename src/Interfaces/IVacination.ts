
export interface IVaccination {
  _id: string;
  name: string;
  description?: string;
  doses?: number;
  categories?: string[];
  createdBy?: { userName: string };
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}