import { useQuery } from "@tanstack/react-query";
import { doctorSearchPets, doctorTodayWithVaccinationAlerts } from "../../Apis/ReservationApis";

export const useDoctorSearchPets = (search: string) => {
    return useQuery({
        queryKey: ["doctorSearchPets", search],
        queryFn: () => doctorSearchPets(search),
        enabled: search.length > 0, // Only search if there's a term
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useDoctorTodayWithVaccinationAlerts = () => {
    return useQuery({
        queryKey: ["doctorTodayWithVaccinationAlerts"],
        queryFn: doctorTodayWithVaccinationAlerts,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
