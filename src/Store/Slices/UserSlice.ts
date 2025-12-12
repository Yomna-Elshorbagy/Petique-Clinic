import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "../../Interfaces/IUser";
import { getAllUsersThunk, updateUserThunk } from "../User/UserThunks";

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "users" , 
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUsersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
        .addCase(getAllUsersThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload; 
        })
        .addCase(getAllUsersThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) || "Failed to fetch users";
        })
        // update user 
        .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state , action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload; 
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to update user";
      });
    }
});

export default userSlice.reducer;
