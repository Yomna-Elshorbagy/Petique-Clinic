import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { IVaccination } from "../Interfaces/IVacination";

const VACCINATION_BASE_URL = `${baseURL}/vaccine`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
  };
};

// ===> get all vaccines
export const getVaccinations = async (): Promise<IVaccination[]> => {
  const { data } = await axios.get(`${VACCINATION_BASE_URL}`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ===> get vaccination by id
export const getVaccination = async (id: string): Promise<IVaccination> => {
  const { data } = await axios.get(`${VACCINATION_BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ===> get vaccinations categories
export const getVaccinationOfCategory = async (
  categoryId: string
): Promise<IVaccination[]> => {
  const { data } = await axios.get(
    `${VACCINATION_BASE_URL}/ofcategory?category=${categoryId}`,
    { headers: getHeaders() }
  );
  return data.data; // Backend returns { success: true, data: vaccinations }
};

// ===> add new vaccination
export const addVaccination = async (vaccinationData: {
  name: string;
  description: string;
  doses: {
    doseNumber: number;
    ageInWeeks: number;
    repeatAfterDays?: number;
    recurring?: boolean;
  }[];
  categories: string[];
}) => {
  const { data } = await axios.post(
    `${VACCINATION_BASE_URL}/`,
    vaccinationData,
    { headers: getHeaders() }
  );
  return data;
};

//===> update vaccination
export const updateVaccination = async (
  id: string,
  vaccinationData: {
    name?: string;
    description?: string;
    doses?: {
      doseNumber: number;
      ageInWeeks: number;
      repeatAfterDays?: number;
      recurring?: boolean;
    }[];
    categories?: string[];
  }
) => {
  const { data } = await axios.put(
    `${VACCINATION_BASE_URL}/${id}`,
    vaccinationData,
    { headers: getHeaders() }
  );
  return data;
};

// ===> soft delete
export const softDeleteVaccination = async (id: string) => {
  const { data } = await axios.put(
    `${VACCINATION_BASE_URL}/soft/${id}`,
    {},
    { headers: getHeaders() }
  );
  return data;
};

// ===> hard delete
export const deleteVaccination = async (id: string) => {
  const { data } = await axios.delete(`${VACCINATION_BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return data;
};
// ===> vaccinate pet
export const vaccinatePetApi = async ({
  petId,
  vaccineId,
  doseNumber,
  date,
}: {
  petId: string;
  vaccineId: string;
  doseNumber: number;
  date: string | Date;
}) => {
  const { data } = await axios.post(
    `${baseURL}/pet/${petId}/vaccinate`,
    {
      vaccineId,
      doseNumber,
      date,
    },
    {
      headers: getHeaders(),
    }
  );

  return data.data;
};
