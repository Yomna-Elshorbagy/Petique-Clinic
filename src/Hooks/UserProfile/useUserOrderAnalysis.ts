import { useQuery } from "@tanstack/react-query";
import { IUserSpendingSummary, IUserTopCategory, IUserTopProduct } from './../../Interfaces/IUserOrdersAnalytics';
import { getUserSpendingSummary, getUserTopCategories, getUserTopProducts } from './../../Apis/UserOrderAnalyticsApis';

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
