export type CartProduct = {
  _id: string;
  productId: null | {
    _id: string;
    title: string;
    price: number;
    stock?: number;
    finalPrice?: number;
    imageCover?: { secure_url: string };
  };
  price: number;
  quantity: number;
  category: null | {
    name: string;
  };
};

export type CartState = {
  noOfCartItems: number;
  noOfCartProducts: number;
  products: CartProduct[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
};