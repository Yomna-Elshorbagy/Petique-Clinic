import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useVaccinationRecords = () => {
  return useQuery({
    queryKey: ["vaccination-records"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/vaccination/records`,
        { headers: { token: localStorage.getItem("token") } }
      );
      return data.data;
    },
  });
};
