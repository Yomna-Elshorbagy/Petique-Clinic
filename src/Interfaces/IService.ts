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

export interface IServicePaginated {
  success: boolean;
  message: string;
  count: number;

  metadata: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    prevPage: number | null;
    nextPage: number | null;
  };

  data: IService[];
}
