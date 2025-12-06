import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../../Apis/BaseUrl";

export const useUserPets = () => {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: ["userPets"],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/pet/userPet`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    },
    enabled: !!token,
  });
};
