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

const ACTION_CONFIG = {
  CREATED: { label: "Compra Creada", color: "dark", icon: "add_shopping_cart" },
  GOODS_RECEIVED: {
    label: "Recepción Completa",
    color: "success",
    icon: "inventory_2",
  },
  PARTIAL_RECEIPT: {
    label: "Recepción Parcial",
    color: "warning",
    icon: "inventory_2",
  },
  ADJUSTMENT_AUTO: {
    label: "Ajuste Automático",
    color: "primary",
    icon: "settings_suggest",
  },
  PAYMENT_ADDED: {
    label: "Pago Registrado",
    color: "success",
    icon: "account_balance_wallet",
  },
  PAYMENT_REMOVED: {
    label: "Pago Eliminado",
    color: "error",
    icon: "money_off",
  },
  STATUS_CHANGED: { label: "Estado Actualizado", color: "info", icon: "sync" },
  CANCELLED: { label: "Compra Anulada", color: "error", icon: "block" },
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

  // Calculate total received quantity per item across all receipts
  const getReceivedQuantity = (productId) => {
    return (
      buy?.receipts?.reduce((total, receipt) => {
        const item = receipt.items?.find(
          (i) => (i.product?._id || i.product) === (productId?._id || productId)
        );
        return total + (item?.quantityReceived || 0);
      }, 0) || 0
    );
  };

  const receipts = buy?.receipts || [];
  const hasReceipts = receipts.length > 0;

  // Check if there are differences between ordered and received quantities
  const hasDifferences = buy.items?.some((item) => {
    const received = getReceivedQuantity(item.product);
    return received !== item.quantity;
  });

  const adjustmentsList = buy?.adjustments || [];
  const totalAdjustments = adjustmentsList.reduce(
    (sum, adj) => sum + adj.totalAmount,
    0
  );
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
            {buy?.receiptStatus !== "complete" && (
              <Link to={`/compras/recepciones/nueva/${buy._id}`}>
                <MDButton variant="outlined" color="info">
                  <Icon>inventory_2</Icon>&nbsp;Registrar Recepción
                </MDButton>
              </Link>
            )}
            {balanceDue > 0 && (
              <Link to={`/compras/pagos/registrar-pago/${buy._id}`}>
                <MDButton variant="gradient" color="success">
                  <Icon>account_balance_wallet</Icon>&nbsp;Registrar Pago
                </MDButton>
              </Link>
            )}
          </MDBox>
        </MDBox>

        {/* Frozen Document Notice */}
        <MDBox
          bgColor="grey-100"
          borderRadius="lg"
          p={2}
          mb={4}
          display="flex"
          alignItems="flex-start"
          sx={{
            borderLeft: "4px solid #7b809a",
          }}
        >
          <Icon
            fontSize="medium"
            sx={{ color: "text.secondary", mr: 2, mt: 0.5 }}
          >
            lock
          </Icon>
          <MDBox>
            <MDTypography variant="subtitle2" fontWeight="bold">
              Documento Cerrado e Inmutable
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Esta compra es un documento cerrado. Los costos y productos fueron
              congelados al momento de la compra para garantizar la integridad
              contable.
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
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Fecha de Compra
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
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDBox
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
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
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDBox
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
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
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDBox
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                      >
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
                          color={adjustedBalance > 0 ? "error" : "success"}
                        >
                          {formatPrice(Math.max(0, adjustedBalance))}
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
                    Ítems Comprados
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Comprado</TableCell>
                        {hasReceipts && (
                          <TableCell align="right">Recibido</TableCell>
                        )}
                        <TableCell align="right">Costo Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {buy.items?.map((item, index) => (
                        <TableRow key={item._id || index}>
                          <TableCell>{item.nameSnapshot || "N/A"}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          {hasReceipts && (
                            <TableCell align="right">
                              <MDBox
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-end"
                              >
                                <MDTypography
                                  variant="button"
                                  fontWeight="bold"
                                  color={
                                    getReceivedQuantity(item.product) ===
                                    item.quantity
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {getReceivedQuantity(item.product)}
                                </MDTypography>
                                <MDTypography
                                  variant="caption"
                                  color="text"
                                  sx={{ fontSize: "0.7rem" }}
                                >
                                  de {item.quantity}
                                </MDTypography>
                              </MDBox>
                            </TableCell>
                          )}
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
                <MDBox p={2} borderTop="1px solid #f0f2f5" bgColor="grey-100">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <MDBox display="flex" alignItems="center" height="100%">
                        <Icon color="info" sx={{ mr: 1 }}>
                          info
                        </Icon>
                        <MDTypography
                          variant="caption"
                          color="text"
                          sx={{ fontStyle: "italic" }}
                        >
                          * Los ajustes reducen el saldo a pagar pero no
                          modifican la compra original.
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="button" color="text">
                          Total Compra
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium">
                          {formatPrice(buy.total)}
                        </MDTypography>
                      </MDBox>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="button" color="text">
                          Pagado
                        </MDTypography>
                        <MDTypography
                          variant="button"
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
                          <MDTypography variant="button" color="text">
                            Ajustes Automáticos
                          </MDTypography>
                          <MDTypography
                            variant="button"
                            fontWeight="medium"
                            color="error"
                          >
                            {formatPrice(totalAdjustments)}
                          </MDTypography>
                        </MDBox>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <MDBox display="flex" justifyContent="space-between">
                        <MDTypography variant="body2" fontWeight="bold">
                          Saldo Real a Pagar
                        </MDTypography>
                        <MDTypography
                          variant="body2"
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
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                      >
                        Información Operativa
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        color="text"
                        display="block"
                      >
                        La recepción registra lo recibido físicamente y no
                        afecta los montos originales de la compra.
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

              {/* Adjustments Section */}
              {adjustmentsList.length > 0 && (
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
                        <MDTypography
                          variant="caption"
                          color="white"
                          fontWeight="medium"
                        >
                          Consecuencia de Recepción
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          color="white"
                          display="block"
                        >
                          Los ajustes se generan automáticamente por diferencias
                          entre lo comprado y lo recibido físicamente.
                        </MDTypography>
                      </MDBox>
                    </MDBox>

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
                              key={adj._id || adj.id}
                              sx={{ cursor: "pointer" }}
                              onClick={() =>
                                navigate(
                                  `/compras/ajustes/${adj._id || adj.id}`
                                )
                              }
                            >
                              <TableCell>
                                <MDTypography
                                  variant="button"
                                  fontWeight="medium"
                                >
                                  {adj.adjustmentNumber || adj.code}
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

              {/* Status History */}
              {buy.history && buy.history.length > 0 && (
                <Card>
                  <MDBox p={2} display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>history</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      Bitácora de Actividad
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2} pt={0}>
                    <MDBox
                      component="ul"
                      sx={{ listStyle: "none", m: 0, p: 0 }}
                    >
                      {[...buy.history].reverse().map((entry, index) => {
                        const config = ACTION_CONFIG[entry.action] || {
                          label: entry.action,
                          color: "secondary",
                        };

                        return (
                          <MDBox
                            component="li"
                            key={index}
                            display="flex"
                            position="relative"
                            mb={2}
                            sx={{
                              "&:not(:last-child):before": {
                                content: '""',
                                position: "absolute",
                                left: "15px",
                                top: "25px",
                                height: "calc(100% - 10px)",
                                width: "1px",
                                backgroundColor: "#f0f2f5",
                              },
                            }}
                          >
                            <MDBox
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="32px"
                              height="32px"
                              borderRadius="50%"
                              bgColor={config.color}
                              variant="gradient"
                              color="white"
                              mr={2}
                              zIndex={1}
                              boxShadow="0rem 0.25rem 0.25rem 0rem rgba(0, 0, 0, 0.05)"
                            >
                              <Icon sx={{ fontSize: "16px !important" }}>
                                {config.icon}
                              </Icon>
                            </MDBox>
                            <MDBox
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                            >
                              <MDBox
                                display="flex"
                                alignItems="baseline"
                                gap={1}
                              >
                                <MDTypography
                                  variant="button"
                                  fontWeight="bold"
                                >
                                  {config.label}
                                </MDTypography>
                                <MDTypography variant="caption" color="text">
                                  {dateToLocalDate(entry.performedAt)}
                                </MDTypography>
                              </MDBox>
                              <MDTypography
                                variant="caption"
                                color="text"
                                sx={{ mt: 0.2 }}
                              >
                                {entry.description}
                                {entry.performedBy && (
                                  <>
                                    {" • "}
                                    <b>
                                      {entry.performedBy.name}{" "}
                                      {entry.performedBy.lastName}
                                    </b>
                                  </>
                                )}
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        );
                      })}
                    </MDBox>
                  </MDBox>
                </Card>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default PurchaseDetail;
