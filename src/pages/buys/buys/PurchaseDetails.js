import { useParams, useNavigate, Link } from "react-router-dom";

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
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

// API & Utils
import { useGetBuyByIdQuery } from "api/buyApi";
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";

// Mock Data Helpers (Temporary until API endpoints are available)
import { adjustments, getReceiptsForPurchase } from "../mockData";

const getAdjustmentsForPurchase = (purchaseId) => {
  return adjustments.filter((a) => a.purchaseId === purchaseId);
};
// Helper to get total adjustment amount for a purchase
const getTotalAdjustments = (purchaseId) => {
  return adjustments
    .filter((a) => a.purchaseId === purchaseId)
    .reduce((sum, adj) => sum + adj.totalAmount, 0);
};

const PurchaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: buyResponse, isLoading, error } = useGetBuyByIdQuery(id);
  const buy = buyResponse;

  console.log(buy);

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

  if (error || !buy) {
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
            Compra no encontrada
          </MDTypography>
          <MDTypography variant="body2" color="text" gutterBottom>
            Hubo un error al cargar la información de la compra.
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

  const paidAmount = buy.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
  const balanceDue = buy.total - paidAmount;

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PARTIAL":
        return "warning";
      case "PENDING":
        return "error";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PAID":
        return "Pagado";
      case "PARTIAL":
        return "Parcial";
      case "PENDING":
        return "Pendiente";
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "TRANSFER":
        return "Transferencia";
      case "CASH":
        return "Efectivo";
      case "CHECK":
        return "Cheque";
      case "CREDIT_CARD":
        return "T. Crédito";
      case "DEBIT_CARD":
        return "T. Débito";
      default:
        return method;
    }
  };

  const getAdjustmentTypeLabel = (type) => {
    switch (type) {
      case "shortage":
        return "Faltante";
      case "damage":
        return "Daño";
      case "price":
        return "Dif. Precio";
      case "bonus":
        return "Bonificación";
      default:
        return type;
    }
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case "shortage":
        return "error";
      case "damage":
        return "warning";
      case "price":
        return "info";
      case "bonus":
        return "success";
      default:
        return "secondary";
    }
  };

  const getReceiptStatusLabel = (status) => {
    switch (status) {
      case "none":
        return "No recibida";
      case "partial":
        return "Parcial";
      case "complete":
        return "Completa";
      default:
        return status;
    }
  };

  const getReceiptStatusColor = (status) => {
    switch (status) {
      case "none":
        return "secondary";
      case "partial":
        return "warning";
      case "complete":
        return "success";
      default:
        return "secondary";
    }
  };

  const receipts = getReceiptsForPurchase(buy?._id || buy?.id || id);

  const adjustmentsList = getAdjustmentsForPurchase(buy?._id || buy?.id || id);
  const totalAdjustments = getTotalAdjustments(buy?._id || buy?.id || id);
  const adjustedBalance = balanceDue + totalAdjustments;

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
              {buy.code}
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
                / Detalle de Compra
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox display="flex" gap={1}>
            {balanceDue > 0 && (
              <>
                <Link to={`/compras/ajustes/nuevo?buy=${buy._id}`}>
                  <MDButton variant="outlined" color="error">
                    <Icon>settings_suggest</Icon>&nbsp;Registrar Ajuste
                  </MDButton>
                </Link>
                <Link to={`/compras/pagos/registrar-pago/${buy._id}`}>
                  <MDButton variant="gradient" color="success">
                    <Icon>account_balance_wallet</Icon>&nbsp;Registrar Pago
                  </MDButton>
                </Link>
              </>
            )}
          </MDBox>
        </MDBox>

        {/* Historical Record Notice */}
        <MDBox
          bgColor="grey-100"
          borderRadius="lg"
          p={2}
          mb={4}
          display="flex"
          alignItems="flex-start"
          sx={{
            border: ({ borders: { borderWidth, borderColor } }) =>
              `${borderWidth[1]} solid ${borderColor}`,
          }}
        >
          <Icon
            color="inherit"
            fontSize="medium"
            sx={{ color: "text.secondary", mr: 2, mt: 0.5 }}
          >
            lock
          </Icon>
          <MDBox>
            <MDTypography variant="subtitle2" fontWeight="bold">
              Registro Histórico
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Esta compra es un documento cerrado y no puede ser modificada. Se
              han congelado los costos y nombres de productos al momento de la
              compra.
            </MDTypography>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Summary Card */}
              <Card>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
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
                          {dateToLocalDate(buy.date)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Estado Pago
                      </MDTypography>
                      <MDBox mt={0.5}>
                        <MDBadge
                          badgeContent={getStatusLabel(buy.status)}
                          color={getStatusColor(buy.status)}
                          variant="gradient"
                          size="sm"
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Total
                      </MDTypography>
                      <MDTypography variant="h6" mt={0.5}>
                        {formatPrice(buy.total)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Saldo Pendiente
                      </MDTypography>
                      <MDTypography
                        variant="h6"
                        mt={0.5}
                        color={balanceDue > 0 ? "error" : "success"}
                      >
                        {formatPrice(balanceDue)}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Items Table */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ítems Comprados
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Costo Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {buy.items?.map((item, index) => (
                        <TableRow key={item._id || index}>
                          <TableCell>{item.nameSnapshot || "N/A"}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {formatPrice(item.unitCost)}
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography variant="button" fontWeight="bold">
                              {formatPrice(item.quantity * item.unitCost)}
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <MDBox p={2} borderTop="1px solid #f0f2f5">
                  <Grid container justifyContent="flex-end">
                    <Grid item xs={12} sm={6} md={4}>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="body2" color="text">
                          Total
                        </MDTypography>
                        <MDTypography variant="body2" fontWeight="medium">
                          {formatPrice(buy.total)}
                        </MDTypography>
                      </MDBox>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="body2" color="text">
                          Pagado
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          fontWeight="medium"
                          color="success"
                        >
                          {formatPrice(paidAmount)}
                        </MDTypography>
                      </MDBox>
                      {totalAdjustments !== 0 && (
                        <MDBox
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <MDTypography variant="body2" color="text">
                            Ajustes
                          </MDTypography>
                          <MDTypography
                            variant="body2"
                            fontWeight="medium"
                            color="error"
                          >
                            {formatPrice(totalAdjustments)}
                          </MDTypography>
                        </MDBox>
                      )}
                      <Divider />
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <MDTypography variant="body1" fontWeight="bold">
                          Saldo final
                        </MDTypography>
                        <MDTypography
                          variant="body1"
                          fontWeight="bold"
                          color={adjustedBalance > 0 ? "error" : "success"}
                        >
                          {formatPrice(Math.max(0, adjustedBalance))}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Related Payments */}
              {buy.payments?.length > 0 && (
                <Card>
                  <MDBox p={2} display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>account_balance_wallet</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      Pagos Asociados
                    </MDTypography>
                  </MDBox>
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell>Realizado por</TableCell>
                          <TableCell>Referencia</TableCell>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Método</TableCell>
                          <TableCell align="right">Monto</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {buy.payments.map((payment, index) => (
                          <TableRow key={payment._id || index}>
                            <TableCell>
                              {payment.createdBy.name +
                                " " +
                                payment.createdBy.lastName}
                            </TableCell>
                            <TableCell>
                              <MDTypography
                                variant="button"
                                fontWeight="medium"
                              >
                                {payment.reference || "-"}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <MDTypography variant="button" fontWeight="light">
                                {`${dateToLocalDate(payment.date)}hs`}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              {getPaymentMethodLabel(payment.paymentMethod)}
                            </TableCell>
                            <TableCell align="right">
                              <MDTypography
                                variant="button"
                                fontWeight="bold"
                                color="success"
                              >
                                {formatPrice(payment.amount)}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              )}

              {/* Adjustments Section */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>credit_card</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ajustes Aplicados
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox
                    bgColor="info"
                    variant="gradient"
                    borderRadius="lg"
                    p={2}
                    display="flex"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Icon sx={{ color: "#fff", mr: 1, mt: 0.5 }}>info</Icon>
                    <MDBox>
                      <MDTypography variant="caption" color="white">
                        Los ajustes representan créditos otorgados por el
                        proveedor y reducen el saldo a pagar.
                      </MDTypography>
                    </MDBox>
                  </MDBox>

                  {adjustmentsList.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ display: "table-header-group" }}>
                          <TableRow>
                            <TableCell>Nº Ajuste</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell align="right">Monto</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {adjustmentsList.map((adj) => (
                            <TableRow
                              key={adj.id}
                              sx={{ cursor: "pointer" }}
                              onClick={() =>
                                navigate(`/compras/ajustes/${adj.id}`)
                              }
                            >
                              <TableCell>
                                <MDTypography
                                  variant="button"
                                  fontWeight="medium"
                                >
                                  {adj.adjustmentNumber}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDBadge
                                  badgeContent={getAdjustmentTypeLabel(
                                    adj.type
                                  )}
                                  color={getAdjustmentTypeColor(adj.type)}
                                  variant="gradient"
                                  size="sm"
                                />
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="button" color="text">
                                  {dateToLocalDate(adj.date)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography
                                  variant="button"
                                  fontWeight="bold"
                                  color="error"
                                >
                                  {formatPrice(adj.totalAmount)}
                                </MDTypography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <MDBox textAlign="center" py={3}>
                      <Icon fontSize="large" color="disabled" sx={{ mb: 1 }}>
                        credit_card
                      </Icon>
                      <MDTypography
                        variant="button"
                        color="text"
                        display="block"
                      >
                        No hay ajustes registrados
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
              </Card>

              {/* Goods Receipt Section */}
              <Card>
                <MDBox
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDBox display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>inventory_2</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      Recepción de Mercadería
                    </MDTypography>
                  </MDBox>
                  <MDBadge
                    badgeContent={getReceiptStatusLabel(buy?.receiptStatus)}
                    color={getReceiptStatusColor(buy?.receiptStatus)}
                    variant="gradient"
                    size="sm"
                  />
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox
                    bgColor="grey-100"
                    borderRadius="lg"
                    p={2}
                    display="flex"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Icon sx={{ color: "text.secondary", mr: 1, mt: 0.5 }}>
                      info
                    </Icon>
                    <MDBox>
                      <MDTypography variant="caption" color="text">
                        La recepción documenta lo recibido físicamente y no
                        modifica el monto de la compra ni los pagos.
                      </MDTypography>
                    </MDBox>
                  </MDBox>

                  {buy?.receipts.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ display: "table-header-group" }}>
                          <TableRow>
                            <TableCell>Nº Recepción</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Registrado por</TableCell>
                            <TableCell>Observaciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {buy?.receipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell>
                                <MDTypography
                                  variant="button"
                                  fontWeight="medium"
                                >
                                  {receipt.code}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="button" color="text">
                                  {dateToLocalDate(receipt.date)}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="button" color="text">
                                  {receipt.receivedBy.name +
                                    " " +
                                    receipt.receivedBy.lastName}
                                </MDTypography>
                              </TableCell>
                              <TableCell>
                                <MDTypography variant="caption" color="text">
                                  {receipt.generalObservations || "-"}
                                </MDTypography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <MDBox textAlign="center" py={3}>
                      <Icon fontSize="large" color="disabled" sx={{ mb: 1 }}>
                        inventory_2
                      </Icon>
                      <MDTypography
                        variant="button"
                        color="text"
                        display="block"
                      >
                        No hay recepciones registradas
                      </MDTypography>
                    </MDBox>
                  )}

                  {buy?.receiptStatus !== "complete" && (
                    <MDBox mt={2}>
                      <Link
                        to={`/compras/recepciones/nueva/${
                          buy._id || buy.id || id
                        }`}
                      >
                        <MDButton variant="outlined" color="info" fullWidth>
                          <Icon>inventory_2</Icon>&nbsp;Registrar Recepción
                        </MDButton>
                      </Link>
                    </MDBox>
                  )}
                </MDBox>
              </Card>
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
                    {buy.supplier?.businessName ||
                      buy.supplier?.name ||
                      "Sin Nombre"}
                  </MDTypography>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    >
                      email
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {buy.supplier?.email || "N/A"}
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
                      {buy.supplier?.phone || "N/A"}
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
                      {buy.supplier?.address || "N/A"}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Document Info */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>description</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Información del Documento
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Nº Documento Externo
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {buy.documentNumber || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Fecha de Registro
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {dateToLocalDate(buy.createdAt)}
                    </MDTypography>
                  </MDBox>
                  {buy.purchaseOrder && (
                    <MDBox display="flex" justifyContent="space-between">
                      <MDTypography variant="caption" color="text">
                        Orden Origen
                      </MDTypography>
                      <Link
                        to={`/compras/ordenes/${buy.purchaseOrder._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <MDTypography
                          variant="caption"
                          fontWeight="medium"
                          color="info"
                        >
                          Ver orden
                        </MDTypography>
                      </Link>
                    </MDBox>
                  )}
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default PurchaseDetail;
