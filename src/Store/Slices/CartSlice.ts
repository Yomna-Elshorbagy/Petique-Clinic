import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import { baseURL } from "../../Apis/BaseUrl";
import type { CartState } from "../../Types/CartTypes";

// =============> Initial State <=============
const initialState: CartState = {
  noOfCartItems: 0,
  noOfCartProducts: 0,
  products: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

// =============> Async Thunks <=============
export const getUserCart = createAsyncThunk<any, void, { state: RootState }>(
  "cart/getUserCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${baseURL}/cart`, {
        headers: {
          authentication: `bearer ${token}`,
        },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//==> adding product
export const addProductToCart = createAsyncThunk<
  any,
  string,
  { state: RootState }
>("cart/addProductToCart", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.post(
      `${baseURL}/cart`,
      { productId },
      { headers: { authentication: `bearer ${token}` } }
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ==> update quantity
export const updateCartQuantity = createAsyncThunk<
  any,
  { id: string; newCount: number },
  { state: RootState }
>(
  "cart/updateCartQuantity",
  async ({ id, newCount }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(
        `${baseURL}/cart/${id}`,
        { quantity: newCount },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ==> delete single cart item
export const deleteCartItem = createAsyncThunk<
  any,
  string,
  { state: RootState }
>("cart/deleteCartItem", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.put(
      `${baseURL}/cart/deleteitem/${id}`,
      {},
      { headers: { authentication: `bearer ${token}` } }
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ==> clearing cart
export const clearCartApi = createAsyncThunk<any, void, { state: RootState }>(
  "cart/clearCartApi",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.delete(
        `${baseURL}/cart`,
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ============> Slice <===============
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.noOfCartItems = 0;
      state.noOfCartProducts = 0;
      state.products = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    // =======> getUserCart <========
    builder.addCase(getUserCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserCart.fulfilled, (state, action) => {
      state.loading = false;
      state.noOfCartItems = action.payload.noOfCartItems;
      state.noOfCartProducts = action.payload.noOfProducts;
      state.products = action.payload.data.products;
      state.totalPrice = action.payload.data.totalPrice;
    });
    builder.addCase(getUserCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // =====> addProductToCart <=====
    builder.addCase(addProductToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addProductToCart.fulfilled, (state, action) => {
      const cartData = action.payload.cart;
      if (cartData) {
        state.noOfCartItems = action.payload.noOfCartItems;
        state.noOfCartProducts = action.payload.noOfProducts;
        state.products = cartData.products;
        state.totalPrice = cartData.totalPrice;
      }
    });

    // =====> updateCartQuantity <=====
    builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
      const cartData = action.payload.data;
      if (cartData) {
        state.noOfCartItems = action.payload.noOfCartItems;
        state.noOfCartProducts = action.payload.noOfProducts;
        state.products = cartData.products;
        state.totalPrice = cartData.totalPrice;
      }
    });

    // =====> deleteCartItem <=====
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      const cartData = action.payload.data;
      if (cartData) {
        state.noOfCartItems = action.payload.noOfCartItems;
        state.noOfCartProducts = action.payload.noOfProducts;
        state.products = cartData.products;
        state.totalPrice = cartData.totalPrice;
      }
    });
    // =======> clearCart <=======
    builder.addCase(clearCartApi.fulfilled, (state, action) => {
      const cartData = action.payload.data;
      if (cartData) {
        state.noOfCartItems = 0;
        state.noOfCartProducts = 0;
        state.products = [];
        state.totalPrice = 0;
      }
    });
    builder.addCase(clearCartApi.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
