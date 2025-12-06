import axios from "axios";
import { baseURL } from "./BaseUrl";

const VACCINATION_BASE_URL = `${baseURL}/vaccine`;
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
};

export interface IVaccination {
  _id: string;
  name: string;
  description?: string;
  doses?: number;
  categories?: string[];
  createdBy?: { userName: string };
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

// ===> get all vaccines
export const getVaccinations = async (): Promise<IVaccination[]> => {
  const { data } = await axios.get(`${VACCINATION_BASE_URL}`);
  return data.data;
};

// ===> get vaccination by id
export const getVaccination = async (id: string): Promise<IVaccination> => {
  const { data } = await axios.get(`${VACCINATION_BASE_URL}/${id}`);
  return data.data;
};

// ===> get vaccinations categories
export const getVaccinationOfCategory = async (
  categoryId: string
): Promise<IVaccination[]> => {
  const { data } = await axios.get(
    `${VACCINATION_BASE_URL}/ofcategory?category=${categoryId}`
  );
  return data;
};

// ===> add new vaccination
export const addVaccination = async (vaccinationData: {
  name: string;
  description?: string;
  doses?: number;
  categories?: string[];
}) => {
  const { data } = await axios.post(
    `${VACCINATION_BASE_URL}/`,
    vaccinationData,
    { headers, withCredentials: true }
  );
  return data;
};

//===> update vaccination
export const updateVaccination = async (
  id: string,
  vaccinationData: {
    name?: string;
    description?: string;
    doses?: number;
    categories?: string[];
  }
) => {
  const { data } = await axios.put(
    `${VACCINATION_BASE_URL}/${id}`,
    vaccinationData,
    { headers, withCredentials: true }
  );
  return data;
};

// ===> soft delete
export const softDeleteVaccination = async (id: string) => {
  const { data } = await axios.put(
    `${VACCINATION_BASE_URL}/soft/${id}`,
    {},
    { headers, withCredentials: true }
  );
  return data;
};

// ===> hard delete
export const deleteVaccination = async (id: string) => {
  const { data } = await axios.delete(`${VACCINATION_BASE_URL}/${id}`, {
    headers,
    withCredentials: true,
  });
  return data;
};
