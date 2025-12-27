import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignDoctorToReservationStaff, getAllPetOwnersStaff, getAllPetsStaff, getAllReservationsStaff, getReservationsPerServiceStaff, getStaffDashboardStats, getTodayReservationsStaff, getVaccinationOverviewStaff, updateReservationStatusStaff } from "../../Apis/StaffApis";

// ================= RESERVATIONS =================

// all reservations
export const useStaffReservations = (params: any = {}) => {
  return useQuery({
    queryKey: ["staff-reservations", params],
    queryFn: () => getAllReservationsStaff(params),
  });
};

// today reservations
export const useStaffTodayReservations = () => {
  return useQuery({
    queryKey: ["staff-today-reservations"],
    queryFn: getTodayReservationsStaff,
  });
};

// update reservation status
export const useUpdateReservationStatusStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => updateReservationStatusStaff(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-reservations"] });
      queryClient.invalidateQueries({
        queryKey: ["staff-today-reservations"],
      });
    },
  });
};

// assign doctor
export const useAssignDoctorStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservationId,
      doctorId,
    }: {
      reservationId: string;
      doctorId: string;
    }) => assignDoctorToReservationStaff(reservationId, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-reservations"] });
    },
  });
};

// ================= DASHBOARD =================

// dashboard stats
export const useStaffDashboardStats = () => {
  return useQuery({
    queryKey: ["staff-dashboard-stats"],
    queryFn: getStaffDashboardStats,
  });
};

// reservations per service
export const useStaffReservationsByService = () => {
  return useQuery({
    queryKey: ["staff-reservations-by-service"],
    queryFn: getReservationsPerServiceStaff,
  });
};

// ================= PETS & USERS =================

// all pets
export const useStaffPets = () => {
  return useQuery({
    queryKey: ["staff-pets"],
    queryFn: getAllPetsStaff,
  });
};

// all pet owners
export const useStaffPetOwners = () => {
  return useQuery({
    queryKey: ["staff-pet-owners"],
    queryFn: getAllPetOwnersStaff,
  });
};

// ================= VACCINATIONS =================

// vaccination overview
export const useStaffVaccinationOverview = () => {
  return useQuery({
    queryKey: ["staff-vaccination-overview"],
    queryFn: getVaccinationOverviewStaff,
  });
};
