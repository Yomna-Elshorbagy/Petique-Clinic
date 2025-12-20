import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { LoginSchemaType } from "../Utils/Schema/loginSchema";
import type { SignUpSchemaType } from "../Utils/Schema/signupSchema";

const headers = {
  "Content-Type": "application/json",
  "x-client-user-agent": navigator.userAgent,
};

export const userLogin = async (data: LoginSchemaType) => {
  const res = await axios.post(`${baseURL}/auth/login`, data, { headers });
  return res.data;
};

export const userSignup = async (data: SignUpSchemaType) => {
  const res = await axios.post(`${baseURL}/auth/signup`, data);
  return res.data;
};

export const forgetPass = async (email: string) => {
  const res = await axios.put(`${baseURL}/auth/forgetPass`, { email });
  return res.data;
};

export const changePass = async (data: {
  otp: string;
  newPass: string;
  email: string;
}) => {
  const res = await axios.put(`${baseURL}/auth/changePass`, data, { headers });
  return res.data;
};

export const verifyOtpApi = async (data: {
  email: string;
  otpCode: string;
}) => {
  const res = await axios.post(`${baseURL}/auth/verifyOtp`, data, { headers });
  return res.data;
};

export const googleLogin = async (data: { idToken: string }) => {
  const res = await axios.post(`${baseURL}/auth/google-login`, data, { headers });
  return res.data;
};
