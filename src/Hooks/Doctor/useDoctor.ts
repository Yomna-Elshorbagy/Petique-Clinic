import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNewDoctor, deleteDoctor, getAllDoctors, softDeleteDoctor, updateDoctor, getDoctorProfile } from "../../Apis/DoctoresApis";

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateDoctor(id, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctorProfile"] });
    },
  });
};

export const useGetDoctorProfile = () => {
  return useQuery({
    queryKey: ["doctorProfile"],
    queryFn: getDoctorProfile,
  });
};

export const useAllDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
  });
};

export const useAddDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => addNewDoctor(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useSoftDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeleteDoctor(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDoctor(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};