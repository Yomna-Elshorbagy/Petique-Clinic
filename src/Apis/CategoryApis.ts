import axios from "axios";
import type { ICategory, ICategoryStats, ITrendingCategory } from "../Interfaces/categryInterfaces";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/categories`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};


export const getAllCategories = async (): Promise<ICategory[]> => {
  const { data } = await axios.get(`${BASE_URL}`);
  return data.data;
};

export const getCategories = async (
  page: number = 1,
  size: number = 10,
  search?: string
): Promise<{
  success: boolean;
  results: number;
  category: ICategory[];
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    prevPage: number | null;
  };
}> => {
  const params: Record<string, any> = { page, size };
  if (search) params.search = search;

  const { data } = await axios.get(`${BASE_URL}/getCategories`, {
    params,
  });
  return data;
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

export const addCategory = async (formData: FormData): Promise<ICategory> => {
  const { data } = await axios.post(`${BASE_URL}/addCategory`, formData, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const updateCategory = async (
  id: string,
  formData: FormData
): Promise<ICategory> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const deleteCategory = async (id: string): Promise<any> => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};

export const softDeleteCategories = async (
  id: string,
  token: string
): Promise<any> => {
  const { data } = await axios.put(
    `${BASE_URL}/soft/${id}`,
    {},
    {
      headers: { authentication: `bearer ${token}` },
    }
  );
  return data;
};
export const getProductsByCategory = async (id: string): Promise<any> => {
  const { data } = await axios.get(`${BASE_URL}/${id}/products`, { headers });
  return data.data;
};

export const getTrendingCategories = async (): Promise<ITrendingCategory[]> => {
  const { data } = await axios.get(`${BASE_URL}/analytics/trending`, {
    headers,
  });
  return data.data;
};

export const getCategoryStats = async (): Promise<ICategoryStats> => {
  const { data } = await axios.get(`${BASE_URL}/analytics/stats`, { headers });
  return data.data;
};

export const getRevenueDistribution = async (): Promise<
  { category: string; totalRevenue: number }[]
> => {
  const { data } = await axios.get(`${BASE_URL}/getRevenues`, { headers });
  return data.data;
};