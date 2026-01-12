import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Helpers
import { formatPrice } from "utils/formaPrice";

import { ORDER_STATUS } from "data/orderStatus";

import {
  useGetPurchaseOrderByIdQuery,
  useChangePurchaseOrderStatusMutation,
  useCancelPurchaseOrderMutation,
} from "api/purchaseOrderApi";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import { dateToLocalDate, formatDateOnly } from "utils/dateFormat";

const OrderBuyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: orderData,
    isLoading,
    isError,
  } = useGetPurchaseOrderByIdQuery(id);

  const [changeStatus] = useChangePurchaseOrderStatusMutation();
  const [cancelOrder] = useCancelPurchaseOrderMutation();

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={3}>
          <Loading />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (isError || !orderData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={3}>
          <MDTypography>Error al cargar la orden</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  const order = orderData.data;

  const status = ORDER_STATUS[order.status];

  /* ===================== ACTIONS ===================== */

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Enviar orden para aprobación",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#009fc7",
      cancelButtonColor: "#7b809a",
    });

    if (!result.isConfirmed) return;

    try {
      await changeStatus({
        id: order._id,
        status: "SUBMITTED",
      }).unwrap();

      Swal.fire("Enviada", "La orden fue enviada", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.data?.message || "No se pudo enviar la orden",
        "error"
      );
    }
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "¿Aprobar esta orden?",
      text: `Se aprobará la orden ${order.code}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#7b809a",
    });

    if (!result.isConfirmed) return;

    try {
      await changeStatus({
        id: order._id,
        status: "APPROVED",
      }).unwrap();

      Swal.fire("Aprobada", "La orden fue aprobada", "success");
      navigate(`/compras`);
    } catch (error) {
      Swal.fire(
        "Error",
        error?.data?.message || "No se pudo aprobar la orden",
        "error"
      );
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Cancelar orden",
      text: "La orden será cancelada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancelar orden",
      cancelButtonText: "Volver",
      confirmButtonColor: "#d41f1a",
      cancelButtonColor: "#7b809a",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelOrder(order._id).unwrap();

      Swal.fire("Cancelada", "La orden fue cancelada", "info");
    } catch (error) {
      Swal.fire(
        "Error",
        error?.data?.message || "No se pudo cancelar la orden",
        "error"
      );
    }
  };

  const handleConvert = async () => {
    try {
      await changeStatus({
        id: order._id,
        status: "EXECUTED",
      }).unwrap();

      navigate(`/compras/nueva?fromOrder=${order._id}`);
    } catch (error) {
      Swal.fire(
        "Error",
        error?.data?.message || "No se pudo convertir la orden",
        "error"
      );
    }
  };

  /* ===================== UI ===================== */

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              {order.code}
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDButton
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/compras")}
                sx={{ pl: 0, textTransform: "none" }}
              >
                <Icon>arrow_back</Icon>&nbsp;Volver
              </MDButton>
              <MDTypography variant="button" color="text" ml={1}>
                / Detalle de Orden de Compra
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox display="flex" gap={1}>
            {status?.actions.submit && (
              <MDButton color="info" onClick={handleSubmit}>
                <Icon>send</Icon>&nbsp;Enviar
              </MDButton>
            )}

            {status?.actions.approve && (
              <MDButton color="success" onClick={handleApprove}>
                <Icon>check_circle</Icon>&nbsp;Aprobar
              </MDButton>
            )}

            {status?.actions.cancel && (
              <MDButton color="error" variant="outlined" onClick={handleReject}>
                <Icon>cancel</Icon>&nbsp;Cancelar
              </MDButton>
            )}

            {status?.actions.convert && (
              <MDButton color="info" onClick={handleConvert}>
                <Icon>arrow_forward</Icon>&nbsp;Convertir en Compra
              </MDButton>
            )}
          </MDBox>
        </MDBox>

        {/* ⬇️ TODO el resto del JSX queda EXACTAMENTE igual ⬇️ */}
        <Grid container spacing={3}>
          {/* Main Content */}
          {status?.actions.convert && (
            <Alert severity="info">
              Esta orden de compra ya fue aprobada, continua para realizar la
              compra, lo que implica que el pedido se realizara y no puede ser
              editado posteriormente.
            </Alert>
          )}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Status Card */}
              <Card>
                <MDBox p={3}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={6}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Estado Actual
                      </MDTypography>
                      <MDBox mt={0.5}>
                        <MDBadge
                          badgeContent={status.label}
                          color={status.color}
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Fecha Esperada
                      </MDTypography>
                      <MDBox
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        mt={0.5}
                      >
                        <Icon
                          fontSize="small"
                          color="disabled"
                          sx={{ mr: 0.5 }}
                        >
                          event
                        </Icon>
                        <MDTypography variant="button" fontWeight="medium">
                          {formatDateOnly(order.expectedDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Items Table */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ítems de la Orden
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Precio Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.nameSnapshot}</TableCell>
                          <TableCell align="right">
                            {item.quantityOrdered}
                          </TableCell>
                          <TableCell align="right">
                            {formatPrice(item.estimatedUnitCost)}
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography variant="button" fontWeight="bold">
                              {formatPrice(
                                item.quantityOrdered * item.estimatedUnitCost
                              )}
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <MDBox p={2} borderTop="1px solid #f0f2f5" textAlign="right">
                  <MDTypography variant="body2" color="text">
                    Total Estimado
                  </MDTypography>
                  <MDTypography variant="h4" fontWeight="bold" color="dark">
                    {formatPrice(
                      order.items.reduce(
                        (acc, item) =>
                          acc + item.quantityOrdered * item.estimatedUnitCost,
                        0
                      )
                    )}
                  </MDTypography>
                </MDBox>
              </Card>

              {/* Notes */}
              {order.notes && (
                <Card>
                  <MDBox p={2}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Notas
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2} pt={0}>
                    <MDTypography variant="body2" color="text">
                      {order.notes}
                    </MDTypography>
                  </MDBox>
                </Card>
              )}
            </MDBox>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Supplier Info */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Proveedor
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    display="block"
                    gutterBottom
                  >
                    {order.supplier?.businessName || "-"}
                  </MDTypography>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    >
                      email
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {order.supplier?.email || "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    >
                      phone
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {order.supplier?.phone || "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center">
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    >
                      location_on
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {order.supplier?.address || "-"}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Status History */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>history</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Historial de Estados
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                    {order.statusHistory.map((entry, index) => {
                      const statusConfig = ORDER_STATUS[entry.status];

                      return (
                        <MDBox
                          component="li"
                          key={index}
                          display="flex"
                          mb={2}
                          position="relative"
                        >
                          <MDBox mr={2} mt={0.5}>
                            <MDBadge
                              badgeContent={statusConfig?.label || entry.status}
                              color={statusConfig?.color || "secondary"}
                              variant="gradient"
                              size="sm"
                            />
                          </MDBox>

                          <MDBox>
                            <MDTypography variant="caption" color="text">
                              {`${dateToLocalDate(entry.changedAt)} • ${
                                entry.changedBy?.name || ""
                              } ${entry.changedBy?.lastName || ""}`}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      );
                    })}
                  </MDBox>
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default OrderBuyDetails;
