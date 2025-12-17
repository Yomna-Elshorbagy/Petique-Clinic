export type DiscountType =
  | "FLASH"
  | "PERCENTAGE"
  | "BOGO"
  | "FIRST_ORDER"
  | "BULK";

export type DiscountApplyTo = "ALL" | "PRODUCTS" | "CATEGORIES";

export interface IDiscount {
  _id: string;
  name: string;
  type: DiscountType;
  percentage?: number;
  buyQty?: number;
  getQty?: number;
  appliesTo: DiscountApplyTo;
  products?: string[];
  categories?: string[];
  fromDate?: string;
  expire?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  uses: number;
}

export interface ICreateDiscount {
  name: string;
  type: DiscountType;
  percentage?: number;
  buyQty?: number;
  getQty?: number;
  appliesTo?: DiscountApplyTo;
  products?: string[];
  categories?: string[];
  fromDate?: string;
  expire?: string;
}

export interface IUpdateDiscount extends Partial<ICreateDiscount> {
  isActive?: boolean;
}
