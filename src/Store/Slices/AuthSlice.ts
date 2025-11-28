import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("accessToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    insertUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    clearUserToken: (state) => {
      state.token = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { insertUserToken, clearUserToken } = authSlice.actions;
export default authSlice.reducer;
