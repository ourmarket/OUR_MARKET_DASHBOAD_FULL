import { apiSlice } from "./apiSlice";

export const purchaseOrderApi = apiSlice.injectEndpoints({
  tagTypes: ["PurchaseOrder"],

  endpoints: (builder) => ({
    // LIST
    getPurchaseOrders: builder.query({
      query: (params) => ({
        url: "/purchase-orders",
        params,
      }),
      providesTags: ["PurchaseOrder"],
    }),

    // DETAIL
    getPurchaseOrderById: builder.query({
      query: (id) => `/purchase-orders/${id}`,
      providesTags: ["PurchaseOrder"],
    }),

    // CREATE (DRAFT)
    createPurchaseOrder: builder.mutation({
      query: (payload) => ({
        url: "/purchase-orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),

    // UPDATE (solo DRAFT)
    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/purchase-orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),

    // CHANGE STATUS (acción explícita)
    changePurchaseOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/purchase-orders/${id}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),

    // CLOSE
    closePurchaseOrder: builder.mutation({
      query: (id) => ({
        url: `/purchase-orders/${id}/close`,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),

    // CANCEL
    cancelPurchaseOrder: builder.mutation({
      query: (id) => ({
        url: `/purchase-orders/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["PurchaseOrder"],
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useChangePurchaseOrderStatusMutation,
  useClosePurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
} = purchaseOrderApi;
