import { apiSlice } from "./apiSlice";

export const manufacturingOrderApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 1,
  refetchOnMountOrArgChange: true,
  tagTypes: ["ManufacturingOrders", "Stock", "StockMovement"],

  endpoints: (builder) => ({
    getManufacturingOrders: builder.query({
      query: ({ page = 1, limit = 20, status = "" } = {}) =>
        `/manufacturing-orders?page=${page}&limit=${limit}&status=${status}`,
      providesTags: ["ManufacturingOrders"],
      extraOptions: { maxRetries: 3 },
    }),

    getManufacturingOrderById: builder.query({
      query: (id) => `/manufacturing-orders/${id}`,
      providesTags: ["ManufacturingOrders"],
      extraOptions: { maxRetries: 3 },
    }),

    getCostSnapshot: builder.query({
      query: (id) => `/manufacturing-orders/${id}/cost-snapshot`,
      providesTags: ["ManufacturingOrders"],
      extraOptions: { maxRetries: 3 },
    }),

    createManufacturingOrder: builder.mutation({
      query: (data) => ({
        url: "/manufacturing-orders",
        method: "post",
        body: data,
      }),
      invalidatesTags: ["ManufacturingOrders"],
    }),

    executeManufacturingOrder: builder.mutation({
      query: (id) => ({
        url: `/manufacturing-orders/${id}/execute`,
        method: "post",
      }),
      invalidatesTags: ["ManufacturingOrders", "Stock", "StockMovement"],
    }),

    closeManufacturingOrder: builder.mutation({
      query: (id) => ({
        url: `/manufacturing-orders/${id}/close`,
        method: "post",
      }),
      invalidatesTags: ["ManufacturingOrders", "Stock", "StockMovement"],
    }),
  }),
});

export const {
  useGetManufacturingOrdersQuery,
  useGetManufacturingOrderByIdQuery,
  useGetCostSnapshotQuery,
  useCreateManufacturingOrderMutation,
  useExecuteManufacturingOrderMutation,
  useCloseManufacturingOrderMutation,
} = manufacturingOrderApi;
