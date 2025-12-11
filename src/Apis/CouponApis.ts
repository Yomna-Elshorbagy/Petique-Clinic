import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { ICoupon, ICouponResponse, ICouponCreate, ICouponUpdate } from "../Interfaces/ICoupon";

const BASE_URL = `${baseURL}/coupons`;
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getCoupons = async (
  page: number = 1,
  limit: number = 10
): Promise<ICouponResponse> => {
  const { data } = await axios.get(`${BASE_URL}`, {
    headers,
    params: { page, limit },
  });
  return data;
};

export const getCouponById = async (id: string): Promise<ICoupon> => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

export const createCoupon = async (couponData: ICouponCreate): Promise<ICoupon> => {
  const { data } = await axios.post(`${BASE_URL}/addcoupon`, couponData, { headers });
  return data.data;
};

export const updateCoupon = async (
  id: string,
  couponData: ICouponUpdate
): Promise<ICoupon> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, couponData, { headers });
  return data.data;
};

export const deleteCoupon = async (id: string): Promise<any> => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};

export const softDeleteCoupon = async (id: string): Promise<any> => {
  const { data } = await axios.put(
    `${BASE_URL}/${id}`,
    // { isDeleted: true },
    { headers }
  );
  return data;
};

