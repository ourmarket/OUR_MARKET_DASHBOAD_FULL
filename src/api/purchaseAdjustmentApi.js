import { apiSlice } from "./apiSlice";

export const purchaseAdjustmentApi = apiSlice.injectEndpoints({
  tagTypes: ["PurchaseAdjustment"],

  endpoints: (builder) => ({
    // LIST
    getPurchaseAdjustments: builder.query({
      query: () => "/purchase-adjustments",
      providesTags: ["PurchaseAdjustment"],
    }),

    // DETAIL
    getPurchaseAdjustmentById: builder.query({
      query: (id) => `/purchase-adjustments/${id}`,
      providesTags: ["PurchaseAdjustment"],
    }),
    getPurchaseAdjustmentByBuyId: builder.query({
      query: (id) => `/purchase-adjustments/by-buy/${id}`,
      providesTags: ["PurchaseAdjustment"],
    }),

    // CREATE
    createPurchaseAdjustment: builder.mutation({
      query: (payload) => ({
        url: "/purchase-adjustments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PurchaseAdjustment", "Buy"],
    }),
  }),
});

export const {
  useGetPurchaseAdjustmentsQuery,
  useGetPurchaseAdjustmentByIdQuery,
  useCreatePurchaseAdjustmentMutation,
  useGetPurchaseAdjustmentByBuyIdQuery,
} = purchaseAdjustmentApi;
