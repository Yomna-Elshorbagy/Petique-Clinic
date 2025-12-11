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
        console.log("API response----------------------:", res.data);
        return res.data;
    } catch (error: any) {
        console.log("API error--------------------------:", error.response?.data || error.message);
        throw error;
    }
};

export const updateUser = async (data: IUpdateUser, id: string) => {
    try {
        const res = await axios.put(`${baseURL}/user/byadmin/${id}`, data, { headers });
        console.log("API response update user-------------------------:", res.data);
        return res.data;
    } catch (error: any) {
        console.log("Update error---------------------:", error.response?.data || error.message);
        throw error;
    }
};

export const hardDeleteUser = async (id: string) => {
    try {
        const res = await axios.delete(`${baseURL}/user/delete/${id}`, { headers });
        console.log("API response hard delete-----------------------:", res.data);
        return res.data;
    } catch (error: any) {
        console.log("hard delete user error-------------------------:", error.response?.data || error.message);
        throw error;
    }
};

export const softDeleteUser = async (id: string) => {
    try {
        const res = await axios.put(`${baseURL}/user/softDelete/${id}`, {}, { headers });
        console.log("API responsesoft soft delete-----------------------:", res.data);
        return res.data;
    } catch (error: any) {
        console.log("soft delete user error-------------------------:", error.response?.data || error.message);
        throw error;
    }
};

