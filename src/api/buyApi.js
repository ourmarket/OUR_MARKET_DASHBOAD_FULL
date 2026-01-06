import { apiSlice } from "./apiSlice";

export const buyApi = apiSlice.injectEndpoints({
  tagTypes: ["Buy"],

  endpoints: (builder) => ({
    // LIST
    getBuys: builder.query({
      query: () => "/buy",
      providesTags: ["Buy"],
    }),
    getBuysPending: builder.query({
      query: () => "/buy/pending",
      providesTags: ["Buy"],
    }),
    getBuysSummary: builder.query({
      query: () => "/buy/summary",
      providesTags: ["Buy"],
    }),

    // DETAIL
    getBuyById: builder.query({
      query: (id) => `/buy/${id}`,
      providesTags: ["Buy"],
    }),
    // PAYMENTS
    getBuyPayments: builder.query({
      query: () => `/buy/payments`,
      providesTags: ["Buy"],
    }),
    getBuyPaymentById: builder.query({
      query: (id) => `/buy/payments/${id}`,
      providesTags: ["Buy"],
    }),

    // CREATE (desde GoodsReceipt normalmente)
    createBuy: builder.mutation({
      query: (payload) => ({
        url: "/buy",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Buy", "PurchaseOrder"],
    }),

    // REGISTER PAYMENT (acción de dominio)
    registerBuyPayment: builder.mutation({
      query: ({ id, payment }) => ({
        url: `/buy/${id}/payments`,
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["Buy"],
    }),
  }),
});

export const {
  useGetBuysQuery,
  useGetBuyByIdQuery,
  useCreateBuyMutation,
  useRegisterBuyPaymentMutation,
  useGetBuyPaymentsQuery,
  useGetBuyPaymentByIdQuery,
  useGetBuysPendingQuery,
  useGetBuysSummaryQuery,
} = buyApi;
