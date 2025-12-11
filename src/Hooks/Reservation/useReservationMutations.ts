import { deleteReservation, softDeleteReservation, updateReservation } from "../../Apis/ReservationApis";
import { useMutation, useQueryClient } from "@tanstack/react-query";


// 15) soft delete
export const useSoftDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      softDeleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayReservations"] });
    },
  });
};


// 16) hard delete
export const useHardDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayReservations"] });
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
