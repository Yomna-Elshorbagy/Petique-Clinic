import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../Apis/BaseUrl";
import type { Order, OrdersResponse } from "../../Types/OrderType";

export const useOrderTracking = (orderId: string) => {
  const token = localStorage.getItem("accessToken");

  return useQuery<Order>({
    queryKey: ["orderTracking", orderId],
    queryFn: async (): Promise<Order> => {
      const res = await axios.get<{ data: Order }>(
        `${baseURL}/order/${orderId}`,
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
      return res.data.data;
    },
    enabled: !!orderId,
  });
};
export const useUserOrders = (page: number, limit: number) => {
  const token = localStorage.getItem("accessToken");

  return useQuery<OrdersResponse>({
    queryKey: ["userOrders", page],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/order`, {
        headers: { authentication: `bearer ${token}` },
        params: { page, limit },
      });

      return res.data;
    },
    enabled: !!token,
  });
};

export const useAllOrders = (page: number = 1, limit: number = 10) => {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["allOrders", page, limit],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/order/allorders`, {
        headers: { authentication: `bearer ${token}` },
        params: { page, limit },
      });

      return res.data;
    },
    enabled: !!token,
  });
};
