import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "api/apiSlice";
import { authApi } from "api/authApi";
import { orderApi } from "api/orderApi";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import buyReducer from "./buySlice";
import orderReducer from "./ordersSlice";
import positionsReducer from "./positionSlice";
import mapAutocompleteReducer from "./mapAutocomplete";
import mapReducer from "./mapSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    cart: cartReducer,
    buy: buyReducer,
    order: orderReducer,
    positions: positionsReducer,
    mapAutocomplete: mapAutocompleteReducer,
    map: mapReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Note: authApi and orderApi might have their own reducerPath if they don't use apiSlice
    [authApi.reducerPath]: authApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)
      .concat(authApi.middleware)
      .concat(orderApi.middleware),
});
