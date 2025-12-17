import axios from "axios";
import type { IProduct } from "../Interfaces/IProducts";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/products`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No auth token");

  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
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
    headers: getHeaders(),
  });

  return data;
};
export interface PriceAlertResponse {
  success: boolean;
  message: string;
  subscribedProductIds: string[];
}

/* ================= PRICE ALERT ================= */

export const subscribeToPriceAlerts = async (productId: string) => {
  const { data } = await axios.post(
    `${BASE_URL}/subscribe-price/${productId}`,
    {},
    { headers: getHeaders() }
  );
  return data;
};

export const unsubscribeFromPriceAlerts = async (productId: string) => {
  const { data } = await axios.delete(
    `${BASE_URL}/unsubscribe-price/${productId}`,
    { headers: getHeaders() }
  );
  return data;
};

export const getUserPriceAlertSubscriptions =
  async (): Promise<PriceAlertResponse> => {
    const { data } = await axios.get(
      `${BASE_URL}/get-subscribed-prices`,
      { headers: getHeaders() }
    );
    return data;
  };
