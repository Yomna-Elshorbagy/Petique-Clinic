import axios from "axios";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/service`;

const getToken = () => localStorage.getItem("accessToken");

const getHeaders = () => {
  const token = getToken();
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Helper for multipart/form-data headers
const getMultipartHeaders = () => {
  const token = getToken();
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
};

export const getAllServices = async (
  page: number = 1,
  size: number = 10,
  search?: string,
  filters?: Record<string, any>,
  sort?: string
) => {
  const params: Record<string, any> = { page, size };

  if (search) params.search = search;
  if (filters) Object.assign(params, filters);
  if (sort) params.sort = sort;

  const { data } = await axios.get(`${BASE_URL}`, { params });
  return data; // Return full response including metadata and data array
};

export const getService = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`);
  return data.data;
};

export const addService = async (formData: FormData) => {
  const { data } = await axios.post(`${BASE_URL}`, formData, {
    headers: getMultipartHeaders(),
  });
  return data;
};

export const updateService = async (id: string, formData: FormData) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: getMultipartHeaders(),
  });
  return data;
};

export const softDeleteService = async (id: string) => {
  // Using PUT for soft delete as per PetApis pattern typically, or specific endpoint
  // Based on user request/backend code: router.put("/soft/:id", ...)
  const { data } = await axios.put(`${BASE_URL}/soft/${id}`, {}, {
    headers: getHeaders(),
  });
  return data;
};

export const deleteService = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return data;
};
