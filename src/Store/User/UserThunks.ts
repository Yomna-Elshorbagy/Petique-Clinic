import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, updateUser } from "../../Apis/UsersApis";
import type { IUpdateUser, IUser } from "../../Interfaces/IUser";

export const getAllUsersThunk = createAsyncThunk(
    "users/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllUsers();
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateUserThunk = createAsyncThunk<IUser, { id: string; data: IUpdateUser }, { rejectValue: string }>(
    "users/updateUser",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await updateUser(data, id);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);