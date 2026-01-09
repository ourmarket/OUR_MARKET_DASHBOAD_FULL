/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getClerkToken } from "utils/clerkToken";
import { getTenant } from "utils/getTenant";

const API = import.meta.env.VITE_APP_API_URL || "http://localhost:3040/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API,
  prepareHeaders: async (headers) => {
    // 🔐 Clerk token
    const token = await getClerkToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("X-App-Id", import.meta.env.VITE_APP_ID);
    headers.set("x-tenant", import.meta.env.VITE_TENANT_ID);

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Stock",
    "StockMovement",
    "StockAdjustment",
    "products",
    "Purchase",
    "BOM",
    "ManufacturingOrders",
  ],
  endpoints: () => ({}),
});
