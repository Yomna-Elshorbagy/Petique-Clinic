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

export const useNotifications = () => {
const token = localStorage.getItem("accessToken");

const notificationsQuery = useQuery({
  queryKey: ["notifications"],
  enabled: !!token,
  queryFn: async () => {
    const { data } = await axios.get(
      `${baseURL}/auth/notifications`,
      { headers: { authentication: `bearer ${token}` } }
    );
    return data.data;
  },
});


  const unreadCount =
    notificationsQuery.data?.filter((n: any) => !n.isRead).length || 0;

  return { ...notificationsQuery, unreadCount };
};
