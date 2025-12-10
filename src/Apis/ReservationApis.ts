import axios from "axios";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/reserve`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

// ===> create Reservations
export const addReservation = async (payload: any) => {
  const { data } = await axios.post(`${BASE_URL}/`, payload, { headers });
  return data.data;
};

// ===> update reservations
export const updateReservation = async (id: string, payload: any) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, payload, { headers });
  return data.data;
};

// ===> soft delete reservations
export const softDeleteReservation = async (id: string) => {
  const { data } = await axios.put(`${BASE_URL}/soft/${id}`, {}, { headers });
  return data.data;
};

// ===> hard delete reservations
export const deleteReservation = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

// ===> get all reservations
export const getAllReservations = async (params: any = {}) => {
  const { data } = await axios.get(`${BASE_URL}/`, {
    headers,
    params,
  });
  return data;
};

// ===> get specific reservations
export const getReservationById = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

// ===> get upcomming reservations
export const getUpcomingReservations = async () => {
  const { data } = await axios.get(`${BASE_URL}/types/upcoming`, { headers });
  return data.data;
};

// ===> get past reservations
export const getPastReservations = async () => {
  const { data } = await axios.get(`${BASE_URL}/types/past`, { headers });
  return data.data;
};

// ===> check avilable slots
export const checkAvailableSlots = async (doctor: string, date: string) => {
  const { data } = await axios.get(`${BASE_URL}/check/availability`, {
    headers,
    params: { doctor, date },
  });
  return data;
};

// ===> get doctor today reservations
export const getDoctorTodayReservations = async () => {
  const { data } = await axios.get(`${BASE_URL}/doctor/reservations/today`, {
    headers,
  });
  return data.data;
};

// ===> get doctor weekly
export const getDoctorWeeklyReservations = async () => {
  const { data } = await axios.get(`${BASE_URL}/doctor/reservations/weekly`, {
    headers,
  });
  return data.data;
};

// ===> stat: total
export const getTotalReservations = async () => {
  const { data } = await axios.get(`${BASE_URL}/stats/total`, { headers });
  return data.total;
};

// ===> STAT: per service
export const getReservationsByService = async () => {
  const { data } = await axios.get(`${BASE_URL}/stats/service`, { headers });
  return data.data;
};

// ===> daily report
export const getDailyReservations = async (date?: string) => {
  const { data } = await axios.get(`${BASE_URL}/stats/daily`, {
    headers,
    params: { date },
  });
  return data.data;
};

// ===> monthly report
export const getMonthlyReservations = async (year?: number, month?: number) => {
  const { data } = await axios.get(`${BASE_URL}/stats/monthly`, {
    headers,
    params: { year, month },
  });
  return data.data;
};

// ===> get most active doctors
export const getMostActiveDoctors = async () => {
  const { data } = await axios.get(`${BASE_URL}/stats/most-active-doctors`, {
    headers,
  });
  return data.data;
};

// ===> filter search reservations
export const filterReservations = async (params: any) => {
  const { data } = await axios.get(`${BASE_URL}/filter/search`, {
    headers,
    params,
  });
  return data.data;
};

// ===> get by status
export const getReservationsByStatus = async (status: string) => {
  const { data } = await axios.get(`${BASE_URL}/status/${status}`, {
    headers,
  });
  return data.data;
};
