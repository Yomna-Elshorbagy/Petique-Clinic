import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCategories } from "../../Apis/CategoryApis";
import type {  IUseCategories } from "../../Interfaces/categryInterfaces";

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