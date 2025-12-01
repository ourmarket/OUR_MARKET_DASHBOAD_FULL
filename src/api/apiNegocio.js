import { apiSlice } from "./apiSlice";

export const negocioApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60, // duración de datos en cache
  refetchOnMountOrArgChange: false, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["negocios"],

  endpoints: (builder) => ({
    getNegocios: builder.query({
      query: () => "/negocios",
      extraOptions: { maxRetries: 5 },
      providesTags: ["negocios"],
    }),

    getNegocio: builder.query({
      query: (id) => `/negocios/${id}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 3 },
      providesTags: ["negocios"],
    }),

    postNegocio: builder.mutation({
      query: (items) => ({
        url: "/negocios",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["negocios"],
      extraOptions: { maxRetries: 0 },
    }),

    putNegocio: builder.mutation({
      query: ({ id, ...items }) => ({
        url: `/negocios/${id}`,
        method: "put",
        body: items,
      }),
      invalidatesTags: ["negocios"],
      extraOptions: { maxRetries: 0 },
    }),

    deleteNegocio: builder.mutation({
      query: (id) => ({
        url: `/negocios/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["negocios"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetNegociosQuery,
  useGetNegocioQuery,
  usePostNegocioMutation,
  usePutNegocioMutation,
  useDeleteNegocioMutation,
} = negocioApi;
