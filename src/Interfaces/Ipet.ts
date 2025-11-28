export interface IVaccinationHistory {
  vaccine: string;
  date: string;
  nextDose: string;
}

export interface IMedicalRecord {
  // when populate on medical records
}

export interface IPet {
  _id: string;
  petOwner: string;
  name: string;
  age: string;
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
