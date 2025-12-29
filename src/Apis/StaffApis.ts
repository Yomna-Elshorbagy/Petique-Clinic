import axios from "axios";
import { baseURL } from "./BaseUrl";

const STAFF_BASE_URL = `${baseURL}/staff`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

// ================= RESERVATIONS =================

// get all reservations
export const getAllReservationsStaff = async (params: any = {}) => {
  const { data } = await axios.get(`${STAFF_BASE_URL}/reservations`, {
    headers,
    params,
  });
  return data.data;
};

// update reservation status
export const updateReservationStatusStaff = async (
  id: string,
  updates: { status?: string; date?: string; timeSlot?: string }
) => {
  const { data } = await axios.patch(
    `${STAFF_BASE_URL}/reservations/${id}/status`,
    updates,
    { headers }
  );
  return data.data;
};

// assign doctor
export const assignDoctorToReservationStaff = async (
  reservationId: string,
  doctorId: string
) => {
  const { data } = await axios.patch(
    `${STAFF_BASE_URL}/reservations/${reservationId}/assign-doctor`,
    { doctorId },
    { headers }
  );
  return data.data;
};

// get today reservations
export const getTodayReservationsStaff = async () => {
  const { data } = await axios.get(
    `${STAFF_BASE_URL}/reservations/today`,
    { headers }
  );
  return data.data;
};

// ================= DASHBOARD =================

// dashboard stats
export const getStaffDashboardStats = async () => {
  const { data } = await axios.get(
    `${STAFF_BASE_URL}/dashboard/stats`,
    { headers }
  );
  return data.data;
};

// reservations per service
export const getReservationsPerServiceStaff = async () => {
  const { data } = await axios.get(
    `${STAFF_BASE_URL}/dashboard/reservations-per-service`,
    { headers }
  );
  return data.data;
};

// ================= PETS & USERS =================

// get all pets
export const getAllPetsStaff = async () => {
  const { data } = await axios.get(`${STAFF_BASE_URL}/pets`, { headers });
  return data.data;
};

// get all pet owners
export const getAllPetOwnersStaff = async () => {
  const { data } = await axios.get(`${STAFF_BASE_URL}/pet-owners`, { headers });
  return data.data;
};

// ================= VACCINATIONS =================

// vaccination overview
export const getVaccinationOverviewStaff = async (params: any = {}) => {
  const { data } = await axios.get(
    `${STAFF_BASE_URL}/vaccinations/overview`,
    {
      headers,
      params
    }
  );
  return data.data;
};

// get pet owner details with pets & vaccinations
export const getPetOwnerDetailsStaff = async (userId: string) => {
  const { data } = await axios.get(
    `${STAFF_BASE_URL}/pet-owners/${userId}`,
    { headers }
  );
  return data.data;
};

// update vaccination status (staff)
export const updatePetVaccinationStaff = async (
  petId: string,
  vaccinationHistoryId: string,
  updates: {
    status?: string;
    date?: string;
    nextDose?: string;
    doseNumber?: number;
  }
) => {
  const { data } = await axios.patch(
    `${STAFF_BASE_URL}/pets/${petId}/vaccinations/${vaccinationHistoryId}`,
    updates,
    { headers }
  );

  return data.data;
};