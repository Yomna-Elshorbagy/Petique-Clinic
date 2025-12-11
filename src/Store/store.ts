import { configureStore } from "@reduxjs/toolkit";
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
