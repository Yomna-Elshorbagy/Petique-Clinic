import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { IOrder } from "../../Interfaces/Iorder";
import { baseURL } from "../../Apis/BaseUrl";

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
      const res = await axios.get(`${baseURL}/order/allorders`, {
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
      const res = await axios.get(`${baseURL}/order/${id}`, {
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
        `${baseURL}/order/soft/${id}`,
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
      const res = await axios.delete(`${baseURL}/order/hard/${id}`, {
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
        `${baseURL}/order/status/${id}`,
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
        `${baseURL}/order/${id}`,
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
      const res = await axios.post(`${baseURL}/order`, order, {
        headers: { authentication: `bearer ${token}` },
      });
      if (res.data.data.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
        return;
      }
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
    builder.addCase(deleteOrderById.fulfilled, (state, action) => {
      state.loading = false;
      // Remove the deleted order from the state
      const deletedOrderId = action.meta.arg;
      state.orders = state.orders.filter(
        (order: any) => order._id !== deletedOrderId
      );
    });
    builder.addCase(deleteOrderById.rejected, (state) => {
      state.loading = false;
    });

    // Delete order hard
    builder.addCase(deleteOrderhard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrderhard.fulfilled, (state, action) => {
      state.loading = false;
      // Remove the deleted order from the state
      const deletedOrderId = action.meta.arg;
      state.orders = state.orders.filter(
        (order: any) => order._id !== deletedOrderId
      );
    });
    builder.addCase(deleteOrderhard.rejected, (state) => {
      state.loading = false;
    });

    // Update order status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false;
      // Update the order in the state
      const { id, status } = action.meta.arg;
      const orderIndex = state.orders.findIndex(
        (order: any) => order._id === id
      );
      if (orderIndex !== -1) {
        (state.orders[orderIndex] as any).status = status;
      }
    });
    builder.addCase(updateOrderStatus.rejected, (state) => {
      state.loading = false;
    });

    // Update order details
    builder.addCase(updateOrderDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      // Update the order in the state
      const { id, fullName, phone, address, status, finalPrice, notes } =
        action.meta.arg;
      const orderIndex = state.orders.findIndex(
        (order: any) => order._id === id
      );
      if (orderIndex !== -1) {
        const order = state.orders[orderIndex] as any;
        order.fullName = fullName;
        order.phone = phone;
        order.address = address;
        order.status = status;
        order.finalPrice = finalPrice;
        if (notes !== undefined) order.note = notes;
      }
    });
    builder.addCase(updateOrderDetails.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default orderSlice.reducer;
