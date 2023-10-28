/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, superUser: null, version: null },
  reducers: {
    setCredentials: (state, action) => {
      const { id, accessToken, superUser, version } = action.payload;
      state.user = id;
      state.token = accessToken;
      state.superUser = superUser;
      state.version = version;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.superUser = null;
      state.version = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
