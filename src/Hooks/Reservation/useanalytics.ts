import { useQuery } from "@tanstack/react-query";
import {
  getDoctorWorkloadApi,
  getMonthlyReservationsTrendApi,
  getPetsAgeDistributionApi,
  getPetsPerCategoryApi,
  getPetsPerUserApi,
  getRevenueAnalysisApi,
  getTopCategoriesApi,
  getTopVaccinatedCategoriesApi,
  getTotalPetsApi,
  getUpcomingVaccinationsApi,
  getVaccinationStatusApi,
} from "../../Apis/AnalyticsReservation";

/* ========= PET ========= */

// ==> Total pets
export const useTotalPets = () =>
  useQuery({
    queryKey: ["analytics", "totalPets"],
    queryFn: getTotalPetsApi,
  });

// ==> Pets per category
export const usePetsPerCategory = () =>
  useQuery({
    queryKey: ["analytics", "petsPerCategory"],
    queryFn: getPetsPerCategoryApi,
  });

// ==> Pets per user
export const usePetsPerUser = () =>
  useQuery({
    queryKey: ["analytics", "petsPerUser"],
    queryFn: getPetsPerUserApi,
  });

// ==> Pets age distribution
export const usePetsAgeDistribution = () =>
  useQuery({
    queryKey: ["analytics", "ageDistribution"],
    queryFn: getPetsAgeDistributionApi,
  });

/* ========= VACCINATION ========= */

// ==> Vaccination status
export const useVaccinationStatus = () =>
  useQuery({
    queryKey: ["analytics", "vaccinationStatus"],
    queryFn: getVaccinationStatusApi,
  });

// ==> Upcoming vaccinations
export const useUpcomingVaccinations = () =>
  useQuery({
    queryKey: ["analytics", "upcomingVaccinations"],
    queryFn: getUpcomingVaccinationsApi,
  });

/* ========= CATEGORY ========= */

// ==> Top categories
export const useTopCategories = () =>
  useQuery({
    queryKey: ["analytics", "topCategories"],
    queryFn: getTopCategoriesApi,
  });

// ==> Top vaccinated categories
export const useTopVaccinatedCategories = () =>
  useQuery({
    queryKey: ["analytics", "topVaccinatedCategories"],
    queryFn: getTopVaccinatedCategoriesApi,
  });

// ==> Doctor workload
export const useDoctorWorkload = () =>
  useQuery({
    queryKey: ["analytics", "doctorWorkload"],
    queryFn: getDoctorWorkloadApi,
  });

// ==> Monthly reservations trend
export const useMonthlyReservationsTrend = () =>
  useQuery({
    queryKey: ["analytics", "monthlyTrend"],
    queryFn: getMonthlyReservationsTrendApi,
  });

  
export const useRevenueAnalysis = () => {
  return useQuery({
    queryKey: ["analytics", "revenue"],
    queryFn: getRevenueAnalysisApi,
  });
};