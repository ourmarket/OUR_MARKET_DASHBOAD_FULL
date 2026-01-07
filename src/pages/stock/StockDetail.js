import { Link, useParams } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

import { DataGrid } from "@mui/x-data-grid";

// Data
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
const getReasonLabel = (reason) => {
  switch (reason) {
    case "BUY":
      return "Compra";
    case "SALE":
      return "Venta";
    case "ORDER":
      return "Pedido";
    case "ADJUST":
      return "Ajuste";
    case "RETURN":
      return "Devolución";
    case "purchase": // Mantengo por si acaso quedan datos viejos
      return "Compra";
    case "receipt":
      return "Recepción";
    case "adjustment":
      return "Ajuste";
    case "sale":
      return "Venta";
    case "transfer":
      return "Transferencia";
    case "correction":
      return "Corrección";
    default:
      return reason;
  }
};

const StockDetail = ({ stockData }) => {
  const { id } = useParams();
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
      field: "code",
      headerName: "Nº Movimiento",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography
          variant="caption"
          fontWeight="medium"
          color="text"
          sx={{ fontFamily: "monospace" }}
        >
          {row.code}
        </MDTypography>
      ),
    },

    {
      field: "type",
      headerName: "Tipo",
      align: "center",
      headerAlign: "center",
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
      field: "reason",
      headerName: "Motivo",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography variant="caption" color="text">
          {getReasonLabel(row?.reason)}
        </MDTypography>
      ),
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      align: "center",
      headerAlign: "center",
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
      field: "createdBy",
      headerName: "Usuario",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon fontSize="small" sx={{ color: "text.secondary" }}>
            person
          </Icon>
          <MDTypography variant="caption" color="text">
            {row.createdBy.name + " " + row.createdBy.lastName}
          </MDTypography>
        </MDBox>
      ),
    },
  ];

  return (
    <MDBox py={3}>
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <MDBox display="flex" flexDirection="column" gap={3}>
            {/* Resumen de Inventario Integrado */}
            <Card>
              <MDBox p={3}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Icon sx={{ mr: 1, color: "info.main" }}>inventory_2</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Resumen de Inventario
                  </MDTypography>
                  <MDBox ml="auto">
                    <MDBadge
                      variant="gradient"
                      color={getStatusColor(stockStatus)}
                      badgeContent={getStatusLabel(stockStatus)}
                      size="sm"
                    />
                  </MDBox>
                </MDBox>

                <MDBox
                  p={2}
                  sx={{
                    border: "1px dashed #ddd",
                    borderRadius: "10px",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <MDBox textAlign="center">
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Disponible
                        </MDTypography>
                        <MDTypography variant="h4" color="success">
                          {availableStock}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        borderLeft: { sm: "1px solid #ddd" },
                        borderRight: { sm: "1px solid #ddd" },
                      }}
                    >
                      <MDBox textAlign="center">
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Reservado
                        </MDTypography>
                        <MDTypography variant="h4" color="warning">
                          {reservedStock}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MDBox textAlign="center">
                        <MDTypography
                          variant="caption"
                          color="text"
                          fontWeight="bold"
                          textTransform="uppercase"
                        >
                          Stock Total
                        </MDTypography>
                        <MDTypography variant="h4" color="dark">
                          {currentStock}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>

                <MDBox mt={2}>
                  <MDTypography
                    variant="caption"
                    color="text"
                    fontStyle="italic"
                  >
                    * El stock disponible es el que puede venderse
                    inmediatamente. El reservado pertenece a pedidos pendientes
                    de entrega.
                  </MDTypography>
                </MDBox>
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
                <Icon sx={{ mr: 1, color: "info.main" }}>info</Icon>
                <MDTypography variant="h6" fontWeight="medium">
                  Información Logística
                </MDTypography>
              </MDBox>
              <MDBox p={2} pt={0}>
                <MDBox display="flex" justifyContent="space-between" mb={1.5}>
                  <MDTypography variant="button" color="text">
                    Categoría:
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="medium">
                    {product.category?.name || "Sin categoría"}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" justifyContent="space-between" mb={1.5}>
                  <MDTypography variant="button" color="text">
                    Unidad de Medida:
                  </MDTypography>
                  <MDTypography
                    variant="button"
                    fontWeight="medium"
                    textTransform="capitalize"
                  >
                    {product.unit || "Unidad"}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" justifyContent="space-between" mb={1.5}>
                  <MDTypography variant="button" color="text">
                    Stock Mínimo:
                  </MDTypography>
                  <MDBox display="flex" alignItems="center">
                    <Icon fontSize="inherit" color="error" sx={{ mr: 0.5 }}>
                      report_problem
                    </Icon>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="error"
                    >
                      {product.minStock || 0}
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <Divider />
                <MDTypography variant="caption" color="text" display="block">
                  * El sistema alertará cuando el stock disponible sea menor al
                  mínimo definido.
                </MDTypography>
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
                    <MDBox display="flex" justifyContent="space-between" mb={1}>
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
  );
};

export default StockDetail;
