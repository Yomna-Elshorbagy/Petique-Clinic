import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  softDeleteCoupon,
  getCouponById,
  getDeletedCoupons,
  restoreCoupon,
} from "../../Apis/CouponApis";
import type {  ICouponCreate, ICouponUpdate } from "../../Interfaces/ICoupon";
import Swal from "sweetalert2";

export const useCoupons = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["coupons", page, limit],
    queryFn: async () => await getCoupons(page, limit),
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ["coupon", id],
    queryFn: async () => await getCouponById(id),
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponData: ICouponCreate) => createCoupon(couponData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      Swal.fire("Success", "Coupon created successfully!", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create coupon",
        "error"
      );
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICouponUpdate }) =>
      updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      Swal.fire("Success", "Coupon updated successfully!", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update coupon",
        "error"
      );
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      Swal.fire("Success", "Coupon deleted successfully!", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete coupon",
        "error"
      );
    },
  });
};

export const useSoftDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      Swal.fire("Success", "Coupon soft deleted successfully!", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to soft delete coupon",
        "error"
      );
    },
  });
};


export const useDeletedCoupons = (page = 1, limit = 100) => {
  const {
    data: deletedData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["deletedCoupons", page, limit],
    queryFn: () => getDeletedCoupons(page, limit),
  });

  return {
    deletedCoupons: deletedData?.data || [],
    total: deletedData?.results || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useRestoreCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["deletedCoupons"] });
      Swal.fire("Restored", "Coupon restored successfully", "success");
    },
  });
};