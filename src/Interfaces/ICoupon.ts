export interface ICoupon {
  _id: string;
  code: string;
  type: "fixedAmount" | "percentage";
  fromDate: string;
  expire: string;
  discount: number;
  createdBy: string;
  isDeleted: boolean;
  usedBy: { user: string; count: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ICouponResponse {
  message: string;
  success: boolean;
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    totalDocuments: number;
    prevPage: number | null;
    nextPage: number | null;
  };
  data: ICoupon[];
}

export interface ICouponCreate {
  code: string;
  type: "fixedAmount" | "percentage";
  fromDate: string;
  expire: string;
  discount: number;
}

export interface ICouponUpdate extends Partial<ICouponCreate> { }
