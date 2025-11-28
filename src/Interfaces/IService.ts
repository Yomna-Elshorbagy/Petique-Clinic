export interface IService {
  _id: string;
  title: string;
  description: string;
  priceRange: string;
  preparations: string;

  image: any;
  subImages: any[];

  createdBy: string;
  updatedBy?: string;

  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}
