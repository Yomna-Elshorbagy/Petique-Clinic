import { useQuery } from "@tanstack/react-query";
import { getAllReservations } from "../../Apis/Reservation";
import type { ReservationResponse } from "../../Interfaces/IReservations";

export const useReservations = (params: any = {}) => {
  return useQuery<ReservationResponse>({
    queryKey: ["reservations", params],
    queryFn: async () => {
      const response = await getAllReservations(params);
      return response;
    },
  });
};
