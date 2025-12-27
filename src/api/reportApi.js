import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["reports"],

  endpoints: (builder) => ({
    getTotalOrdersByMonth: builder.query({
      query: (client = "") => `/reports/ordersByMonth?client=${client}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getTotalOrdersProducts: builder.query({
      query: () => "/reports/totalOrderProducts",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    getReportTotalClientDebt: builder.query({
      query: () => "/reports/reportTotalClientDebt",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getReportTotalClientBuy: builder.query({
      query: (limit) => `/reports/reportTotalClientBuy?limit=${limit}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getReportTotalClientBuyIndividual: builder.query({
      query: (id) => `/reports/reportTotalClientBuy/${id}`,

      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getReportTotalClientBuyIndividualByDay: builder.query({
      query: (id) => `/reports/reportTotalClientBuyByDay/${id}`,

      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    postTotalOrderProductsByRange: builder.mutation({
      query: (items) => ({
        url: "/reports/totalOrderProductsByRangeTest",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["reports"],
      extraOptions: { maxRetries: 0 },
    }),
    postReportPaymentByRangeDay: builder.mutation({
      query: (items) => ({
        url: "/reports/reportPaymentByRangeDay",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["reports"],
      extraOptions: { maxRetries: 0 },
    }),
    postReportSellByRangeDay: builder.mutation({
      query: (items) => ({
        url: "/reports/reportTotalSellByRangeDay",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["reports"],
      extraOptions: { maxRetries: 0 },
    }),
    postReportClientBuyByRangeDay: builder.mutation({
      query: (items) => ({
        url: "/reports/reportTotalClientBuyByRangeDays",
        method: "post",
        body: items,
      }),
      invalidatesTags: ["reports"],
      extraOptions: { maxRetries: 0 },
    }),

    // category
    getCategoryReport: builder.query({
      query: (id) =>
        `/reports/category/${id}?stock=1&totalSell=1&totalBuy=1&totalSellLocal=1`,

      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getCategoryReportByDay: builder.query({
      query: (id) => `/reports/category/orderByDay/${id}`,

      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    // delivery

    postDeliveryOrders: builder.mutation({
      query: ({ id, date }) => ({
        url: `/reports/deliveryOrders/${id}`,
        method: "post",
        body: date,
      }),
      invalidatesTags: ["reports"],
      extraOptions: { maxRetries: 0 },
    }),

    // expenses

    getReportTotalExpensesByMonth: builder.query({
      query: () => "/reports/reportTotalExpensesByMonth",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    getTotalCategoryExpensesReport: builder.query({
      query: () => "/reports/reportTotalExpensesByCategory",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useGetTotalOrdersByMonthQuery,
  useGetReportTotalClientDebtQuery,
  useGetReportTotalClientBuyQuery,
  useGetReportTotalClientBuyIndividualQuery,
  useGetReportTotalClientBuyIndividualByDayQuery,
  useGetTotalOrdersProductsQuery,

  useGetCategoryReportQuery,
  useGetCategoryReportByDayQuery,
  useGetReportTotalExpensesByMonthQuery,
  useGetTotalCategoryExpensesReportQuery,
  usePostTotalOrderProductsByRangeMutation,
  usePostReportPaymentByRangeDayMutation,
  usePostReportSellByRangeDayMutation,
  usePostReportClientBuyByRangeDayMutation,
  usePostDeliveryOrdersMutation,
} = userApi;
