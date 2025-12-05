import axios from "axios";
import { baseURL } from "./BaseUrl";

const USER_BASE_URL = `${baseURL}/user`;

export interface IUserDoctor {
  _id: string;
  userName: string;
  email: string;
}

export const getAllDoctors = async (): Promise<IUserDoctor[]> => {
  const { data } = await axios.get(`${USER_BASE_URL}/doctor`);
  return data.data;
};
