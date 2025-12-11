import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { IServicePaginated } from "../Interfaces/IService";

const BASE_URL = `${baseURL}/service`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const getAllServices = async (
  page: number = 1,
  size: number = 10,
  search?: string,
  filters?: Record<string, any>,
  sort?: string
): Promise<IServicePaginated> => {
  const params: Record<string, any> = { page, size };

  if (search) params.search = search;
  if (filters) Object.assign(params, filters);
  if (sort) params.sort = sort;

  const { data } = await axios.get(`${BASE_URL}`, { params });
  return data.data;
};

export const getService = async (id: string) => {
  const res = await api.get(`/service/${id}`);
  return res.data;
};

export const addService = async (formData: FormData) => {
  const res = await api.post("/service", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateService = async (id: string, formData: FormData) => {
  const res = await api.put(`/service/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const softDeleteService = async (id: string) => {
  const res = await api.put(`/service/soft/${id}`);
  return res.data;
};

export const deleteService = async (id: string) => {
  const res = await api.delete(`/service/${id}`);
  return res.data;
};
