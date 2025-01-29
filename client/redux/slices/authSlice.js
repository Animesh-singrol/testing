import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  name: null,
  id: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.id = action.payload.id;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
