import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../Apis/BaseUrl";
import type { Order } from "../../Types/OrderType";

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
