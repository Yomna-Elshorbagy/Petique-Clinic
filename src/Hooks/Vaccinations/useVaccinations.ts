import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseURL } from "../../Apis/BaseUrl";

export interface Vaccination {
  _id: string;
  name: string;
}

export const useVaccinations = () => {
  const token = localStorage.getItem("accessToken");

  return useQuery<Vaccination[]>({
    queryKey: ["vaccinations"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/vacine`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data; 
    },
  });
};

export const getVaccinationOfCategory = (categoryId?: string) => {
  return useQuery({
    queryKey: ["vaccinations", categoryId],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/vacine/ofcategory`, {
        params: { category: categoryId },
      });
      return res.data;
    },
    enabled: !!categoryId,
  });
};
