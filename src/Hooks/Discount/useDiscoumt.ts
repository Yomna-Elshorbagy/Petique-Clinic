import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDiscountApi, getActiveDiscountsApi, getDiscountsApi, softDeleteDiscountApi, toggleDiscountApi, updateDiscountApi } from "../../Apis/discount.apis";
import type { ICreateDiscount, IUpdateDiscount } from "../../Interfaces/IdiscountInterface";


// ==> get active discounts
export const useActiveDiscounts = () =>
  useQuery({
    queryKey: ["active-discounts"],
    queryFn: getActiveDiscountsApi,
  });

//==> admin

// ==> get all discounts (dashboard)
export const useDiscounts = () =>
  useQuery({
    queryKey: ["discounts"],
    queryFn: getDiscountsApi,
  });

// ==> create discount
export const useCreateDiscount = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateDiscount) =>
      createDiscountApi(payload, ""),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discounts"] });
      qc.invalidateQueries({ queryKey: ["active-discounts"] });
    },
  });
};

// ==> update discount
export const useUpdateDiscount = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateDiscount;
    }) =>
      updateDiscountApi({
        id,
        payload,
        token: "",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discounts"] });
      qc.invalidateQueries({ queryKey: ["active-discounts"] });
    },
  });
};

// ==> toggle discount
export const useToggleDiscount = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleDiscountApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discounts"] });
      qc.invalidateQueries({ queryKey: ["active-discounts"] });
    },
  });
};

// ==> soft delete discount
export const useSoftDeleteDiscount = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeleteDiscountApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
};
