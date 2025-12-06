import axios from "axios";
import Swal from "sweetalert2";
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
