import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  keepUnusedDataFor: 120, // 🔥 2 minutos global
  refetchOnMountOrArgChange: false,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    // 1️⃣ Pagos y deudas (14 días)
    getDashboardChart1: builder.query({
      query: () => "/dashboard/chart1",
      keepUnusedDataFor: 120,
      providesTags: ["Dashboard"],
    }),

    // 2️⃣ Ganancias (30 días)
    getDashboardChart2: builder.query({
      query: () => "/dashboard/chart2",
      keepUnusedDataFor: 120,
      providesTags: ["Dashboard"],
    }),

    // 3️⃣ Gráfico mensual
    getDashboardChartDaily: builder.query({
      query: () => "/dashboard/chartDaily",
      keepUnusedDataFor: 300, // ⏱ cambia poco
      providesTags: ["Dashboard"],
    }),

    // 4️⃣ Top clientes
    getDashboardClients: builder.query({
      query: () => "/dashboard/clients",
      keepUnusedDataFor: 300, // ⏱ cambia poco
      providesTags: ["Dashboard"],
    }),

    // Ventas totales
    getDashboardSalesTotals: builder.query({
      query: () => "/dashboard/salesTotal",
      keepUnusedDataFor: 300, // ⏱ cambia poco
      providesTags: ["Dashboard"],
    }),
    // Compras totales
    getDashboardTotalBuys: builder.query({
      query: () => "/dashboard/totalBuys",
      keepUnusedDataFor: 300, // ⏱ cambia poco
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardChart1Query,
  useGetDashboardChart2Query,
  useGetDashboardClientsQuery,
  useGetDashboardChartDailyQuery,
  useGetDashboardSalesTotalsQuery,
  useGetDashboardTotalBuysQuery,
} = dashboardApi;
