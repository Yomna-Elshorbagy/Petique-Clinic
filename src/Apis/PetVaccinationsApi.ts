import axios from "axios";
import { baseURL } from "./BaseUrl";

// ===> add vaccination to a pet
export const addVaccinationToPetApi = async (petId: string, payload: any) => {
  const { data } = await axios.post(
    `${baseURL}/pet/${petId}/add-vaccine`,
    payload,
  );
  return data;
};

// ===> get all vaccination records for all pets
export const getAllVaccinationRecordsApi = async () => {
  const { data } = await axios.get(`${baseURL}/pet/pet-vaccine`, {
  });
  return data;
};

// ===> get vaccination records for specific pet
export const getPetVaccinationsApi = async (petId: string) => {
  const { data } = await axios.get(
    `${baseURL}/pet/${petId}/specific-vaccines`,
  );
  return data;
};
