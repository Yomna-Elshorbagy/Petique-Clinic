import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getCategories, getDeletedCategories, restoreCategory } from "../../Apis/CategoryApis";
import type { IUseCategories } from "../../Interfaces/categryInterfaces";
import Swal from "sweetalert2";

export const useCategories = (): IUseCategories => {
  const [page, setPage] = useState<number>(1);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories", page],
    queryFn: async () => await getCategories(page, 8),
  });

  const categories = (data as any)?.data || [];
  const pagesCount = data?.metadata?.numberOfPages || 1;

  const refetchAll = async () => {
    await refetch();
  };

  return {
    categories,
    page,
    pagesCount,
    loading: isLoading,
    error: isError,
    setPage,
    refetchAll,
  };
};


export const useDeletedCategories = (page = 1, limit = 10) => {
  const {
    data: deletedData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["deletedCategories", page, limit],
    queryFn: () => getDeletedCategories(page, limit),
  });

  return {
    deletedCategories: deletedData?.data || [],
    total: deletedData?.results || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useRestoreCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["deletedCategories"] });
      Swal.fire("Restored", "Category restored successfully", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to restore category",
        "error"
      );
    },
  });
};