import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 60, // duración de datos en cache
  refetchOnMountOrArgChange: true, // revalida al montar el componente
  refetchOnFocus: true, // revalida al cambiar de foco
  refetchOnReconnect: true, // revalida al reconectar
  tagTypes: ["reports"],

  endpoints: (builder) => ({
    //1. total general de ventas y pagos(efectivo, transferencia, deudas)
    getTotalOrders: builder.query({
      query: () => "/reports/orders",
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    getTotalOrderProductsByDay: builder.query({
      query: () => "/reports/totalOrderProductsByDay",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

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
    getTotalOrdersProducts2103: builder.query({
      query: () => "/reports/totalOrderProducts21_03",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getTotalStock: builder.query({
      query: () => "/reports/reportTotalStock",
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
    getTotalIndividualProduct: builder.query({
      query: ({ id, client = "" }) =>
        `/reports/totalIndividualProduct/${id}?client=${client}`,

      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
    getTotalIndividualProductLast30Days: builder.query({
      query: ({ id, client = "" }) =>
        `/reports/totalIndividualProductLast30days/${id}?client=${client}`,

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

    getByMonthAndCategoryExpensesReport: builder.query({
      query: () => "/reports/reportTotalExpensesByMonthAndCategory",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    // payments
    paymentByLastXdayReport: builder.query({
      query: (days) => `/reports/paymentByLastXdayReport?days=${days}`,
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),

    // buys
    getTotalBuysReport: builder.query({
      query: () => "/reports/totalBuys",
      // keepUnusedDataFor: 3,
      extraOptions: { maxRetries: 5 },
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useGetTotalOrderProductsByDayQuery,
  useGetTotalOrdersQuery,
  useGetTotalOrdersByMonthQuery,
  useGetTotalStockQuery,
  useGetReportTotalClientDebtQuery,
  useGetReportTotalClientBuyQuery,
  useGetReportTotalClientBuyIndividualQuery,
  useGetReportTotalClientBuyIndividualByDayQuery,
  useGetTotalOrdersProductsQuery,
  useGetTotalOrdersProducts2103Query,
  useGetTotalIndividualProductQuery,
  useGetTotalIndividualProductLast30DaysQuery,
  useGetCategoryReportQuery,
  useGetCategoryReportByDayQuery,
  useGetReportTotalExpensesByMonthQuery,
  useGetTotalCategoryExpensesReportQuery,
  useGetByMonthAndCategoryExpensesReportQuery,
  usePaymentByLastXdayReportQuery,
  useGetTotalBuysReportQuery,

  usePostTotalOrderProductsByRangeMutation,
  usePostReportPaymentByRangeDayMutation,
  usePostReportSellByRangeDayMutation,
  usePostReportClientBuyByRangeDayMutation,

  usePostDeliveryOrdersMutation,
} = userApi;
