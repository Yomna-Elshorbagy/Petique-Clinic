import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { addService, deleteService, getAllServices, getService, softDeleteService, updateService } from "../../Apis/ServicesApis";


export const useServices = (page?: number, size?: number, search?: string) => {
  return useQuery({
    queryKey: ["services", page, size, search],
    queryFn: () => getAllServices(page, size, search),
  });
};


export const useService = (id: string) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getService(id),
    enabled: !!id,
  });
};


export const useAddService = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addService,
    onSuccess: () => {
      toast.success("Service created successfully");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });
};


export const useUpdateService = (id: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateService(id, formData),
    onSuccess: () => {
      toast.success("Service updated");
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["service", id] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });
};


export const useSoftDeleteService = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: softDeleteService,
    onSuccess: () => {
      toast.success("Service moved to trash");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });
};

export const useDeleteService = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      toast.success("Service deleted permanently");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });
};
