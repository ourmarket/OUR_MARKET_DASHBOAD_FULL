/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { useEffect, useState } from "react";
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";
import CharBar2 from "../Chart2/CharBar2";
import TotalProducts from "../TotalProducts/TotalProducts";
import TotalProductsProfit from "../TotalProducts/TotalProductsProfit";
import CharBar3 from "../Chart3/CharBar3";
import TotalClientsDebt from "../ClientDebt/TotalClientDebt";
import CharBar1 from "../Chart1/CharBar1";
import { useSelector } from "react-redux";
import InactiveTotalClientsProfits from "../ClientProfit/InactiveTotalClientProfit";
import ActiveTotalClientsBuy from "../ClientBuy/ActiveTotalClientBuy";
import CharBar4 from "../Chart4/CharBar4";

function DashboardTotals({
  orders,
  clients,
  ordersByDays,
  reports,
  totalProducts,
  totalProducts2103,
  dataOrdersByMonth,
  dataClientsDebs,
  reportTotalClientBuy,
  dataCategory,
  dataExpenses,
  dataBuys,
}) {
  const { version } = useSelector((store) => store.auth);
  const [updateDate, setUpdateDate] = useState(null);

  console.log(dataBuys);

  const totalBuy = dataBuys.reduce((acc, curr) => acc + curr.totals, 0);
  const totalBuyUnpaid =
    dataBuys.find((buy) => buy.paid === false)?.totals || 0;

  useEffect(() => {
    setUpdateDate(dateToLocalDate(new Date()));
  }, []);

  return (
    <MDBox py={3} mt={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Total Ventas"
              count={formatPrice(orders[0]?.totalSales || 0)}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="file_download_done_icon"
              title="Pagos clientes"
              count={formatPrice(
                orders[0]?.totalCash && orders[0]?.totalTransfer
                  ? orders[0].totalCash + orders[0].totalTransfer
                  : 0
              )}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="primary"
              icon="cancel_presentation_icon"
              title="Deudas clientes"
              count={formatPrice(orders[0]?.totalDebt || 0)}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="person_add"
                title="Clientes Activos"
                count={clients?.active}
                percentage={{
                  color: "success",
                  amount: "",
                  label: `Total clientes ${clients?.total}`,
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="add_business_icon"
                title="Compras a proveedores"
                count={formatPrice(totalBuy || 0)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: `Actualizado ${updateDate}hs`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="priority_high_icon"
                title="Deuda con proveedores"
                count={formatPrice(totalBuyUnpaid || 0)}
                percentage={{
                  color: "success",
                  amount: "",
                  label: `Actualizado ${updateDate}hs`,
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {version === "dr" && (
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="inventory"
                title="Stock Cajones de Pollo"
                count={dataCategory?.stock?.actualStock || 0}
                percentage={{
                  color: "secondary",
                  amount: "",
                  label: `Actualizado ${updateDate}hs`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="arrow_upward"
                title="Cajones de pollo vendidos hoy"
                count={dataCategory?.totalSell?.totalQuantitySell || 0}
                color="success"
                percentage={{
                  color: "success",
                  amount: "",
                  label: `En Reparto ${
                    dataCategory?.totalSellLocal?.totalQuantityLocalSell || 0
                  }, en Local ${
                    dataCategory?.totalSellLocal?.totalQuantityLocalSell
                      ? dataCategory.totalSell.totalQuantitySell -
                        dataCategory.totalSellLocal.totalQuantityLocalSell
                      : dataCategory?.totalSell?.totalQuantitySell || 0
                  }`,
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="arrow_downward"
                title="Cajones de pollo comprados hoy"
                count={dataCategory?.totalBuy?.buyToday || 0}
                percentage={{
                  color: "success",
                  amount: "",
                  label: `Actualizado ${updateDate}hs`,
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      )}
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <CharBar1 ordersByDays={ordersByDays} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <CharBar2 reports={reports} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <CharBar3 reports={dataOrdersByMonth} expenses={dataExpenses} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <CharBar4 reports={dataOrdersByMonth} expenses={dataExpenses} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <TotalProducts totalProducts={totalProducts} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TotalProductsProfit totalProducts={totalProducts2103} />
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <TotalClientsDebt clients={dataClientsDebs} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ActiveTotalClientsBuy active={reportTotalClientBuy.active} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <InactiveTotalClientsProfits
              inactive={reportTotalClientBuy.inactive}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default DashboardTotals;
