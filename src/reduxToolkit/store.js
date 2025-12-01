import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "api/authApi";
import { categoryApi } from "api/categoryApi";
import { deliveryZoneApi } from "api/deliveryZoneApi";
import { ofertApi } from "api/ofertApi";
import { orderApi } from "api/orderApi";
import { productApi } from "api/productApi";
import { userApi } from "api/userApi";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import buyReducer from "./buySlice";
import orderReducer from "./ordersSlice";
import positionsReducer from "./positionSlice";
import mapAutocompleteReducer from "./mapAutocomplete";
import mapReducer from "./mapSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    buy: buyReducer,
    order: orderReducer,
    positions: positionsReducer,
    mapAutocomplete: mapAutocompleteReducer,
    map: mapReducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [ofertApi.reducerPath]: ofertApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [deliveryZoneApi.reducerPath]: deliveryZoneApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(userApi.middleware)
      .concat(productApi.middleware)
      .concat(categoryApi.middleware)
      .concat(ofertApi.middleware)
      .concat(authApi.middleware)
      .concat(deliveryZoneApi.middleware),
});
