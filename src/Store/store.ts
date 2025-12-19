import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "./Slices/AuthSlice";
import userReducer from "./Slices/UserSlice";
import cartReducer, { getUserCart } from "./Slices/CartSlice";
import orderSlice from "./Slices/OrderSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    cart: cartReducer,
    Order: orderSlice,
  },
});

if (localStorage.getItem("accessToken")) {
  store.dispatch(getUserCart());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks - use these throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
