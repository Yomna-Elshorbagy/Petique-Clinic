import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPet,
  updatePet,
  softDeletePet,
  deletePet,
  getAllPets,
  getPetById,
  getUserPets,
  getCountCategoryPet,
  getPetVaccinations,
  getVaccinationRecords,
  addVaccinationToPet,
} from "../../Apis/PetApis";

export const useAllPets = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: getAllPets,
  });
};

export const usePetById = (id: string) => {
  return useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPetById(id),
    enabled: !!id,
  });
};

export const useUserPets = () => {
  return useQuery({
    queryKey: ["userPets"],
    queryFn: getUserPets,
  });
};

export const useCountCategoryPet = () => {
  return useQuery({
    queryKey: ["countCategoryPet"],
    queryFn: getCountCategoryPet,
  });
};

export const useAddPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData | any) => addPet(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["userPets"] });
      queryClient.invalidateQueries({ queryKey: ["countCategoryPet"] });
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updatePet(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet"] });
      queryClient.invalidateQueries({ queryKey: ["userPets"] });
      queryClient.invalidateQueries({ queryKey: ["countCategoryPet"] });
    },
  });
};

export const useSoftDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeletePet(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["userPets"] });
      queryClient.invalidateQueries({ queryKey: ["countCategoryPet"] });
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePet(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["userPets"] });
      queryClient.invalidateQueries({ queryKey: ["countCategoryPet"] });
    },
  });
};

export const useAddVaccinationToPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      addVaccinationToPet(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet"] });
      queryClient.invalidateQueries({ queryKey: ["vaccinationRecords"] });
    },
  });
};

export const useVaccinationRecords = () => {
  return useQuery({
    queryKey: ["vaccinationRecords"],
    queryFn: getVaccinationRecords,
  });
};

export const usePetVaccinations = (id: string) => {
  return useQuery({
    queryKey: ["petVaccinations", id],
    queryFn: () => getPetVaccinations(id),
    enabled: !!id,
  });
};
