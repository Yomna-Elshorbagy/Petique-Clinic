import { useState } from "react";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { baseURL } from "../../Apis/BaseUrl";

interface AddPetFormData {
  name: string;
  age: string | number;
  weight: string | number;
  category: string;
  allergies: string[];
  vaccinationHistory: string[];
  image: File | null;
}

interface AddPetResponse {
  success: boolean;
  message: string;
  data: any;
}

export const useAddPet = (): {
  formData: AddPetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddPetFormData>>;
  mutation: UseMutationResult<AddPetResponse, unknown, void>;
} => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState<AddPetFormData>({
    name: "",
    age: "",
    weight: "",
    category: "",
    allergies: [],
    vaccinationHistory: [],
    image: null,
  });

  const mutation = useMutation<AddPetResponse, unknown, void>({
    mutationFn: async () => {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => dataToSend.append(key, v));
        } else if (value !== null) {
          dataToSend.append(key, value);
        }
      });

      const res = await axios.post(`${baseURL}/pet`, dataToSend, {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      Swal.fire({
        icon: "success",
        title: "Pet Added",
        text: res.message || "Your pet was added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Add Pet Failed",
        text: error.response?.data?.message || "Error adding pet",
      });
    },
  });

  return { formData, setFormData, mutation };
};
