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
import { DataGrid } from "@mui/x-data-grid";

// Data
// Data
import { useGetStockByProductQuery } from "api/stockApi";
import CircularProgress from "@mui/material/CircularProgress";
import { dateToLocalDate } from "utils/dateFormat";

const getStatusLabel = (status) => {
  switch (status) {
    case "NORMAL":
      return "Normal";
    case "LOW":
      return "Bajo";
    case "ZERO":
      return "Sin Stock";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "NORMAL":
      return "success";
    case "LOW":
      return "warning";
    case "ZERO":
      return "error";
    default:
      return "secondary";
  }
};

const getMovementTypeLabel = (type) => {
  switch (type?.toUpperCase()) {
    case "IN":
      return "Ingreso";
    case "OUT":
      return "Egreso";
    case "RESERVED":
      return "Reserva";
    case "RELEASED":
      return "Liberación";
    default:
      return type;
  }
};

const getMovementTypeColor = (type) => {
  switch (type?.toUpperCase()) {
    case "IN":
      return "success";
    case "OUT":
      return "error";
    case "RESERVED":
      return "warning";
    case "RELEASED":
      return "info";
    default:
      return "secondary";
  }
};

const StockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: stockData, isLoading, isError } = useGetStockByProductQuery(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (isError || !stockData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Icon sx={{ fontSize: "64px", color: "text.secondary", mb: 2 }}>
            inventory
          </Icon>
          <MDTypography variant="h4" fontWeight="medium">
            Producto no encontrado
          </MDTypography>
          <MDTypography variant="button" color="text" mb={3}>
            {isError
              ? "Ocurrió un error al cargar los datos."
              : "El producto que buscas no existe en el inventario."}
          </MDTypography>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => navigate("/productos/stock/lista")}
          >
            Volver a Stock
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  const { product, stock, lastMovements = [] } = stockData;

  const currentStock = stock.available + stock.reserved;
  const reservedStock = stock.reserved;
  const availableStock = stock.available;

  let stockStatus = "NORMAL";
  if (availableStock <= 0) {
    stockStatus = "ZERO";
  } else if (availableStock < (product.minStock || 0)) {
    stockStatus = "LOW";
  }

  const movements = lastMovements;
  const lastMovement = movements[0];

  const movementColumns = [
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="light" color="text">
          {dateToLocalDate(row.createdAt)}
        </MDTypography>
      ),
    },
    {
      field: "type",
      headerName: "Tipo",
      flex: 1,
      renderCell: ({ row }) => (
        <MDBadge
          variant="gradient"
          color={getMovementTypeColor(row.type)}
          badgeContent={getMovementTypeLabel(row.type)}
          size="xs"
        />
      ),
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDTypography
          variant="button"
          fontWeight="bold"
          color={row.quantity > 0 ? "success" : "error"}
        >
          {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
        </MDTypography>
      ),
    },
    {
      field: "balanceAfter",
      headerName: "Saldo",
      flex: 0.8,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="medium">
          {row.balanceAfter}
        </MDTypography>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
        <MDBox
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              {product.name}
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDButton
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/productos/stock/lista")}
                sx={{ pl: 0, textTransform: "none" }}
              >
                <Icon>arrow_back</Icon>&nbsp;Volver
              </MDButton>
              <MDTypography variant="button" color="text" ml={1}>
                / Código: {product.code || "N/A"}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Info Notice */}
        <MDBox
          display="flex"
          alignItems="center"
          gap={2}
          p={2}
          mb={3}
          borderRadius="lg"
          sx={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
          }}
        >
          <Icon color="info">info</Icon>
          <MDTypography variant="button" color="text">
            Este stock es el resultado de todos los movimientos históricos
            registrados. No puede ser modificado manualmente.
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Stock Summary Card */}
              <Card>
                <MDBox p={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        borderRadius="lg"
                        bgColor="grey-100"
                        sx={{ border: "1px solid #ccc" }}
                      >
                        <Icon color="primary" sx={{ mb: 1 }}>
                          inventory_2
                        </Icon>
                        <MDTypography variant="h4" fontWeight="bold">
                          {currentStock}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                        >
                          Stock Total
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        borderRadius="lg"
                        bgColor="grey-100"
                        sx={{ border: "1px solid #ccc" }}
                      >
                        <Icon color="warning" sx={{ mb: 1 }}>
                          schedule
                        </Icon>
                        <MDTypography variant="h4" fontWeight="bold">
                          {reservedStock}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                        >
                          Reservado
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        borderRadius="lg"
                        bgColor="grey-100"
                        variant="outlined"
                        sx={{ border: "1px solid #ccc" }}
                      >
                        <Icon color="success" sx={{ mb: 1 }}>
                          check_circle
                        </Icon>
                        <MDTypography variant="h4" fontWeight="bold">
                          {availableStock}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                        >
                          Disponible
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDBox
                        textAlign="center"
                        p={2}
                        borderRadius="lg"
                        bgColor="grey-100"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        height="100%"
                        sx={{ border: "1px solid #ccc" }}
                      >
                        <MDBox mb={1}>
                          <MDBadge
                            variant="gradient"
                            color={getStatusColor(stockStatus)}
                            badgeContent={getStatusLabel(stockStatus)}
                            size="sm"
                          />
                        </MDBox>
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          textTransform="uppercase"
                        >
                          Estado
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Recent Movements Table */}
              <Card>
                <MDBox
                  p={3}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDBox display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>history</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      Últimos Movimientos
                    </MDTypography>
                  </MDBox>
                  <Link
                    to={`/productos/stock/movimientos?product=${id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <MDButton variant="outlined" color="info" size="small">
                      Ver todos
                    </MDButton>
                  </Link>
                </MDBox>
                <MDBox
                  sx={{
                    height: 350,
                    width: "100%",
                    "& .MuiDataGrid-cell": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  <DataGrid
                    rows={movements}
                    columns={movementColumns}
                    getRowId={(row) => row.id || row._id || row.code}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    hideFooterSelectedRowCount
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f0f2f5",
                      },
                    }}
                  />
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Product Info */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>label</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Información del Producto
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1.5, color: "text.secondary" }}
                    >
                      layers
                    </Icon>
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="text"
                        display="block"
                      >
                        Categoría
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="medium">
                        {product.category?.name || "Sin categoría"}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1.5, color: "text.secondary" }}
                    >
                      inventory_2
                    </Icon>
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="text"
                        display="block"
                      >
                        Unidad
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        fontWeight="medium"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {product.unit || "Unidad"}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    mb={lastMovement ? 2 : 0}
                  >
                    <Icon
                      fontSize="small"
                      sx={{ mr: 1.5, color: "text.secondary" }}
                    >
                      report_problem
                    </Icon>
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="text"
                        display="block"
                      >
                        Stock Mínimo
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="medium">
                        {product.minStock || 0} {"Unid."}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  {/*  {stockItem && stockItem?.lastMovementDate && (
                    <MDBox display="flex" alignItems="center">
                      <Icon
                        fontSize="small"
                        sx={{ mr: 1.5, color: "text.secondary" }}
                      >
                        calendar_today
                      </Icon>
                      <MDBox>
                        <MDTypography
                          variant="caption"
                          color="text"
                          display="block"
                        >
                          Último Movimiento
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium">
                          {dateToLocalDate(lastMovement.createdAt)}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  )} */}
                </MDBox>
              </Card>

              {/* Quick Actions */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                    Accesos Rápidos
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDButton
                      component={Link}
                      to={`/productos/stock/movimientos?product=${id}`}
                      variant="outlined"
                      color="info"
                      fullWidth
                      sx={{ justifyContent: "center" }}
                    >
                      <Icon>history</Icon>&nbsp;Ver todos los movimientos
                    </MDButton>
                    <MDButton
                      component={Link}
                      to="/compras"
                      variant="outlined"
                      color="info"
                      fullWidth
                      sx={{ justifyContent: "center" }}
                    >
                      <Icon>shopping_cart</Icon>&nbsp;Ver compras relacionadas
                    </MDButton>
                    <MDButton
                      component={Link}
                      to="/compras"
                      variant="outlined"
                      color="info"
                      fullWidth
                      sx={{ justifyContent: "center" }}
                    >
                      <Icon>description</Icon>&nbsp;Ver ajustes relacionados
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Last Movement Summary */}
              {lastMovement && (
                <Card>
                  <MDBox p={2} display="flex" alignItems="center">
                    <Icon sx={{ mr: 1, color: "info" }}>info</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      Detalle Último Movimiento
                    </MDTypography>
                  </MDBox>
                  <MDBox p={2} pt={0}>
                    <MDBox display="flex" justifyContent="space-between" mb={1}>
                      <MDTypography variant="caption" color="text">
                        Fecha
                      </MDTypography>
                      <MDTypography variant="caption" fontWeight="medium">
                        {dateToLocalDate(lastMovement.createdAt)}
                      </MDTypography>
                    </MDBox>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      mb={1}
                      alignItems="center"
                    >
                      <MDTypography variant="caption" color="text">
                        Tipo
                      </MDTypography>
                      <MDBadge
                        variant="gradient"
                        color={getMovementTypeColor(lastMovement.type)}
                        badgeContent={getMovementTypeLabel(lastMovement.type)}
                        size="xs"
                      />
                    </MDBox>
                    <MDBox display="flex" justifyContent="space-between" mb={1}>
                      <MDTypography variant="caption" color="text">
                        Cantidad
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        fontWeight="bold"
                        color={lastMovement.quantity > 0 ? "success" : "error"}
                      >
                        {lastMovement.quantity > 0
                          ? `+${lastMovement.quantity}`
                          : lastMovement.quantity}
                      </MDTypography>
                    </MDBox>
                    {lastMovement.documentNumber && (
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="caption" color="text">
                          Documento
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          fontWeight="medium"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {lastMovement.code}
                        </MDTypography>
                      </MDBox>
                    )}
                    <MDBox display="flex" justifyContent="space-between">
                      <MDTypography variant="caption" color="text">
                        Usuario
                      </MDTypography>
                      <MDTypography variant="caption" fontWeight="medium">
                        {lastMovement.createdBy.name}{" "}
                        {lastMovement.createdBy.lastName}
                      </MDTypography>
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

export default StockDetail;
