import { useQuery } from "@tanstack/react-query";
import {
  getCategoryStats,
  getDeletedUsersAnalysis,
  getDemographics,
  getOrdersDistribution,
  getRevenueDistribution,
  getRevenuePerMonth,
  getTopSellingProducts,
  getUsersOverview,
} from "../../Apis/OverView";

//===>category analysis
export const useCategoryStats = () =>
  useQuery({
    queryKey: ["category-stats"],
    queryFn: getCategoryStats,
  });

export const useRevenueDistribution = () =>
  useQuery({
    queryKey: ["revenue-distribution"],
    queryFn: getRevenueDistribution,
  });

//===> order analysis
export const useOrdersDistribution = () =>
  useQuery({
    queryKey: ["orders-distribution"],
    queryFn: getOrdersDistribution,
  });

export const useRevenuePerMonth = () =>
  useQuery({
    queryKey: ["revenue-per-month"],
    queryFn: getRevenuePerMonth,
  });

export const useTopSellingProducts = () =>
  useQuery({
    queryKey: ["top-selling-products"],
    queryFn: getTopSellingProducts,
  });

//===> user analysis

export const useUsersOverview = () =>
  useQuery({
    queryKey: ["users-overview"],
    queryFn: getUsersOverview,
  });

export const useDeletedUsersAnalysis = () =>
  useQuery({
    queryKey: ["deleted-users-analysis"],
    queryFn: getDeletedUsersAnalysis,
  });

export const useDemographics = () =>
  useQuery({
    queryKey: ["demographics"],
    queryFn: getDemographics,
  });
