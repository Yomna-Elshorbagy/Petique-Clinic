import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { IServicePaginated } from "../Interfaces/IService";

const BASE_URL = `${baseURL}/service`;

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
  return data;
};
