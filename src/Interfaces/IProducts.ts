export interface IProduct {
  _id: string;

  title: string;
  description: string;

  imageCover: {
    secure_url: string;
    public_id: string;
  };
  subImages: any[];

  price: number;
  discount?: number;

  stock: number;
  status: string;

  category: {
    _id: string;
    name: string;
    image?: string;
    createdBy?: string;
    id?: string;
  };
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

export interface IProductStats {
  totalProducts: number;
  lowStockProducts: number;
  trendingProducts: IProduct[];
  [key: string]: any;
}

export interface IUseProducts {
  products: IProduct[];
  page: number;
  pagesCount: number;
  loading: boolean;
  error: unknown;
  setPage: (page: number) => void;
  refetch: () => void;
}
