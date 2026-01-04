import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { ICategoryStats } from "../Interfaces/categryInterfaces";
import type { DeletedUsersAnalysis, Demographics, UsersOverview } from "../Interfaces/IOverView";

const BASE_URL = `${baseURL}`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};
export const getCategoryStats = async (): Promise<ICategoryStats> => {
  const { data } = await axios.get(`${BASE_URL}/categories/analytics/stats`, {
    headers: getHeaders(),
  });
  return data.data;
};

export const getRevenueDistribution = async (): Promise<
  { category: string; totalRevenue: number }[]
> => {
  const { data } = await axios.get(`${BASE_URL}/categories/getRevenues`, {
    headers: getHeaders(),
  });
  return data.data;
};

export const getOrdersDistribution = async () => {
  const { data } = await axios.get(`${BASE_URL}/order/orderDistrbuted`, {
    headers: getHeaders(),
  });
  return data.data;
};

export const getTopSellingProducts = async () => {
  const { data } = await axios.get(`${BASE_URL}/products/topSelling`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ==> Export APIs
export const exportOrdersToCSV = async () => {
  const response = await axios.get(`${BASE_URL}/order/exportcsv`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  return response.data;
};

export const exportOrdersToPDF = async () => {
  const response = await axios.get(`${BASE_URL}/order/exportpdf`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  return response.data;
};

export const getRevenuePerMonth = async (): Promise<
  { _id: { year: number; month: number }; totalRevenue: number; totalOrders: number }[]
> => {
  const { data } = await axios.get(`${BASE_URL}/order/revenue`, {
    headers: getHeaders(),
  });
  return data.data;
};

export const getUsersOverview = async (): Promise<UsersOverview> => {
  const { data } = await axios.get(`${baseURL}/user/analysis/overview`, {
    headers: getHeaders(),
  });
  return data.data;
};

export const getDeletedUsersAnalysis =
  async (): Promise<DeletedUsersAnalysis> => {
    const { data } = await axios.get(`${baseURL}/user/analysis/deleted`, {
      headers: getHeaders(),
    });
    return data;
  };

export const getAllOrders = async (page = 1, limit = 1000) => {
  const { data } = await axios.get(`${BASE_URL}/order/allorders`, {
    headers: getHeaders(),
    params: { page, limit },
  });
  return data;
};

export const getDemographics = async (): Promise<Demographics> => {
  const { data } = await axios.get(`${BASE_URL}/user/analysis/demographics`, {
    headers: getHeaders(),
  });
  return data;
};
