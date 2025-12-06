interface IImage {
  secure_url: string;
}


export interface IService {
  _id: string;
  title: string;
  description: string;
  priceRange: string;
  preparations: string;
  benefits: string;
  tips: string;

  image: IImage;
  subImages: IImage[];


  createdBy: string;
  updatedBy?: string;

  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}
