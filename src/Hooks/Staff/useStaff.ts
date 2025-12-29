import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignDoctorToReservationStaff,
  getAllPetOwnersStaff,
  getAllPetsStaff,
  getAllReservationsStaff,
  getPetOwnerDetailsStaff,
  getReservationsPerServiceStaff,
  getStaffDashboardStats,
  getTodayReservationsStaff,
  getVaccinationOverviewStaff,
  updatePetVaccinationStaff,
  updateReservationStatusStaff,
} from "../../Apis/StaffApis";

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
      updates,
    }: {
      id: string;
      updates: { status?: string; date?: string; timeSlot?: string };
    }) => updateReservationStatusStaff(id, updates),
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
export const useStaffVaccinationOverview = (params: any = {}) => {
  return useQuery({
    queryKey: ["staff-vaccination-overview", params],
    queryFn: () => getVaccinationOverviewStaff(params),
  });
};

// update vaccination status
export const useUpdatePetVaccinationStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      vaccinationHistoryId,
      updates,
    }: {
      petId: string;
      vaccinationHistoryId: string;
      updates: {
        status?: string;
        date?: string;
        nextDose?: string;
        doseNumber?: number;
      };
    }) =>
      updatePetVaccinationStaff(petId, vaccinationHistoryId, updates),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-vaccination-overview"],
      });
    },
  });
};
// ================= PET OWNER DETAILS =================

export const useStaffPetOwnerDetails = (userId: string) => {
  return useQuery({
    queryKey: ["staff-pet-owner-details", userId],
    queryFn: () => getPetOwnerDetailsStaff(userId),
    enabled: !!userId, // prevents firing before id exists
  });
};
