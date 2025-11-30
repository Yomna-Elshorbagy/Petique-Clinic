export type PaymentMethod = "Cash on Delivery" | "Online";

export type CreateOrderInput = {
  fullName: string;
  phone: string;
  address: string;
  payment: PaymentMethod;
  couponCode?: string;
};

export type OrderProduct = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  finalPrice: number;
  _id: string;
};

export type Order = {
  _id: string;
  user: string;
  fullName: string;
  products: OrderProduct[];
  address: string;
  phone: string;
  payment: PaymentMethod | string;
  status: "placed" | "shipped" | "delivered" | string;
  orderPrice: number;
  finalPrice: number;
  coupon?: string;
  createdAt: string;
  updatedAt: string;
};

