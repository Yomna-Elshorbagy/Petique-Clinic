import axios from "axios";
import type { IProduct } from "../Interfaces/IProducts";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/products`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductsMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: IProduct[];
}

export const getAllProducts = async (
  page: number = 1,
  limit: number = 12,
  filters: ProductFilters = {}
): Promise<ProductsResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
  };

  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;
  if (typeof filters.minPrice === "number") params.minPrice = filters.minPrice;
  if (typeof filters.maxPrice === "number") params.maxPrice = filters.maxPrice;
  if (typeof filters.inStock === "boolean") params.inStock = filters.inStock;

  const { data } = await axios.get(`${BASE_URL}`, {
    params,
    headers,
  });

  return data;
};
