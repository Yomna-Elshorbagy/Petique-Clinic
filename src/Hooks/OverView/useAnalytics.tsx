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
  exportOrdersToCSV,
  exportOrdersToPDF,
} from "../../Apis/OverView";

//===> Export Hooks
export const useExportOrders = () => {
  const downloadFile = (data: Blob, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const exportCSV = async () => {
    try {
      const data = await exportOrdersToCSV();
      downloadFile(data, "orders-report.csv");
    } catch (error) {
      console.error("Failed to export CSV", error);
    }
  };

  const exportPDF = async () => {
    try {
      const data = await exportOrdersToPDF();
      downloadFile(data, `orders-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF", error);
    }
  };

  return { exportCSV, exportPDF };
};

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
