import {
  deleteReservation,
  softDeleteReservation,
  updateReservation,
  addReservation,
} from "../../Apis/ReservationApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { type AxiosResponse } from "axios";
export interface ReservationAddAdmin {
  _id?: string;
  userId?: string;
  pet?: string;
  doctor?: string | null;
  service?: string;
  date?: string;
  timeSlot?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus?: "unpaid" | "paid";
  notes?: string;
}
// 15) soft delete
export const useSoftDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => softDeleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayReservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations", "today"] });
    },
  });
};

// 16) hard delete
export const useHardDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayReservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations", "today"] });
    },
  });
};

// 17) update reservation
export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateReservation(id, data),

    onSuccess: () => {
      const keysToInvalidate = [
        ["reservations"],
        ["reservation"],
        ["doctor-today-reservations"],
        ["doctor-weekly-reservations"],
      ];

      keysToInvalidate.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
  });
};

// 18) add reservation

export const useAddReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addReservation(data),
    onSuccess: () => {
      const keysToInvalidate = [
        ["reservations"],
        ["todayReservations"],
        ["doctor-today-reservations"],
        ["doctor-weekly-reservations"],
      ];
      keysToInvalidate.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },
  });
};

export const useAddReservationByAdmin = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("accessToken") || "";

  return useMutation<AxiosResponse<any>, any, ReservationAddAdmin>({
    mutationFn: (data: ReservationAddAdmin) =>
      axios.post("http://localhost:3000/reserve/addByAdmin", data, {
        headers: { authentication: `bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["todayReservations"] });
    },
  });
};
