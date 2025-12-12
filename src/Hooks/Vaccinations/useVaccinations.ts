import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVaccinations,
  getVaccination,
  getVaccinationOfCategory as apiGetVaccinationOfCategory,
  addVaccination,
  updateVaccination,
  softDeleteVaccination,
  deleteVaccination,
} from "../../Apis/VaccinationApis";
import type { IVaccination } from "../../Interfaces/IVacination";

export const useVaccinations = () => {
  return useQuery<IVaccination[]>({
    queryKey: ["vaccinations"],
    queryFn: getVaccinations,
  });
};

export const useVaccinationsByCategory = (categoryId?: string) => {
  return useQuery<IVaccination[]>({
    queryKey: ["vaccinations-category", categoryId],
    queryFn: () => apiGetVaccinationOfCategory(categoryId!),
    enabled: !!categoryId,
  });
};

export const useVaccination = (id?: string) => {
  return useQuery<IVaccination>({
    queryKey: ["vaccination", id],
    queryFn: () => getVaccination(id!),
    enabled: !!id,
  });
};

export const useAddVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVaccination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
    },
  });
};

export const useUpdateVaccination = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<IVaccination>) =>
      updateVaccination(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
      queryClient.invalidateQueries({ queryKey: ["vaccination", id] });
    },
  });
};

export const useSoftDeleteVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteVaccination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
    },
  });
};

export const useDeleteVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVaccination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
    },
  });
};
