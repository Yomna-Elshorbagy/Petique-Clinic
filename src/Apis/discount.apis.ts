import axios from "axios";
import { baseURL } from "./BaseUrl";
import type {
  ICreateDiscount,
  IDiscount,
  IUpdateDiscount,
} from "../Interfaces/IdiscountInterface";

const DISCOUNT_URL = `${baseURL}/disc`;
const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};
// ===> get active discounts
export const getActiveDiscountsApi = async () => {
  const { data } = await axios.get<{ success: boolean; data: IDiscount[] }>(
    `${DISCOUNT_URL}/active`
  );
  return data.data;
};

// ===> get products with discounts applied
export const getProductsWithDiscountsApi = async () => {
  const { data } = await axios.get(`${DISCOUNT_URL}/products`, {
    headers: getHeaders(),
  });
  return data.data;
};

//===> admin

// create discount
export const createDiscountApi = async (
  payload: ICreateDiscount,
  token: string
) => {
  const { data } = await axios.post(DISCOUNT_URL, payload, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data.data;
};

// ==> get all discounts
export const getDiscountsApi = async () => {
  const { data } = await axios.get<{ data: IDiscount[] }>(DISCOUNT_URL, {
    headers: getHeaders(),
  });
  return data.data;
};

// ===> update discount
export const updateDiscountApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: IUpdateDiscount;
  token: string;
}) => {
  const { data } = await axios.put(`${DISCOUNT_URL}/${id}`, payload, {
    headers: getHeaders(),
  });
  return data.data;
};

// ===> toggle discount
export const toggleDiscountApi = async (id: string) => {
  const { data } = await axios.patch(
    `${DISCOUNT_URL}/toggle/${id}`,
    {},
    {
      headers: getHeaders(),
    }
  );
  return data.data;
};

// soft delete discount
export const softDeleteDiscountApi = async (id: string) => {
  const { data } = await axios.delete(`${DISCOUNT_URL}/soft/${id}`, {
    headers: getHeaders(),
  });
  return data.data;
};
