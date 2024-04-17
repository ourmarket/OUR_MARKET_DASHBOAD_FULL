import { apiSlice } from "./apiSlice";

export const stockApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["stock"],

  endpoints: (builder) => ({
    getStocks: builder.query({
      query: () => "/stock",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["stock"],
    }),
    getAvailableStocks: builder.query({
      query: () => "/stock/available",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["stock"],
    }),

    getStock: builder.query({
      query: (id) => `/stock/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["stock"],
    }),

    postStock: builder.mutation({
      query: (newStock) => ({
        url: "/stock",
        method: "post",
        body: newStock,
      }),
      invalidatesTags: ["stock"],
      extraOptions: { maxRetries: 0 },
    }),

    putStock: builder.mutation({
      query: ({ id, ...editStock }) => ({
        url: `/stock/${id}`,
        method: "put",
        body: editStock,
      }),
      invalidatesTags: ["stock"],
      extraOptions: { maxRetries: 0 },
    }),

    deleteStock: builder.mutation({
      query: (id) => ({
        url: `/stock/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["stock"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetAvailableStocksQuery,
  useGetStockQuery,
  usePostStockMutation,
  usePutStockMutation,
  useDeleteStockMutation,
} = stockApi;
