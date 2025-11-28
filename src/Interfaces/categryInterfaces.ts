export interface ICategory {
  _id: string;
  name: string;
  image: {
    secure_url: string;
    public_id: string;
  };
  createdBy?: {
    userName: string;
    mobileNumber?: string;
    address?: string;
    image?: string;
  };
  createdAt?: string;
  productCount?: number;
  updatedAt?: string;
}

export interface ITrendingCategory {
  _id: string;
  count: number;
  category: ICategory;
}

export interface ICategoryStats {
  totalCategories: number;
  latest: ICategory[];
  productsPerCategory: Array<{
    categoryId: string;
    count: number;
    categoryName: string;
  }>;
}

export interface IUseCategories {
  categories: ICategory[];
  page: number;
  pagesCount: number;
  loading: boolean;
  error: unknown;
  setPage: (page: number) => void;
  refetchAll: () => Promise<void>;
}