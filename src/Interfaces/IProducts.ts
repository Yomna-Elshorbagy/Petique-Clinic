export interface IProduct {
  _id: string;

  title: string;
  description: string;

  imageCover: any;
  subImages: any[];

  price: number;
  discount?: number;

  stock: number;

  category: string;
  createdBy: string;
  updatedBy: string;

  rate: number;

  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;

  finalPrice: number;

  Reviews?: any[];

  createdAt: string;
  updatedAt: string;
}
