/* eslint-disable react/prop-types */
import { LoadingButton } from "@mui/lab";
import { Card, Divider, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { usePutCashierSessionMutation } from "api/apiCashierSession";
import colors from "assets/theme/base/colors";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { dateToLocalDate } from "utils/dateFormat";
import { formatPrice } from "utils/formaPrice";

const CardSession = ({ orders, session }) => {
  const [updateDate, setUpdateDate] = useState(null);

  const [editSession, { isLoading: l1, isError: e1, isSuccess }] =
    usePutCashierSessionMutation();

  useEffect(() => {
    setUpdateDate(dateToLocalDate(new Date()));
  }, []);

  const payments = useMemo(
    () => orders.map((order) => order.payment),
    [orders]
  );

  const { cash, transfer, debt } = useMemo(
    () =>
      payments.reduce(
        (acc, curr) => ({
          cash: acc.cash + curr.cash,
          transfer: acc.transfer + curr.transfer,
          debt: acc.debt + curr.debt,
        }),
        { cash: 0, transfer: 0, debt: 0 }
      ),
    [payments]
  );

  const unPaidOrders = useMemo(
    () => orders.filter((order) => !order.paid).length,
    [orders]
  );

  const paidOrders = useMemo(
    () => orders.filter((order) => order.paid).length,
    [orders]
  );

  const closeSession = async () => {
    Swal.fire({
      title: "Deseas cerrar la sesión de caja?",
      text: "⚠ Atención: No usar en sesiones activas actualmente!! Solo para sesiones antiguas que no pudieron ser cerradas por algún error. ",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar caja",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const finishData = {
          finalCash: cash,
          payment: {
            cash,
            transfer,
            debt,
          },
          finishDate: new Date(),
        };
        await editSession({
          id: session._id,
          ...finishData,
        });
      }
    });
  };

  useEffect(() => {
    if (e1)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, sesión de caja no cerrada",
        showConfirmButton: false,
        timer: 1500,
      });
  }, [e1]);
  useEffect(() => {
    if (isSuccess)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sesión de caja con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
  }, [isSuccess]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ padding: "20px" }}>
            <MDTypography variant="h5">Cajero</MDTypography>
            <MDTypography
              component="div"
              variant="button"
              color="text"
              fontWeight="light"
            >
              Datos del cajero
            </MDTypography>
            <Divider />
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <MDTypography variant="h6">Nombre:</MDTypography>
              <MDBox>
                <MDTypography variant="body2">{`${session.user.name} ${session.user.lastName}`}</MDTypography>
              </MDBox>
            </MDBox>
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <MDTypography variant="h6">Email:</MDTypography>
              <MDBox>
                <MDTypography variant="body2">
                  {session.user.email}
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <MDTypography variant="h6">Teléfono:</MDTypography>
              <MDBox>
                <MDTypography variant="body2">
                  {session.user.phone}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ padding: "20px" }}>
            <MDTypography variant="h5">Sesión de caja</MDTypography>
            <MDTypography
              component="div"
              variant="button"
              color="text"
              fontWeight="light"
            >
              Datos de la sesión
            </MDTypography>
            <Divider />
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <MDTypography variant="h6">Apertura de caja:</MDTypography>
              <MDBox>
                <MDTypography variant="body2">
                  {`${dateToLocalDate(session.initDate)}hs`}
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <MDTypography variant="h6">Cierre de caja:</MDTypography>
              <MDBox>
                <MDTypography variant="body2">
                  {session?.finishDate
                    ? `${dateToLocalDate(session.finishDate)}hs`
                    : "No cerrada"}
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <MDTypography variant="h6">Efectivo inicial:</MDTypography>
              <MDBox>
                <MDTypography variant="h6">
                  {formatPrice(session.initialCash)}
                </MDTypography>
              </MDBox>
            </MDBox>
            {!session.finishDate && (
              <LoadingButton
                onClick={closeSession}
                variant="contained"
                size="small"
                loading={l1}
                sx={{
                  mt: 1,
                  mb: 1,
                  backgroundColor: `${colors.info.main}`,
                  color: "white !important",
                }}
              >
                Cerrar caja
              </LoadingButton>
            )}
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: "30px" }}>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Ordenes Totales"
              count={orders.length}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="file_download_done_icon"
              title="Ordenes Pagas"
              count={paidOrders}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="error"
              icon="cancel_presentation_icon"
              title="Ordenes Impagas"
              count={unPaidOrders}
              percentage={{
                color: "error",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Total"
              count={formatPrice(cash + transfer + debt)}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="attach_money_icon"
              title="P. Efectivo"
              count={formatPrice(cash)}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="currency_exchange_icon"
              title="P. Transferencias"
              count={formatPrice(transfer)}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="error"
              icon="money_off_icon"
              title="Deudas"
              count={formatPrice(debt)}
              percentage={{
                color: "success",
                amount: "",
                label: `Actualizado ${updateDate}hs`,
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardSession;
