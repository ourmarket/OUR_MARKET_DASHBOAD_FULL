import { apiSlice } from "./apiSlice";

export const purchaseAdjustmentApi = apiSlice.injectEndpoints({
  tagTypes: ["purchase-adjustment"],

  endpoints: (builder) => ({
    // LIST
    getPurchaseAdjustments: builder.query({
      query: () => "/purchase-adjustment",
      providesTags: ["purchase-adjustment"],
    }),

    // DETAIL
    getPurchaseAdjustmentById: builder.query({
      query: (id) => `/purchase-adjustment/${id}`,
      providesTags: ["purchase-adjustment"],
    }),
    getPurchaseAdjustmentByBuyId: builder.query({
      query: (id) => `/purchase-adjustment/by-buy/${id}`,
      providesTags: ["purchase-adjustment"],
    }),

    // CREATE
    createPurchaseAdjustment: builder.mutation({
      query: (payload) => ({
        url: "/purchase-adjustment",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["purchase-adjustment"],
    }),
  }),
});

export const {
  useGetPurchaseAdjustmentsQuery,
  useGetPurchaseAdjustmentByIdQuery,
  useCreatePurchaseAdjustmentMutation,
  useGetPurchaseAdjustmentByBuyIdQuery,
} = purchaseAdjustmentApi;
