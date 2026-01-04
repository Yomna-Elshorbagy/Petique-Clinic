import { useQuery } from "@tanstack/react-query";
import { getTrackReservations } from "../../Apis/ReservationApis";
import type { ITrackedReservation } from "../../Interfaces/IReservations";

export const useTrackReservations = () => {
    return useQuery<ITrackedReservation[]>({
        queryKey: ["track-reservations"],
        queryFn: getTrackReservations,
    });
};
