import { apiSlice } from "./apiSlice";

export const stockApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ["Stock", "StockMovement", "StockAdjustment"],

  endpoints: (builder) => ({
    // GET /api/stock
    getStockList: builder.query({
      query: (params) => ({
        url: "/stock",
        params,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result) ? result : result?.stocks || [];
        return [
          ...list.map(({ id, _id }) => ({ type: "Stock", id: id || _id })),
          { type: "Stock", id: "LIST" },
        ];
      },
    }),

    // GET /api/stock/summary
    getStockSummary: builder.query({
      query: () => "/stock/summary",
      providesTags: ["Stock"],
    }),

    // GET /api/stock/:productId
    getStockByProduct: builder.query({
      query: (productId) => `/stock/${productId}`,
      providesTags: (result, error, id) => [{ type: "Stock", id }],
    }),

    // POST /api/stock-adjustments
    createAdjustment: builder.mutation({
      query: (adjustment) => ({
        url: "/stock-adjustments",
        method: "POST",
        body: adjustment,
      }),
      invalidatesTags: ["Stock", "StockMovement", "StockAdjustment"],
    }),

    // GET /api/stock-movements
    getStockMovements: builder.query({
      query: (params) => ({
        url: "/stock-movements",
        params,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result) ? result : result?.movements || [];
        return [
          ...list.map(({ id, _id }) => ({
            type: "StockMovement",
            id: id || _id,
          })),
          { type: "StockMovement", id: "LIST" },
        ];
      },
    }),

    // --- MANTENER EXPORTS ANTERIORES PARA COMPATIBILIDAD ---
    getStocks: builder.query({
      query: () => "/stock",
      providesTags: ["Stock"],
    }),
    getAvailableStocks: builder.query({
      query: () => "/stock/available",
      providesTags: ["Stock"],
    }),
    getStock: builder.query({
      query: (id) => `/stock/${id}`,
      providesTags: ["Stock"],
    }),
    postStock: builder.mutation({
      query: (newStock) => ({
        url: "/stock",
        method: "POST",
        body: newStock,
      }),
      invalidatesTags: ["Stock"],
    }),
  }),
});

export const {
  // Nuevos hooks
  useGetStockListQuery,
  useGetStockSummaryQuery,
  useGetStockByProductQuery,
  useCreateAdjustmentMutation,
  useGetStockMovementsQuery,

  // Hooks antiguos (Legacy)
  useGetStocksQuery,
  useGetAvailableStocksQuery,
  useGetStockQuery,
  usePostStockMutation,
} = stockApi;
