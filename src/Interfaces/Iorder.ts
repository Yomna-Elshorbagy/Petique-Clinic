import type { IProduct } from "./IProducts";



export interface OrderProduct {
  _id: string;
  productId: IProduct;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  finalPrice: number;
}

export interface IOrder {
    fullName: string;
    address: string;
    phone: string;
    notes: string;
    payment: string;

}

interface IorderState {
    orders: IOrder[];
    loading: boolean;
}

export type { IorderState };