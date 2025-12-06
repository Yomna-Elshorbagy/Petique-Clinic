import axios from "axios";
import { baseURL } from "./BaseUrl";

const DOCTOR_BASE_URL = `${baseURL}/user`;
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export interface IUserDoctor {
  _id: string;
  userName: string;
  email: string;
  mobileNumber?: string;
  gender?: string;
  status?: string;
}

export const getAllDoctors = async (): Promise<IUserDoctor[]> => {
  const { data } = await axios.get(`${DOCTOR_BASE_URL}/doctor`);
  return data.data;
};

export const addNewDoctor = async (formData: FormData) => {
  const { data } = await axios.post(`${DOCTOR_BASE_URL}/newDoctor`, formData, {
    headers: {
      authentication: `bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return data;
};

export const softDeleteDoctor = async () => {
  const { data } = await axios.put(
    `${DOCTOR_BASE_URL}/soft`,
    {},
    {
      headers,
      withCredentials: true,
    }
  );
  return data;
};

export const deleteDoctor = async (id: string) => {
  const { data } = await axios.delete(`${DOCTOR_BASE_URL}/deleteDoc/${id}`, {
    headers,
    withCredentials: true,
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
      withCredentials: true,
    }
  );

  return data;
};
