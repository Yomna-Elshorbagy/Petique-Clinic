import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { IUser } from "../Interfaces/IUser";

const DOCTOR_BASE_URL = `${baseURL}/doctor`;
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getAllDoctors = async (): Promise<IUser[]> => {
  const { data } = await axios.get(`${DOCTOR_BASE_URL}/`);
  return data.data;
};

export const addNewDoctor = async (formData: FormData) => {
  const { data } = await axios.post(`${DOCTOR_BASE_URL}/`, formData, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const softDeleteDoctor = async (id: string) => {
  const { data } = await axios.put(
    `${DOCTOR_BASE_URL}/soft/${id}`,
    {},
    {
      headers,
    }
  );
  return data;
};

export const deleteDoctor = async (id: string) => {
  const { data } = await axios.delete(`${DOCTOR_BASE_URL}/deleteDoc/${id}`, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateDoctor = async (id: string, formData: FormData) => {
  const { data } = await axios.put(
    `${DOCTOR_BASE_URL}/updateDoc/${id}`,
    formData,
    {
      headers: {
        authentication: `bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
