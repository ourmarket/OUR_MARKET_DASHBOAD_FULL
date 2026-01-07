import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 1, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["products"],

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (stock) => `/products?stock=${stock}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["products"],
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["products"],
    }),

    postProduct: builder.mutation({
      query: (items) => ({
        url: "/products",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["products", "reports"],
      extraOptions: { maxRetries: 0 },
    }),

    putProduct: builder.mutation({
      query: ({ id, ...items }) => ({
        url: `/products/${id}`,
        method: "put",
        body: items,
      }),
      invalidatesTags: ["products", "Stock"],
      extraOptions: { maxRetries: 0 },
    }),

    deleteProduct: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/products/${id}${
          reason ? `?reason=${encodeURIComponent(reason)}` : ""
        }`,
        method: "delete",
      }),
      invalidatesTags: ["products"],
      extraOptions: { maxRetries: 0 },
    }),

    getProductsTotalByID: builder.query({
      query: (id) => `/products/products-total-by-id/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["products"],
    }),
    getTotalIndividualProductLast30Days: builder.query({
      query: ({ id, client = "" }) =>
        `/products/totalIndividualProductLast30days/${id}?client=${client}`,

      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["products"],
    }),

    getProductHistory: builder.query({
      query: (id) => `/products/${id}/history`,
      extraOptions: { maxRetries: 3 },
      providesTags: ["products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  usePostProductMutation,
  usePutProductMutation,
  useDeleteProductMutation,
  useGetProductsTotalByIDQuery,
  useGetTotalIndividualProductLast30DaysQuery,
  useGetProductHistoryQuery,
} = productApi;
