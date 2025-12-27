import { useParams, useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

// API & Utils
import { useGetBuyPaymentByIdQuery } from "api/buyApi";
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";

const paymentMethodIcons = {
  TRANSFER: "account_balance",
  CASH: "payments",
  CHECK: "receipt",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "credit_card",
};

const paymentMethodLabels = {
  TRANSFER: "Transferencia Bancaria",
  CASH: "Efectivo",
  CHECK: "Cheque",
  CREDIT_CARD: "Tarjeta de Crédito",
  DEBIT_CARD: "Tarjeta de Débito",
};

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: payment, isLoading, error } = useGetBuyPaymentByIdQuery(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error || !payment) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <MDTypography variant="h4" gutterBottom>
            Pago no encontrado
          </MDTypography>
          <MDTypography variant="body2" color="text" gutterBottom>
            Hubo un error al cargar la información del pago.
          </MDTypography>
          <MDButton
            variant="contained"
            color="info"
            onClick={() => navigate("/compras")}
            sx={{ mt: 2 }}
          >
            Volver a Compras
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  const paymentIcon = paymentMethodIcons[payment.paymentMethod] || "payment";

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
              Detalle de Pago
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
                / Registro de Pago
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Payment Summary */}
              <Card>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Fecha
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mt={0.5}>
                        <Icon
                          fontSize="small"
                          color="disabled"
                          sx={{ mr: 0.5 }}
                        >
                          event
                        </Icon>
                        <MDTypography variant="button" fontWeight="medium">
                          {dateToLocalDate(payment.date)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Método de Pago
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" mt={0.5}>
                        <Icon
                          fontSize="small"
                          color="disabled"
                          sx={{ mr: 0.5 }}
                        >
                          {paymentIcon}
                        </Icon>
                        <MDTypography variant="button" fontWeight="medium">
                          {paymentMethodLabels[payment.paymentMethod] ||
                            payment.paymentMethod}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Monto
                      </MDTypography>
                      <MDTypography
                        variant="h5"
                        color="success"
                        fontWeight="bold"
                        mt={0.5}
                      >
                        {formatPrice(payment.amount)}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Associated Buy */}
              {payment.buy && (
                <Card>
                  <MDBox p={2} display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>receipt_long</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      Compra Aplicada
                    </MDTypography>
                  </MDBox>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell>Cód. Compra</TableCell>
                          <TableCell>Doc. Externo</TableCell>
                          <TableCell align="right">Estado</TableCell>
                          <TableCell align="right">Total Compra</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          hover
                          onClick={() =>
                            navigate(
                              `/compras/detalle1/${
                                payment.buy.id || payment.buy._id
                              }`
                            )
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>
                            <MDTypography
                              variant="button"
                              fontWeight="medium"
                              color="info"
                            >
                              {payment.buy.code}
                            </MDTypography>
                          </TableCell>
                          <TableCell>
                            <MDTypography variant="caption" color="text">
                              {payment.buy.documentNumber || "N/A"}
                            </MDTypography>
                          </TableCell>
                          <TableCell align="right">
                            <MDBadge
                              badgeContent={
                                payment.buy.status === "PAID"
                                  ? "Pagado"
                                  : "Parcial"
                              }
                              color={
                                payment.buy.status === "PAID"
                                  ? "success"
                                  : "warning"
                              }
                              variant="gradient"
                              size="sm"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography variant="button" fontWeight="bold">
                              {formatPrice(payment.buy.total)}
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                    {payment.supplier?.name || "N/A"}
                  </MDTypography>
                  <MDTypography variant="caption" color="text" display="block">
                    {payment.supplier?.businessName}
                  </MDTypography>
                </MDBox>
              </Card>

              {/* Payment Details */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>description</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Detalles del Registro
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Referencia
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {payment.reference || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Registrado por
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {payment.createdBy
                        ? `${payment.createdBy.name} ${
                            payment.createdBy.lastName || ""
                          }`
                        : "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between">
                    <MDTypography variant="caption" color="text">
                      Fecha de Registro
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {dateToLocalDate(payment.date)}
                    </MDTypography>
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

export default PaymentDetail;
