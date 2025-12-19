import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../../../Apis/ProductsDashboard";
import { getAllOrders } from "../../../../Apis/OrderApi";
import { getAllUsers } from "../../../../Apis/UsersApis";
import type { IProduct } from "../../../../Interfaces/IProducts";
import type { IOrder } from "../../../../Interfaces/Iorder";
import type { IUser } from "../../../../Interfaces/IUser";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        getProducts(1, 1000),
        getAllOrders(1, 1000),
        getAllUsers(),
      ]);

      const products: IProduct[] = productsRes.data || [];
      const orders: IOrder[] = ordersRes.data || [];
      const users: IUser[] = usersRes.data || [];

      const totalRevenue = orders
        .filter(o => o.status?.toLowerCase() === "completed")
        .reduce((acc, o) => acc + (o.finalPrice || 0), 0);

      const now = new Date();
      const newCustomers = users.filter(user => {
        const created = new Date(user.createdAt);
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }).length;

      const activeUsers = users.filter(u => u.isActive).length;

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        newCustomers,
        activeUsers,
      };
    },
  });
};
