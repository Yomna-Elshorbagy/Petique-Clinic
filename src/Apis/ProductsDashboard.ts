import axios from "axios";

import { baseURL } from "./BaseUrl";
import type { IProduct, IProductStats } from "../Interfaces/IProducts";

const BASE_URL = `${baseURL}/products`;
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getProducts = async (
  page: number = 1,
  size: number = 20,
  search?: string,
  category?: string
): Promise<{
  success: boolean;
  results: number;
  data: IProduct[];
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    prevPage: number | null;
  };
}> => {
  const params: Record<string, any> = { page, size };
  if (search) params.keyword = search;
  if (category) params.category = category;

  const { data } = await axios.get(`${BASE_URL}/getproducts`, {
    headers,
    params,
  });
  return data;
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

export const addProduct = async (formData: FormData): Promise<IProduct> => {
  const { data } = await axios.post(`${BASE_URL}/`, formData, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<IProduct> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

// ===> delete product
export const deleteProduct = async (id: string): Promise<any> => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};

// ===> soft delete
export const softDeleteProducts = async (
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

export const getRelatedProducts = async (
  productId: string
): Promise<IProduct[]> => {
  const { data } = await axios.get(`${BASE_URL}/related/${productId}`, {
    headers,
  });
  return data.relatedProducts;
};

export const getLowStockProducts = async (
  threshold: number = 10
): Promise<IProduct[]> => {
  const { data } = await axios.get(`${BASE_URL}/lowstock`, {
    headers,
    params: { threshold },
  });
  return data.products;
};

export const contactProductOwner = async (productId: string) => {
  const { data } = await axios.get(`${BASE_URL}/contact/${productId}`, {
    headers,
  });
  return data.chatDetails;
};

export const getProductStats = async (): Promise<IProductStats> => {
  const { data } = await axios.get(`${BASE_URL}/analytics/stats`, { headers });
  return data.data;
};

export const getTopSellingProducts = async () => {
  const { data } = await axios.get(`${BASE_URL}/topSelling`, {
    headers,
  });
  return data.data;
};
