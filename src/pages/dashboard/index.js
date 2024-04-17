/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useGetClientsQuantityQuery } from "api/clientsApi";
import Loading from "components/DRLoading";
import { Alert, Box } from "@mui/material";
import {
  useGetTotalOrdersQuery,
  usePostReportSellByRangeDayMutation,
  useGetTotalOrdersProductsQuery,
  useGetTotalOrdersProducts2103Query,
  useGetTotalOrdersByMonthQuery,
  useGetReportTotalClientDebtQuery,
  useGetReportTotalClientBuyQuery,
  useGetCategoryReportQuery,
  useGetReportTotalExpensesByMonthQuery,
  usePaymentByLastXdayReportQuery,
} from "api/reportApi";
import { useEffect, useState } from "react";
import DashboardTotals from "./components/OrdersOverview/DashboardTotals";

function Dashboard1() {
  const [report1, setReport1] = useState(null);

  //total general de ventas y pagos(efectivo, transferencia, deudas)
  const {
    data: dataOrders,
    isLoading: l1,
    isError: e1,
  } = useGetTotalOrdersQuery();

  // clientes activos, inactivo y total, mejora 500ms (50%) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  const {
    data: clientsQuantity,
    isLoading: l2,
    isError: e2,
  } = useGetClientsQuantityQuery();

  // pagos y deudas de los últimos x días( de 2.23s a 300ms 86%) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  const {
    data: paymentByLastXday,
    isLoading: l3,
    isError: e3,
  } = usePaymentByLastXdayReportQuery(14);

  // total de ganancia de los  últimos x días
  const [getTotalSellByRangeDay, { isLoading: l4, isError: e4 }] =
    usePostReportSellByRangeDayMutation();
  /* ----------- unir total productos, total ganancia de productos------------- */
  //trae todas las ventas de los productos, solo muestra 20, MEJORAR!!
  const {
    data: dataOrdersProducts,
    isLoading: l5,
    isError: e5,
  } = useGetTotalOrdersProductsQuery();

  //trae todas las ventas de los productos desde el 21/03
  const {
    data: dataOrdersProducts2103,
    isLoading: l6,
    isError: e6,
  } = useGetTotalOrdersProducts2103Query();
  /* ----------- unir total productos, total ganancia de productos------------- */

  // Total de ventas, costo y ganancia por mes. Se podría unir con los gastos mensuales
  const {
    data: dataOrdersByMonth,
    isLoading: l7,
    isError: e7,
  } = useGetTotalOrdersByMonthQuery();

  // Total de deudas de clientes, añadir limitador
  const {
    data: dataClientsDebs,
    isLoading: l8,
    isError: e8,
  } = useGetReportTotalClientDebtQuery();

  // Total de compras de clientes, añadir limitador
  const {
    data: dataClientsBuy,
    isLoading: l9,
    isError: e9,
  } = useGetReportTotalClientBuyQuery(12);

  // total de ventas de una categoria, hacer opcional la consulta
  const {
    data: dataCategory,
    isLoading: l10,
    isError: e10,
  } = useGetCategoryReportQuery("cajon de pollos");

  // total gastos por mes
  const {
    data: dataExpenses,
    isLoading: l11,
    isError: e11,
  } = useGetReportTotalExpensesByMonthQuery();

  useEffect(() => {
    const getData = async () => {
      const from = new Date(new Date().setDate(new Date().getDate() - 31));
      const to = new Date();

      const { data } = await getTotalSellByRangeDay({ from, to }).unwrap();

      setReport1(data.report);
    };
    getData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {(l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9 || l10 || l11) && (
        <Loading />
      )}
      {(e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9 || e10 || e11) && (
        <Alert severity="error">Ha ocurrido un error</Alert>
      )}
      {dataOrders &&
        clientsQuantity &&
        paymentByLastXday &&
        report1 &&
        dataOrdersProducts &&
        dataOrdersProducts2103 &&
        dataOrdersByMonth &&
        dataClientsBuy &&
        dataClientsDebs &&
        dataExpenses &&
        dataCategory && (
          <Box sx={{ minHeight: "100vh" }}>
            <DashboardTotals
              clients={clientsQuantity}
              orders={dataOrders.data.report}
              ordersByDays={paymentByLastXday.data.report}
              reports={report1}
              totalProducts={dataOrdersProducts.data.report}
              totalProducts2103={dataOrdersProducts2103.data.report}
              dataOrdersByMonth={dataOrdersByMonth.data.report}
              dataClientsDebs={dataClientsDebs.data.report}
              reportTotalClientBuy={dataClientsBuy.data}
              dataCategory={dataCategory.data.report}
              dataExpenses={dataExpenses.data.report}
            />
          </Box>
        )}
    </DashboardLayout>
  );
}

export default Dashboard1;
