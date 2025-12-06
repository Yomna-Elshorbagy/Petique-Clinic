import axios from "axios";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/animalCat`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

//==> add animal category
export const addAnimalCategory = async (payload: any) => {
  const { data } = await axios.post(`${BASE_URL}/`, payload, { headers });
  return data.data;
};

//==> update animal category
export const updateAnimalCategory = async (id: string, payload: any) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, payload, { headers });
  return data.data;
};

//==> get all animals category
export const getAllAnimalCategories = async (query: any = {}) => {
  const queryString = new URLSearchParams(query).toString();

  const { data } = await axios.get(
    `${BASE_URL}/?${queryString}`,
    { headers }
  );

  return data.data;
};

//==> get category animal by id
export const getAnimalCategoryById = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

//==> soft delete 
export const softDeleteAnimalCategory = async (id: string) => {
  const { data } = await axios.patch(
    `${BASE_URL}/soft-delete/${id}`,
    {},
    { headers }
  );
  return data;
};

//==> hard delete 
export const deleteAnimalCategory = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};
