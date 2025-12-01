import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    lat: null,
    lng: null,
    save: false
  },
  reducers: {
    setNegocioPosicion: (state, actions) => {
      state.lat = actions.payload.lat;
      state.lng = actions.payload.lng;
    },
    saveNegocioPosicion: (state, actions) => {
      state.save = true;
    },
    resetNegocioPosicion: (state, actions) => {
      state.lat = null;
      state.lng = null;
      state.save = false;
    },
  },
});

export const { setNegocioPosicion, resetNegocioPosicion, saveNegocioPosicion } = mapSlice.actions;
export default mapSlice.reducer;
