import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/dashboard/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/dashboard/logout",
        method: "POST",
      }),
    }),
    refresh: builder.query({
      query: () => "/auth/dashboard/refresh",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
    }),
  }),
});

export const { useLoginMutation, useRefreshQuery, useLogoutMutation } = authApi;
