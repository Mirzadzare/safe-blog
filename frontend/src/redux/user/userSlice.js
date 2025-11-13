import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // --- Sign In ---
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Delete Account ---
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null; // clear user data after deletion
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Update Account ---
    updateUserSuccess: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },

    // --- Optional: Sign out (if you have it elsewhere) ---
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  updateUserSuccess,
  signOut,
} = userSlice.actions;

export default userSlice.reducer;
