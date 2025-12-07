import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { IContact } from "../Interfaces/IContact ";
import type { IReplyContact } from "../Interfaces/IEmails";

const BASE_URL = `${baseURL}/contact`;
const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

export const getAllContacts = async (
  page: number = 1,
  limit: number = 8
): Promise<{
  data: IContact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
  };
}> => {
  const { data } = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`, {
    headers,
  });
  return {
    data: data.data,
    pagination: data.pagination,
  };
};

export const createContact = async (contactData: {
  fullName: string;
  email: string;
  message: string;
}): Promise<any> => {
  const { data } = await axios.post(BASE_URL, contactData, { headers });
  return data;
};

export const replyToContact = async (
  id: string,
  replyMessage: string
): Promise<IReplyContact> => {
  const { data } = await axios.post(
    `${BASE_URL}/reply/${id}`,
    { replyMessage },
    { headers }
  );
  return data.data;
};
export const updateContact = async (
  id: string,
  updateData: Partial<IContact>
): Promise<IContact> => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, updateData, {
    headers,
  });
  return data.data;
};

export const softDeleteContact = async (
  id: string,
  token: string
): Promise<any> => {
  const { data } = await axios.put(
    `${BASE_URL}/softdelete/${id}`,
    {},
    {
      headers: { authentication: `bearer ${token}` },
    }
  );
  return data.data;
};
export const deleteContact = async (id: string): Promise<any> => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};