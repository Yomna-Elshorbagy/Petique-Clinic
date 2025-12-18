import axios from "axios";
import { baseURL } from "./BaseUrl";
import type {
  TotalPetsResponse,
  PetsPerCategoryResponse,
  PetsPerUserResponse,
  AgeDistributionResponse,
  VaccinationStatusResponse,
  UpcomingVaccinationResponse,
  TopCategoriesResponse,
} from "../Hooks/Reservation/Ianalysis";

const BASE_URL = `${baseURL}/analytics`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

/* ========= PET ========= */

// ==> total pets
export const getTotalPetsApi = async () => {
  const { data } = await axios.get<TotalPetsResponse>(
    `${BASE_URL}/pets/total`,
    { headers }
  );
  return data;
};

// ==> pets per category
export const getPetsPerCategoryApi = async () => {
  const { data } = await axios.get<PetsPerCategoryResponse>(
    `${BASE_URL}/pets/per-category`,
    { headers }
  );
  return data;
};

// ==> pets per user
export const getPetsPerUserApi = async () => {
  const { data } = await axios.get<PetsPerUserResponse>(
    `${BASE_URL}/pets/per-user`,
    { headers }
  );
  return data;
};

// ==> pets age distribution
export const getPetsAgeDistributionApi = async () => {
  const { data } = await axios.get<AgeDistributionResponse>(
    `${BASE_URL}/pets/age-distribution`,
    { headers }
  );
  return data;
};

/* ========= VACCINATION ========= */

// ==> vaccination status
export const getVaccinationStatusApi = async () => {
  const { data } = await axios.get<VaccinationStatusResponse>(
    `${BASE_URL}/vaccinations/status`,
    { headers }
  );
  return data;
};

// ==> upcoming vaccinations
export const getUpcomingVaccinationsApi = async () => {
  const { data } = await axios.get<UpcomingVaccinationResponse>(
    `${BASE_URL}/vaccinations/upcoming`,
    { headers }
  );
  return data;
};

/* ========= CATEGORY ========= */

// ==> top categories
export const getTopCategoriesApi = async () => {
  const { data } = await axios.get<TopCategoriesResponse>(
    `${BASE_URL}/categories/top`,
    { headers }
  );
  return data;
};

// ==> top vaccinated categories
export const getTopVaccinatedCategoriesApi = async () => {
  const { data } = await axios.get<TopCategoriesResponse>(
    `${BASE_URL}/vaccinations/top-categories`,
    { headers }
  );
  return data;
};

// ======> Reservation

// ==> doctor workload
export const getDoctorWorkloadApi = async () => {
  const { data } = await axios.get(`${BASE_URL}/doctor-workload`, { headers });
  return data;
};

// ==> monthly reservations trend
export const getMonthlyReservationsTrendApi = async () => {
  const { data } = await axios.get(`${BASE_URL}/monthly-trend`, { headers });
  return data;
};

export const getRevenueAnalysisApi = async () => {
  const { data } = await axios.get(`${BASE_URL}/revenue`, {
    headers,
  });

  return data;
};
