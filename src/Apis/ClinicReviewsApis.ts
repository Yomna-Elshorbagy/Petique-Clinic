import axios from "axios";

import { baseURL } from "./BaseUrl";
import type { IClinicReview, IClinicReviewWithUser } from "../Interfaces/IReviews";

const BASE_URL = `${baseURL}/clinicReview`;

const token = localStorage.getItem("accessToken");

const headers = {
  authentication: `bearer ${token}`,
  "Content-Type": "application/json",
};

//==> add new review
export const addClinicReview = async (
  payload: FormData | any
): Promise<IClinicReview> => {
  const { data } = await axios.post(`${BASE_URL}/`, payload, {
    headers,
  });
  return data;
};

//==> get user review
export const getUserClinicReviews = async (): Promise<IClinicReview[]> => {
  const { data } = await axios.get(`${BASE_URL}/user`, { headers });
  return data.data;
};

// ==> get Reviews by Target (doctor/service/reservation/clinic)
export const getClinicReviewsForTarget = async (
  targetType: "doctor" | "service" | "reservation" | "clinic",
  targetId: string
): Promise<IClinicReviewWithUser[]> => {
  const { data } = await axios.get(
    `${BASE_URL}/target/${targetType}/${targetId}`,
    { headers }
  );
  return data.data;
};

//==> delete review 
export const deleteClinicReview = async (id: string) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return data;
};

//==> make soft delete 
export const softDeleteClinicReview = async (reviewId: string) => {
  const { data } = await axios.put(
    `${BASE_URL}/soft/${reviewId}`,
    {},
    { headers }
  );
  return data;
};

//==> get reviews by id 
export const getClinicReviewById = async (
  id: string
): Promise<IClinicReviewWithUser> => {
  const { data } = await axios.get(`${BASE_URL}/${id}`, { headers });  
  return data.data;
};

//==> get all reviews 
export const getAllClinicReviews = async (): Promise<IClinicReviewWithUser[]> => {
  const { data } = await axios.get(`${BASE_URL}`, { headers });  
  return data.data;
};

//==> get contact with user review 
export const contactClinicReviewUser = async (
  reviewId: string,
  payload: { subject?: string; message?: string }
) => {
  const { data } = await axios.post(
    `${BASE_URL}/contact/${reviewId}`,
    payload,
    { headers }
  );
  return data;
};

//==> generate whats app link
export const contactClinicReviewUserWhatsApp = async (reviewId: string) => {
  const { data } = await axios.get(
    `${BASE_URL}/whatsapp/${reviewId}`,
    { headers }
  );
  return data.chatDetails.whatsappUrl;
};
