import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import cartReducer, { getUserCart } from "./Slices/CartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

if (localStorage.getItem("accessToken")) {
  store.dispatch(getUserCart());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
