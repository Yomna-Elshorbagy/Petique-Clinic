import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addAnimalCategory, deleteAnimalCategory, getAllAnimalCategories, getAnimalCategoryById, softDeleteAnimalCategory, updateAnimalCategory } from "../../Apis/AnimalCategory";


// Fetch all categories
export const useAnimalCategories = (query: any = {}) => {
  return useQuery({
    queryKey: ["animalCategories", query],
    queryFn: () => getAllAnimalCategories(query),
  });
};

// Fetch category by ID
export const useAnimalCategory = (id: string | null) => {
  return useQuery({
    queryKey: ["animalCategory", id],
    queryFn: () => getAnimalCategoryById(id as string),
    enabled: !!id,
  });
};

// Add category
export const useAddAnimalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAnimalCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animalCategories"] });
    },
  });
};

// Update category
export const useUpdateAnimalCategory = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => updateAnimalCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animalCategories"] });
      queryClient.invalidateQueries({ queryKey: ["animalCategory", id] });
    },
  });
};

// Soft delete
export const useSoftDeleteAnimalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteAnimalCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animalCategories"] });
    },
  });
};

// Hard delete
export const useDeleteAnimalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnimalCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animalCategories"] });
    },
  });
};
