import { baseURL } from "./BaseUrl";
import axios from "axios";
import type { Order } from "../Types/OrderType";
import type { IOrder } from "../Interfaces/Iorder";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getOrders = () => axios.get<Order[]>(`${baseURL}/orders`);

export const getAllOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: IOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}> => {
  const { data } = await axios.get(
    `${baseURL}/order/allorders?page=${page}&limit=${limit}`,
    { headers: getHeaders() }
  );
  return {
    data: data.data,
    pagination: data.pagination,
  };
};

export const verifyPayment = async (sessionId: string) => {
  const { data } = await axios.post(
    `${baseURL}/order/verify-payment/${sessionId}`,
    {},
    { headers: getHeaders() }
  );
  return data;
};
