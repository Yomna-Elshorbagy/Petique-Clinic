import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { baseURL } from "../../Apis/BaseUrl";

export function useUserProfile() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    newPassword: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken");

  // ===> Fetch profile
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/user/profile`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  // ===> set form data when fetched
  useEffect(() => {
    if (data) {
      setFormData({
        userName: data.userName || "",
        email: data.email || "",
        mobileNumber: data.mobileNumber || "",
        gender: data.gender || "",
        newPassword: "",
        confirmPassword: "",
      });
      if (data.image?.secure_url) setPreview(data.image.secure_url);
    }
  }, [data]);

  // ===> input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===> image handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ===> mutation for update
  const mutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      if (imageFile) formDataToSend.append("image", imageFile);

      const res = await axios.put(
        `${baseURL}/user`,
        formDataToSend,
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your information was updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Error updating profile",
      });
    },
  });

  // ===> Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return {
    formData,
    setFormData,
    preview,
    handleChange,
    handleImageChange,
    handleSubmit,
    mutation,
    isLoading,
    isError,
    data,
  };
}
