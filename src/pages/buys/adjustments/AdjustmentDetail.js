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

// API & Components
import { useGetPurchaseAdjustmentByIdQuery } from "api/purchaseAdjustmentApi";
import Loading from "components/DRLoading";
import { dateToLocalDate } from "utils/dateFormat";
import { formatPrice } from "utils/formaPrice";

const AdjustmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: adjustment,
    isLoading,
    error,
  } = useGetPurchaseAdjustmentByIdQuery(id);

  if (isLoading) return <Loading />;

  if (error || !adjustment) {
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
            Ajuste no encontrado
          </MDTypography>
          <MDTypography variant="body2" color="text" gutterBottom>
            Hubo un error al cargar el ajuste o el documento no existe.
          </MDTypography>
          <MDButton
            variant="gradient"
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

  const relatedPurchase = adjustment.buyId;
  const relatedReceipt = adjustment.goodsReceipt;

  const getAdjustmentTypeLabel = (type) => {
    switch (type) {
      case "SHORTAGE":
        return "Faltante";
      case "DAMAGE":
        return "Daño";
      case "PRICE":
        return "Diferencia de Precio";
      case "BONUS":
        return "Bonificación";
      case "RETURN":
        return "Devolución";
      default:
        return type;
    }
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case "SHORTAGE":
        return "error";
      case "DAMAGE":
        return "warning";
      case "PRICE":
        return "info";
      case "BONUS":
        return "success";
      case "RETURN":
        return "primary";
      default:
        return "secondary";
    }
  };

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
              {adjustment.code}
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
                / Detalle de Ajuste
              </MDTypography>
            </MDBox>
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
              Documento Histórico
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Este ajuste es un documento cerrado y no puede ser modificado.
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
                    <Grid item xs={12} sm={4}>
                      <MDBox display="flex" flexDirection="column">
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
                            {dateToLocalDate(adjustment.createdAt)}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} sm={4}>
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
                          Tipo de Ajuste
                        </MDTypography>
                        <MDBox mt={0.5}>
                          <MDBadge
                            badgeContent={getAdjustmentTypeLabel(
                              adjustment.type
                            )}
                            color={getAdjustmentTypeColor(adjustment.type)}
                            variant="gradient"
                            size="sm"
                          />
                        </MDBox>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
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
                          Monto del Ajuste
                        </MDTypography>
                        <MDTypography variant="h5" mt={0.5} color="error">
                          {formatPrice(adjustment.totalAmount)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Credit Info Notice */}
              <MDBox
                bgColor="info"
                variant="gradient"
                borderRadius="lg"
                p={2}
                display="flex"
                alignItems="flex-start"
              >
                <Icon sx={{ color: "#fff", mr: 2, mt: 0.5 }}>credit_card</Icon>
                <MDBox>
                  <MDTypography
                    variant="subtitle2"
                    color="white"
                    fontWeight="bold"
                  >
                    Crédito del Proveedor
                  </MDTypography>
                  <MDTypography variant="caption" color="white">
                    Los ajustes representan créditos otorgados por el proveedor
                    y reducen el saldo a pagar.
                  </MDTypography>
                </MDBox>
              </MDBox>

              {/* Items Table */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ítems Ajustados
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Monto Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {adjustment.items?.map((item, index) => (
                        <TableRow key={item._id || index}>
                          <TableCell>
                            {item.nameSnapshot || item.description}
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {formatPrice(item.unitAmount)}
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography
                              variant="button"
                              fontWeight="bold"
                              color="error"
                            >
                              {formatPrice(item.quantity * item.unitAmount)}
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
                      <Divider />
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <MDTypography variant="body1" fontWeight="bold">
                          Total Ajuste
                        </MDTypography>
                        <MDTypography
                          variant="body1"
                          fontWeight="bold"
                          color="error"
                        >
                          {formatPrice(adjustment.totalAmount)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Related Documents */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>description</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Documentos Relacionados
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  {relatedPurchase && (
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      mb={relatedReceipt ? 2 : 0}
                      borderRadius="lg"
                      bgColor="grey-100"
                    >
                      <MDBox>
                        <MDTypography
                          variant="caption"
                          color="text"
                          display="block"
                        >
                          Compra Asociada
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium">
                          {relatedPurchase.code}
                        </MDTypography>
                      </MDBox>
                      <Link
                        to={`/compras/detalle1/${
                          relatedPurchase.id || relatedPurchase._id
                        }`}
                      >
                        <MDButton variant="text" color="info" size="small">
                          Ver&nbsp;<Icon>open_in_new</Icon>
                        </MDButton>
                      </Link>
                    </MDBox>
                  )}
                  {relatedReceipt && (
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      borderRadius="lg"
                      bgColor="grey-100"
                    >
                      <MDBox display="flex" alignItems="center">
                        <Icon sx={{ mr: 1, color: "text.secondary" }}>
                          inventory_2
                        </Icon>
                        <MDBox>
                          <MDTypography
                            variant="caption"
                            color="text"
                            display="block"
                          >
                            Recepción Relacionada
                          </MDTypography>
                          <MDTypography variant="button" fontWeight="medium">
                            {relatedReceipt.code ||
                              relatedReceipt.receiptNumber}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
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
                    {adjustment.supplier?.businessName ||
                      adjustment.supplier?.name}
                  </MDTypography>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    >
                      email
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {adjustment.supplier?.email || "N/A"}
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
                      {adjustment.supplier?.phone || "N/A"}
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
                      {adjustment.supplier?.address || "N/A"}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Document Info */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>info</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Información del Documento
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Nº Ajuste
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {adjustment.code}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Tipo
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {getAdjustmentTypeLabel(adjustment.type)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="caption" color="text">
                      Fecha de Registro
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {dateToLocalDate(adjustment.createdAt)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between">
                    <MDTypography variant="caption" color="text">
                      Registrado por
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="medium">
                      {adjustment.createdBy?.name
                        ? `${adjustment.createdBy.name} ${adjustment.createdBy.lastName}`
                        : "Sistema"}
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

export default AdjustmentDetail;
