import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { IOrder } from "../../Interfaces/Iorder";

const initialState = {
  orders: [],
  loading: false,
};

//get all orders

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:3000/order", {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

//get order by id

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`http://localhost:3000/order/${id}`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);
//delete order by id "soft delete"
export const deleteOrderById = createAsyncThunk(
  "order/deleteOrderById",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `http://localhost:3000/order/soft/${id}`,
        {},
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err: any) {
      console.log("deleted");

      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

//delete order by id "hard delete"
export const deleteOrderhard = createAsyncThunk(
  "order/deleteOrderhard",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.delete(`http://localhost:3000/order/hard/${id}`, {
        headers: {
          authentication: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

//update statues

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.put(
        `http://localhost:3000/order/status/${id}`,
        { status },
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

//update order details
export const updateOrderDetails = createAsyncThunk(
  "order/updateOrderDetails",
  async (
    {
      id,
      fullName,
      phone,
      address,
      status,
      finalPrice,
      notes,
    }: {
      id: string;
      fullName: string;
      phone: string;
      address: string;
      status: string;
      finalPrice: number;
      notes?: string;
    },
    thunkAPI
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `http://localhost:3000/order/${id}`,
        { fullName, phone, address, status, finalPrice, notes },
        {
          headers: {
            authentication: `bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);
///////////////////////////////////////////////////////////////////

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (order: IOrder, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post("http://localhost:3000/order", order, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get all orders
    builder.addCase(getAllOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.data || action.payload;
    });
    builder.addCase(getAllOrders.rejected, (state) => {
      state.loading = false;
    });

    // Add order
    builder.addCase(addOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addOrder.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(addOrder.rejected, (state) => {
      state.loading = false;
    });

    // Delete order soft
    builder.addCase(deleteOrderById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrderById.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteOrderById.rejected, (state) => {
      state.loading = false;
    });

    // Delete order hard
    builder.addCase(deleteOrderhard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrderhard.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteOrderhard.rejected, (state) => {
      state.loading = false;
    });

    // Update order status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateOrderStatus.rejected, (state) => {
      state.loading = false;
    });

    // Update order details
    builder.addCase(updateOrderDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderDetails.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateOrderDetails.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default orderSlice.reducer;
