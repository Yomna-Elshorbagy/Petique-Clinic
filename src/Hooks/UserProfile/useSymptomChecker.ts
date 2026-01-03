import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../Apis/BaseUrl";
import {
  createSymptomCheck,
  markSymptomCheckResolved,
} from "../../Apis/SymptomCheckerApis";
import type { ISymptomCheckFormData } from "../../Interfaces/ISymptomChecker";

const BASE_URL = `${baseURL}/symptom-checker`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Get all symptom checks for user
export const useUserSymptomChecks = (params?: {
  petId?: string;
  limit?: number;
  page?: number;
}) => {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["symptomChecks", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.petId) queryParams.append("petId", params.petId);
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.page) queryParams.append("page", params.page.toString());

      const { data } = await axios.get(
        `${BASE_URL}/${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`,
        {
          headers: getHeaders(),
        }
      );
      return data;
    },
    enabled: !!token,
  });
};

// Get symptom check statistics
export const useSymptomCheckStats = () => {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["symptomCheckStats"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/stats`, {
        headers: getHeaders(),
      });
      return data.data;
    },
    enabled: !!token,
  });
};

// Create symptom check mutation
export const useCreateSymptomCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ISymptomCheckFormData) => createSymptomCheck(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["symptomChecks"] });
      queryClient.invalidateQueries({ queryKey: ["symptomCheckStats"] });
    },
  });
};

// Mark symptom check as resolved
export const useMarkSymptomCheckResolved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markSymptomCheckResolved(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["symptomChecks"] });
      queryClient.invalidateQueries({ queryKey: ["symptomCheckStats"] });
    },
  });
};

// Get single symptom check
export const useSymptomCheckById = (id: string) => {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["symptomCheck", id],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/${id}`, {
        headers: getHeaders(),
      });
      return data.data;
    },
    enabled: !!token && !!id,
  });
};
