import "react-datepicker/dist/react-datepicker.css";
import { Alert, Box, Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { dateToLocalDate } from "utils/dateFormat";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { formatPrice } from "utils/formaPrice";
import {
  usePostTotalOrderProductsByRangeMutation,
  usePostReportPaymentByRangeDayMutation,
  usePostReportClientBuyByRangeDayMutation,
  usePostReportSellByRangeDayMutation,
} from "api/reportApi";
import { LoadingButton } from "@mui/lab";
import colors from "assets/theme/base/colors";
import { useSelector } from "react-redux";
import TableReportProductsByRange from "components/OUTables/Reports/products-sell/TableReportProductsByRange";
import TableReportClientBuy from "components/OUTables/Reports/client-buy/TableReportClientBuy";
import TableReportSellZones from "components/OUTables/Reports/zones-sell/TableReportSellZones";

function ReportProductsByRange() {
  const { version } = useSelector((store) => store.auth);

  const [startDate, setStartDate] = useState(new Date().setHours(0, 0, 0, 0));
  const [endDate, setEndDate] = useState(new Date().setHours(23, 59, 59, 0));
  const [updateDate, setUpdateDate] = useState(null);

  const [reports, setReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [clientsBuy, setClientBuy] = useState([]);
  const [sellZones, setSellZones] = useState([]);

  const [getTotalsOrders, { isLoading: l1, isError: e1, isSuccess: s1 }] =
    usePostTotalOrderProductsByRangeMutation();
  const [getDataPayments, { isLoading: l2, isError: e2, isSuccess: s2 }] =
    usePostReportPaymentByRangeDayMutation();
  const [getDataClientBuy, { isLoading: l3, isError: e3, isSuccess: s3 }] =
    usePostReportClientBuyByRangeDayMutation();
  const [getSellData, { isLoading: l4, isError: e4, isSuccess: s4 }] =
    usePostReportSellByRangeDayMutation();

  const totalCost = reports.reduce((acc, curr) => curr.totalCost + acc, 0);
  const totalSell = reports.reduce((acc, curr) => curr.total + acc, 0);
  const totalProfits = reports.reduce(
    (acc, curr) => curr.totalProfits + acc,
    0
  );

  const totalCash = payments.reduce((acc, curr) => curr.cashTotal + acc, 0);
  const totalTransfer = payments.reduce(
    (acc, curr) => curr.transferTotal + acc,
    0
  );
  const totalDebt = payments.reduce((acc, curr) => curr.debtTotal + acc, 0);
  const totals = payments.reduce((acc, curr) => curr.total + acc, 0);

  useEffect(() => {
    setUpdateDate(dateToLocalDate(new Date()));
  }, []);

  const handleSend = async () => {
    const res = await getTotalsOrders({
      from: startDate,
      to: endDate,
    }).unwrap();
    const res2 = await getDataPayments({
      from: startDate,
      to: endDate,
    }).unwrap();
    const res3 = await getDataClientBuy({
      from: startDate,
      to: endDate,
    }).unwrap();
    const res4 = await getSellData({ from: startDate, to: endDate }).unwrap();
    setReports(res.data.report);
    setPayments(res2.data.report);
    setClientBuy(res3.data.report);
    setSellZones(res4.data.zones);
  };

  if (e1 || e2 || e3 || e4) {
    return <Alert severity="error">Ha ocurrido un error</Alert>;
  }

  return (
    <Box px={0} pb={3}>
      <Card
        sx={{
          padding: "20px",
        }}
      >
        <MDTypography variant="h6">Selecciona un rango de días</MDTypography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <DatePicker
            selected={startDate}
            dateFormat="dd/MM/yyyy"
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          <DatePicker
            selected={endDate}
            dateFormat="dd/MM/yyyy"
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
          <LoadingButton
            onClick={handleSend}
            variant="contained"
            loading={l1 || l2 || l3 || l4}
            sx={{
              mt: 1,
              mb: 2,
              mr: 2,
              backgroundColor: `${colors.info.main}`,
              color: "white !important",
              maxWidth: "180px",
            }}
          >
            Generar reporte
          </LoadingButton>
        </Box>
        {s1 && s2 && s3 && s4 && reports.length === 0 && (
          <Alert severity="info">
            No se registran ordenes en ese rango de días.
          </Alert>
        )}
      </Card>
      {reports.length > 0 && (
        <Box>
          <Box mt={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="attach_money_icon"
                    title="Total cantidad facturada(ordenes)"
                    count={formatPrice(totalSell)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Ultima actualización ${updateDate}hs`,
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="error"
                    icon="attach_money_icon"
                    title="Total costo"
                    count={formatPrice(totalCost)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Ultima actualización ${updateDate}hs`,
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="attach_money_icon"
                    title="Total ganancia"
                    count={formatPrice(totalProfits)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Ultima actualización ${updateDate}hs`,
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </Box>
          <Box mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="attach_money_icon"
                    color="dark"
                    title="Total pagos cargados en sistema"
                    count={formatPrice(totals)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Diferencia $${totals - totalSell}`,
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="attach_money_icon"
                    color="success"
                    title="Efectivo"
                    count={formatPrice(totalCash)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Ultima actualización ${updateDate}hs`,
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="currency_exchange_icon"
                    title="Transferencias"
                    count={formatPrice(totalTransfer)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Ultima actualización ${updateDate}hs`,
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="error"
                    icon="money_off_icon"
                    title="Pagos adeudados"
                    count={formatPrice(totalDebt)}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: `Ultima actualización ${updateDate}hs`,
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </Box>
          <Card sx={{ marginTop: "30px" }}>
            <MDTypography
              variant="h6"
              sx={{
                ml: 3,
                mt: 3,
              }}
            >
              Productos vendidos
            </MDTypography>
            <TableReportProductsByRange reports={reports} />
          </Card>
          <Card sx={{ marginTop: "30px" }}>
            <MDTypography
              variant="h6"
              sx={{
                ml: 3,
                mt: 3,
              }}
            >
              Compras de clientes
            </MDTypography>
            <TableReportClientBuy
              reports={clientsBuy}
              totalProfits={totalProfits}
            />
          </Card>
          {(version === "dr" || version === "full") && (
            <Card sx={{ marginTop: "30px" }}>
              <MDTypography
                variant="h6"
                sx={{
                  ml: 3,
                  mt: 3,
                }}
              >
                Ventas por zonas
              </MDTypography>
              <TableReportSellZones
                sellZones={sellZones}
                totalProfits={totalProfits}
              />
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ReportProductsByRange;
