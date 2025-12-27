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
  status: string
) => {
  const { data } = await axios.patch(
    `${STAFF_BASE_URL}/reservations/${id}/status`,
    { status },
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
export const getVaccinationOverviewStaff = async () => {
  const { data } = await axios.get(
    `${STAFF_BASE_URL}/vaccinations/overview`,
    { headers }
  );
  return data.data;
};
