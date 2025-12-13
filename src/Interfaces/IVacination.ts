
export interface IDose {
  doseNumber: number;
  ageInWeeks: number;
  repeatAfterDays?: number;
  recurring?: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
}

export interface IVaccination {
  _id: string;
  name: string;
  description: string;
  doses: IDose[];
  categories: ICategory[] | string[]; // Can be populated objects or ID strings
  createdBy?: { userName: string; _id: string } | string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
