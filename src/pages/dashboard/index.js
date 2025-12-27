/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useGetClientsQuantityQuery } from "api/clientsApi";
import Loading from "components/DRLoading";
import { Alert, Box } from "@mui/material";
import {
  useGetTotalOrdersProductsQuery,
  useGetCategoryReportQuery,
  useGetReportTotalExpensesByMonthQuery,
} from "api/reportApi";

import DashboardTotals from "./components/OrdersOverview/DashboardTotals";
import {
  useGetDashboardChart1Query,
  useGetDashboardChart2Query,
  useGetDashboardChartDailyQuery,
  useGetDashboardClientsQuery,
  useGetDashboardSalesTotalsQuery,
  useGetDashboardTotalBuysQuery,
} from "api/apiDashboard";

function Dashboard1() {
  const {
    data: salesTotal,
    isLoading: l1,
    isError: e1,
  } = useGetDashboardSalesTotalsQuery();

  const {
    data: clientsQuantity,
    isLoading: l2,
    isError: e2,
  } = useGetClientsQuantityQuery();

  const {
    data: salesTotalProducts,
    isLoading: l3,
    isError: e3,
  } = useGetTotalOrdersProductsQuery();

  const {
    data: dataCategory,
    isLoading: l4,
    isError: e4,
  } = useGetCategoryReportQuery("cajon de pollos");

  const {
    data: dataExpenses,
    isLoading: l5,
    isError: e5,
  } = useGetReportTotalExpensesByMonthQuery();

  const {
    data: dataBuys,
    isLoading: l6,
    isError: e6,
  } = useGetDashboardTotalBuysQuery();
  const {
    data: dataClientsTopSummary,
    isLoading: l7,
    isError: e7,
  } = useGetDashboardClientsQuery();
  const {
    data: chart1,
    isLoading: l8,
    isError: e8,
  } = useGetDashboardChart1Query();
  const {
    data: chart2,
    isLoading: l9,
    isError: e9,
  } = useGetDashboardChart2Query();
  const {
    data: chartDaily,
    isLoading: l10,
    isError: e10,
  } = useGetDashboardChartDailyQuery();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {(l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9 || l10) && (
        <Loading />
      )}
      {(e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9 || e10) && (
        <Alert severity="error">Ha ocurrido un error</Alert>
      )}
      {clientsQuantity &&
        salesTotalProducts &&
        dataCategory &&
        dataExpenses &&
        //dashboard
        dataBuys &&
        salesTotal &&
        dataClientsTopSummary &&
        chart1 &&
        chart2 &&
        chartDaily && (
          <Box sx={{ minHeight: "100vh" }}>
            <DashboardTotals
              clients={clientsQuantity}
              totalProducts={salesTotalProducts.data.report}
              dataCategory={dataCategory.data.report}
              dataExpenses={dataExpenses.data.report}
              //dashboard
              dataBuys={dataBuys.data.report}
              orders={salesTotal.data.report}
              clientsTopSummary={dataClientsTopSummary.data}
              chart1={chart1.data}
              chart2={chart2.data}
              chartDaily={chartDaily.data}
            />
          </Box>
        )}
    </DashboardLayout>
  );
}

export default Dashboard1;
