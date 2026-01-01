import axios from "axios";
import { baseURL } from "./BaseUrl";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ================= USER ANALYTICS =================

// 1) Spending summary
export const getUserSpendingSummary = async () => {
  const { data } = await axios.get(
    `${baseURL}/user/spending`,
    { headers: getHeaders() }
  );

  return data.data;
};

// 2) Top categories
export const getUserTopCategories = async () => {
  const { data } = await axios.get(
    `${baseURL}/user/top-categories`,
    { headers: getHeaders() }
  );

  return data.data;
};

// 3) Top products
export const getUserTopProducts = async () => {
  const { data } = await axios.get(
    `${baseURL}/user/top-products`,
    { headers: getHeaders() }
  );

  return data.data;
};
