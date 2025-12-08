import { useQuery } from "@tanstack/react-query";
import {
  getAllReservations,
  getReservationById,
  getUpcomingReservations,
  getPastReservations,
  checkAvailableSlots,
  getDoctorTodayReservations,
  getDoctorWeeklyReservations,
  getTotalReservations,
  getReservationsByService,
  getDailyReservations,
  getMonthlyReservations,
  getMostActiveDoctors,
  filterReservations,
  getReservationsByStatus,
} from "../../Apis/ReservationApis";

// 1) get all reservations
export const useReservations = (params: any = {}) => {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: () => getAllReservations(params),
  });
};

// 2) get reservation by id
export const useReservationById = (id: string) => {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: () => getReservationById(id),
    enabled: !!id,
  });
};

// 3) upcoming reservations
export const useUpcomingReservations = () => {
  return useQuery({
    queryKey: ["reservations-upcoming"],
    queryFn: getUpcomingReservations,
  });
};

// 4) past reservations
export const usePastReservations = () => {
  return useQuery({
    queryKey: ["reservations-past"],
    queryFn: getPastReservations,
  });
};

// 5) check avilable slots
export const useAvailableSlots = (doctorId: string, date: string) => {
  return useQuery({
    queryKey: ["reservation-availability", doctorId, date],
    queryFn: () => checkAvailableSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
};

// 6) doctor today
export const useDoctorTodayReservations = () => {
  return useQuery({
    queryKey: ["doctor-today-reservations"],
    queryFn: getDoctorTodayReservations,
  });
};

// 7) doctor weekly
export const useDoctorWeeklyReservations = () => {
  return useQuery({
    queryKey: ["doctor-weekly-reservations"],
    queryFn: getDoctorWeeklyReservations,
  });
};

// 8) TOTAL RESERVATIONS
export const useTotalReservations = () => {
  return useQuery({
    queryKey: ["reservations-total"],
    queryFn: getTotalReservations,
  });
};

// 9) reservations per service
export const useReservationsByService = () => {
  return useQuery({
    queryKey: ["reservations-by-service"],
    queryFn: getReservationsByService,
  });
};

// 10) daily report
export const useDailyReservations = (date?: string) => {
  return useQuery({
    queryKey: ["reservations-daily", date],
    queryFn: () => getDailyReservations(date),
  });
};

// 11) monthly report
export const useMonthlyReservations = (
  year?: number,
  month?: number
) => {
  return useQuery({
    queryKey: ["reservations-monthly", year, month],
    queryFn: () => getMonthlyReservations(year, month),
  });
};

// 12) most active doctor
export const useMostActiveDoctors = () => {
  return useQuery({
    queryKey: ["most-active-doctors"],
    queryFn: getMostActiveDoctors,
  });
};

// 13) filter reservation
export const useFilterReservations = (params: any) => {
  return useQuery({
    queryKey: ["reservations-filter", params],
    queryFn: () => filterReservations(params),
    enabled: !!params,
  });
};

// 14) reservations by status
export const useReservationsByStatus = (status: string) => {
  return useQuery({
    queryKey: ["reservations-status", status],
    queryFn: () => getReservationsByStatus(status),
    enabled: !!status,
  });
};
