import { useQuery } from "@tanstack/react-query";
import { getUserSpendingSummary, getUserTopCategories, getUserTopProducts } from './../../Apis/UserOrderAnalyticsApis';
import type { IUserSpendingSummary, IUserTopCategory, IUserTopProduct } from "../../Interfaces/IUserOrdersAnalytics";

// ================= USER ANALYTICS =================

// spending summary
export const useUserSpendingSummary = () => {
  return useQuery<IUserSpendingSummary>({
    queryKey: ["user-spending-summary"],
    queryFn: getUserSpendingSummary,
  });
};

// top categories
export const useUserTopCategories = () => {
  return useQuery<IUserTopCategory[]>({
    queryKey: ["user-top-categories"],
    queryFn: getUserTopCategories,
  });
};

// top products
export const useUserTopProducts = () => {
  return useQuery<IUserTopProduct[]>({
    queryKey: ["user-top-products"],
    queryFn: getUserTopProducts,
  });
};
