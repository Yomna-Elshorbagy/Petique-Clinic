import axios from "axios";
import { baseURL } from "./BaseUrl";

const API = axios.create({
  baseURL: `${baseURL}`,
});

export const sendContact = async (data: any) => {
  const response = await API.post("/contact", data);
  return response.data;
};
