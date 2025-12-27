/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    superUser: null,
    version: null,
    superUserData: null,
    loaded: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.superUser = action.payload.superUser;
      state.version = action.payload.version;
      state.superUserData = action.payload.superUserData;
      state.loaded = true;
    },
    logOut: (state) => {
      state.user = null;
      state.superUser = null;
      state.version = null;
      state.superUserData = null;
      state.loaded = true;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
