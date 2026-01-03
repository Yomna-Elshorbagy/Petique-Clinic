import axios from "axios";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/symptom-checker`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ==> create a new symptom check
export const createSymptomCheck = async (payload: {
  petId: string;
  appetite: string;
  energy: string;
  vomiting: boolean;
  age: string;
  additionalNotes?: string;
}) => {
  const { data } = await axios.post(`${BASE_URL}/`, payload, {
    headers: getHeaders(),
  });
  return data.data;
};

// ==> Get all symptom checks for the authenticated user
export const getUserSymptomChecks = async (params?: {
  petId?: string;
  limit?: number;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.petId) queryParams.append("petId", params.petId);
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.page) queryParams.append("page", params.page.toString());

  const { data } = await axios.get(
    `${BASE_URL}/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    {
      headers: getHeaders(),
    }
  );
  return data.data;
};

// ==> Get symptom check statistics
export const getSymptomCheckStats = async () => {
  const { data } = await axios.get(`${BASE_URL}/stats`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ==> Get a specific symptom check by ID
export const getSymptomCheckById = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ==> Mark symptom check as resolved
export const markSymptomCheckResolved = async (id: string) => {
  const { data } = await axios.patch(
    `${BASE_URL}/${id}/resolve`,
    {},
    {
      headers: getHeaders(),
    }
  );
  return data.data;
};
