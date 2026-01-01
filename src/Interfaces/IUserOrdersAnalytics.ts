// Spending summary
export interface IUserSpendingSummary {
  totalSpent: number;
  totalOrders: number;
  avgOrderValue: number;
}

// Top category
export interface IUserTopCategory {
  _id: string;
  categoryName: string;
  totalQuantity: number;
  totalSpent: number;
}

// Top product
export interface IUserTopProduct {
  productId: string;
  title: string;
  image?: string;
  totalQuantity: number;
  totalSpent: number;
}
