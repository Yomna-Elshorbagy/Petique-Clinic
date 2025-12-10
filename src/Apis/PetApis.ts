import axios from "axios";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/pet`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

//==> add new pet ==> payload for images
export const addPet = async (payload: FormData | any) => {
  const { data } = await axios.post(`${BASE_URL}/`, payload, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

//==> update pets
export const updatePet = async (id: string, payload: FormData | any) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, payload, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

//==> soft delete
export const softDeletePet = async (id: string) => {
  const { data } = await axios.put(`${BASE_URL}/soft/${id}`, {}, { headers });
  return data;
};

//==> hard delete
export const deletePet = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};

//==> get all pets
export const getAllPets = async () => {
  const { data } = await axios.get(`${BASE_URL}/`, { headers });
  return data.data;
};

//===> get pet by id
export const getPetById = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });
  return data.data;
};

//===> get loggedin user pets
export const getUserPets = async () => {
  const { data } = await axios.get(`${BASE_URL}/userPet`, { headers });
  return data.data;
};

//===> count pets in each category
export const getCountCategoryPet = async () => {
  const { data } = await axios.get(`${BASE_URL}/count-cat`, { headers });
  return data.data;
};

export const addVaccinationToPet = async (id: string, data: any) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(`${baseURL}/pet/${id}/vaccination`, data, {
    headers: { authentication: `bearer ${token}` },
  });
  return res.data;
};

// ===> get all vaccination records for all pets
export const getVaccinationRecords = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${baseURL}/pet/pet-vaccine`, {
    headers: { authentication: `bearer ${token}` },
  });
  return res.data.data;
};

// ===> get all vaccination records for a specific pet
export const getPetVaccinations = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.get(`${baseURL}/pet/${id}/specific-vaccines`, {
    headers: { authentication: `bearer ${token}` },
  });
  return res.data;
};
