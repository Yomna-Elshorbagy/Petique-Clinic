// src/Hooks/UserProfile/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../Apis/BaseUrl";

export interface Category {
  _id: string;
  name: string;
}
  const token = localStorage.getItem("accessToken");

export const useAnimalCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/animalCat`,
         {
        headers: {
          authentication: `bearer ${token}`,
        },
      }
      );
      console.log(res);
      
      return res.data.data;
    },
  });
};
