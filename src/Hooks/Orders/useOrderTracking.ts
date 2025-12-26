import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../Apis/BaseUrl";
import type { Order, OrdersResponse } from "../../Types/OrderType";
import { getDeletedOrders, restoreOrder } from "../../Apis/OrderApi";
import Swal from "sweetalert2";

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
export const useUserOrders = () => {
  const token = localStorage.getItem("accessToken");

  return useQuery<OrdersResponse>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/order`, {
        headers: { authentication: `bearer ${token}` },
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

export const useDeletedOrders = (page = 1, limit = 10) => {
  const {
    data: deletedData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["deletedOrders", page, limit],
    queryFn: () => getDeletedOrders(page, limit),
  });

  return {
    deletedOrders: deletedData?.data || [],
    total: deletedData?.pagination?.totalOrders || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useRestoreOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["deletedOrders"] });
      Swal.fire("Restored", "Order restored successfully", "success");
    },
  });
};
