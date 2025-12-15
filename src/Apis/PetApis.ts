import axios from "axios";
import { baseURL } from "./BaseUrl";

const BASE_URL = `${baseURL}/pet`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const getMultiPartHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    authentication: `bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
};

//==> add new pet ==> payload for images
export const addPet = async (payload: FormData | any) => {
  const { data } = await axios.post(`${BASE_URL}/`, payload, {
    headers: getMultiPartHeaders(),
  });
  return data.data;
};

//==> update pets
export const updatePet = async (id: string, payload: FormData | any) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, payload, {
    headers: getMultiPartHeaders(),
  });
  return data.data;
};

//==> soft delete
export const softDeletePet = async (id: string) => {
  const { data } = await axios.put(
    `${BASE_URL}/soft/${id}`,
    {},
    { headers: getHeaders() }
  );
  return data;
};

//==> hard delete
export const deletePet = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return data;
};

//==> get all pets
export const getAllPets = async () => {
  const { data } = await axios.get(`${BASE_URL}/`, { headers: getHeaders() });
  return data.data;
};

//===> get pet by id
export const getPetById = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return data.data;
};

//===> get loggedin user pets
export const getUserPets = async () => {
  const { data } = await axios.get(`${BASE_URL}/userPet`, {
    headers: getHeaders(),
  });
  return data.data;
};

//===> count pets in each category
export const getCountCategoryPet = async () => {
  const { data } = await axios.get(`${BASE_URL}/count-cat`, {
    headers: getHeaders(),
  });
  return data.data;
};

export const addVaccinationToPet = async (id: string, data: any) => {
  const { data: responseData } = await axios.post(
    `${baseURL}/pet/${id}/vaccination`,
    data,
    {
      headers: getHeaders(),
    }
  );
  return responseData.data;
};

// ===> get all vaccination records for all pets
export const getVaccinationRecords = async () => {
  const { data } = await axios.get(`${baseURL}/pet/pet-vaccine`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ===> get all vaccination records for a specific pet
export const getPetVaccinations = async (id: string) => {
  const { data } = await axios.get(`${baseURL}/pet/${id}/specific-vaccines`, {
    headers: getHeaders(),
  });
  return data.data;
};

// ===> update specific vaccination for pet
export const updatePetVaccination = async (
  petId: string,
  vaccinationId: string,
  payload: any
) => {
  const { data } = await axios.put(
    `${baseURL}/pet/${petId}/vaccination/${vaccinationId}`,
    payload,
    {
      headers: getHeaders(),
    }
  );
  return data.data;
};

// ===> delete specific vaccination for pet
export const deletePetVaccination = async (
  petId: string,
  vaccinationId: string
) => {
  const { data } = await axios.delete(
    `${baseURL}/pet/${petId}/vaccination/${vaccinationId}`,
    {
      headers: getHeaders(),
    }
  );
  return data;
};
