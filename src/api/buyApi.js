import { apiSlice } from "./apiSlice";

export const buyApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["buy"],

  endpoints: (builder) => ({
    getBuys: builder.query({
      query: () => "/buy",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["buy"],
    }),

    getBuy: builder.query({
      query: (id) => `/buy/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["buy"],
    }),

    postBuy: builder.mutation({
      query: (newBuys) => ({
        url: "/buy",
        method: "post",
        body: newBuys,
      }),
      invalidatesTags: ["buy"],
      extraOptions: { maxRetries: 0 },
    }),

    putBuy: builder.mutation({
      query: ({ id, ...editBuys }) => ({
        url: `/buy/${id}`,
        method: "put",
        body: editBuys,
      }),
      invalidatesTags: ["buy"],
      extraOptions: { maxRetries: 0 },
    }),

    deleteBuy: builder.mutation({
      query: (id) => ({
        url: `/buy/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["buy"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetBuysQuery,
  useGetBuyQuery,
  usePostBuyMutation,
  usePutBuyMutation,
  useDeleteBuyMutation,
} = buyApi;
