import { apiSlice } from "./apiSlice";

export const bomApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 1,
  refetchOnMountOrArgChange: true,
  tagTypes: ["BOM"],

  endpoints: (builder) => ({
    getBoms: builder.query({
      query: ({ page = 1, limit = 20, search = "", isActive = "" } = {}) =>
        `/bom?page=${page}&limit=${limit}&search=${search}&isActive=${isActive}`,
      providesTags: ["BOM"],
      extraOptions: { maxRetries: 3 },
    }),

    getBomById: builder.query({
      query: (id) => `/bom/${id}`,
      providesTags: ["BOM"],
      extraOptions: { maxRetries: 3 },
    }),

    getActiveBoms: builder.query({
      query: () => `/bom/active`,
      providesTags: ["BOM"],
      extraOptions: { maxRetries: 3 },
    }),

    createBom: builder.mutation({
      query: (data) => ({
        url: "/bom",
        method: "post",
        body: data,
      }),
      invalidatesTags: ["BOM"],
    }),

    updateBom: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/bom/${id}`,
        method: "put",
        body: data,
      }),
      invalidatesTags: ["BOM"],
    }),

    toggleBomActive: builder.mutation({
      query: (id) => ({
        url: `/bom/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["BOM"],
    }),
    deleteBom: builder.mutation({
      query: (id) => ({
        url: `/bom/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BOM"],
    }),
  }),
});

export const {
  useGetBomsQuery,
  useGetBomByIdQuery,
  useGetActiveBomsQuery,
  useCreateBomMutation,
  useUpdateBomMutation,
  useToggleBomActiveMutation,
  useDeleteBomMutation,
} = bomApi;
