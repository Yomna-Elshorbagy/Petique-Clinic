import axios from "axios";
import { baseURL } from "./BaseUrl";
import type { IUpdateUser } from "../Interfaces/IUser";

const token = localStorage.getItem("accessToken");

const headers = {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
};

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${baseURL}/user/allUsers`, { headers });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const updateUser = async (data: IUpdateUser, id: string) => {
    try {
        const res = await axios.put(`${baseURL}/user/byadmin/${id}`, data, { headers });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const hardDeleteUser = async (id: string) => {
    try {
        const res = await axios.delete(`${baseURL}/user/delete/${id}`, { headers });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const softDeleteUser = async (id: string) => {
    try {
        const res = await axios.put(`${baseURL}/user/softDelete/${id}`, {}, { headers });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

