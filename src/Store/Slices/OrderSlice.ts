import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { IOrder } from "../../Interfaces/Iorder";

const initialState = {
  orders: [],
  loading: false,
};

const token = localStorage.getItem("accessToken");



export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (order: IOrder) => {
    const res = await axios.post(
        "http://localhost:3000/order", order,
         { headers: { authentication: `bearer ${token}`}}
    );
    return res.data;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addOrder.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export default orderSlice.reducer;
