export interface IVaccinationHistory {
  vaccine: {
    _id: string;
    name: string;
    categories: string[];
  };
  date: string;
  nextDose: string;
  status: "Pending" | "Completed" | "Missed";
  notes?: string;
}

export interface IMedicalRecord {
  // when populate on medical records
}

export interface IPet {
  _id: string;
  petOwner: {
    _id: string;
    userName: string;
    email: string;
  };
  category: {
    _id: string;
    name: string;
  };
  name: string;
  age: number;
  weight: number;
  allergies: string[];
  vaccinationHistory: IVaccinationHistory[];
  image: {
    secure_url: string;
    public_id: string;
  };
  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;

  medicalRecords?: IMedicalRecord[];

  createdAt: string;
  updatedAt: string;
}
