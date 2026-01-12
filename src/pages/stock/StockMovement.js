import { useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DataGrid } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "components/OUTables/CustomNoRowsOverlay";

// Data
//import { formatDate } from "./mockData";
import { useGetStockMovementsQuery } from "api/stockApi";
import { useGetProductsQuery } from "api/productApi";
import CircularProgress from "@mui/material/CircularProgress";
import { dateToLocalDate } from "utils/dateFormat";

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
    case "MANUFACTURING":
      return "Producción";
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

const getDocumentLink = (reason, reference) => {
  if (!reason || !reference) return undefined;

  switch (reason) {
    case "BUY":
      return `/compras/detalle1/${reference}`;
    case "ADJUST":
      return `/compras/ajustes/${reference}`;
    case "purchase":
      return `/compras/compras/${reference}`;
    case "adjustment":
      return `/compras/ajustes/${reference}`;
    case "MANUFACTURING":
      return `/manufactura/detalle/${reference}`;
    default:
      return undefined;
  }
};

const StockMovements = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productFilter = searchParams.get("product") || "all";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(productFilter);

  const queryParams = useMemo(
    () => ({
      search: search || undefined,
      productId: selectedProduct === "all" ? undefined : selectedProduct,
      type: typeFilter === "all" ? undefined : typeFilter,
      reason: reasonFilter === "all" ? undefined : reasonFilter,
    }),
    [search, selectedProduct, typeFilter, reasonFilter]
  );

  const {
    data: movementsData,
    isLoading: isLoadingMovements,
    isError: isErrorMovements,
  } = useGetStockMovementsQuery(queryParams);

  const { data: productsData } = useGetProductsQuery();

  const movements = movementsData?.data || [];

  const products =
    productsData?.products || (Array.isArray(productsData) ? productsData : []);

  // Local sorting as fallback or additional layer
  const sortedMovements = useMemo(() => {
    return [...movements].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [movements]);

  // Note: Since we pass filters to the API, we might not need local filtering,
  // but if the API only returns a subset or doesn't filter by everything yet,
  // we keep this as a safeguard.
  const filteredMovements = useMemo(() => {
    return sortedMovements.filter((mov) => {
      // If API already filtered, these will mostly be true
      const productName = mov.product?.name || "";
      const movementCode = mov.code || "";
      const referenceId = mov.reference || "";

      const matchesSearch =
        productName.toLowerCase().includes(search.toLowerCase()) ||
        movementCode.toLowerCase().includes(search.toLowerCase()) ||
        referenceId.toLowerCase().includes(search.toLowerCase());

      const matchesProduct =
        selectedProduct === "all" || mov.productId === selectedProduct;

      const matchesType = typeFilter === "all" || mov.type === typeFilter;

      const matchesReason =
        reasonFilter === "all" || mov.reason === reasonFilter;

      return matchesSearch && matchesProduct && matchesType && matchesReason;
    });
  }, [sortedMovements, search, selectedProduct, typeFilter, reasonFilter]);

  const columns = [
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1,
      renderCell: ({ row }) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon fontSize="small" sx={{ color: "text.secondary" }}>
            calendar_today
          </Icon>
          <MDTypography variant="caption" fontWeight="light" color="text">
            {dateToLocalDate(row.createdAt)}
          </MDTypography>
        </MDBox>
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
      field: "product",
      headerName: "Producto",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Link
          to={`/productos/detalle/${row.productId}`}
          style={{ textDecoration: "none" }}
        >
          <MDTypography
            variant="button"
            fontWeight="medium"
            color="info"
            sx={{
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {row.product.name}
          </MDTypography>
        </Link>
      ),
    },
    {
      field: "type",
      headerName: "Tipo",
      align: "center",
      headerAlign: "center",
      flex: 1.2,
      renderCell: ({ row }) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon
            fontSize="small"
            color={
              row.type?.toUpperCase() === "IN" ||
              row.type?.toUpperCase() === "RELEASED"
                ? "success"
                : "error"
            }
          >
            {row.type?.toUpperCase() === "IN" ||
            row.type?.toUpperCase() === "RELEASED"
              ? "arrow_upward"
              : "arrow_downward"}
          </Icon>
          <MDBadge
            variant="gradient"
            color={getMovementTypeColor(row.type)}
            badgeContent={getMovementTypeLabel(row.type)}
            size="xs"
          />
        </MDBox>
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
          {getReasonLabel(row.reason)}
        </MDTypography>
      ),
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        const isOut =
          row.type === "OUT" ||
          row.type === "RESERVED" ||
          row.type === "sale" || // Legacy fallback
          row.type === "SALIDA";

        const isPositive = !isOut && row.quantity > 0;
        const displayQty = isOut
          ? `-${Math.abs(row.quantity)}`
          : `+${row.quantity}`;
        const color = isPositive ? "success" : "error";

        return (
          <MDTypography variant="button" fontWeight="bold" color={color}>
            {displayQty}
          </MDTypography>
        );
      },
    },

    {
      field: "reference",
      headerName: "Documento",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      renderCell: ({ row }) => {
        const docLink = getDocumentLink(row.reason, row.reference);
        return row.reference ? (
          docLink ? (
            <Link to={docLink} style={{ textDecoration: "none" }}>
              <MDBox display="flex" alignItems="center" gap={0.5}>
                <MDTypography
                  variant="caption"
                  fontWeight="medium"
                  color="info"
                  sx={{
                    fontFamily: "monospace",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {getReasonLabel(row.reason)}
                </MDTypography>
                <Icon
                  fontSize="inherit"
                  sx={{
                    fontSize: "12px",
                    color: "info.main",
                  }}
                >
                  open_in_new
                </Icon>
              </MDBox>
            </Link>
          ) : (
            <MDTypography
              variant="caption"
              fontWeight="light"
              color="text"
              sx={{ fontFamily: "monospace" }}
            >
              {getReasonLabel(row.reason)}
            </MDTypography>
          )
        ) : (
          <MDTypography variant="caption" color="text">
            -
          </MDTypography>
        );
      },
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
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="medium">
            Movimientos de Stock
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
              / Historial completo de inventario
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Warning Notice */}
        <MDBox
          display="flex"
          alignItems="center"
          gap={2}
          p={2}
          mb={3}
          borderRadius="lg"
          sx={{
            backgroundColor: "rgba(244, 67, 54, 0.05)",
            border: "1px solid rgba(244, 67, 54, 0.2)",
          }}
        >
          <Icon color="error">lock</Icon>
          <MDTypography variant="button" color="error" fontWeight="medium">
            Los movimientos no pueden editarse ni eliminarse. Cada registro es
            un documento de auditoría inmutable.
          </MDTypography>
        </MDBox>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <MDBox p={3} display="flex" flexDirection="column" gap={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <MDInput
                  label="Buscar por nombre del producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <Autocomplete
                  options={[
                    { name: "Todos los productos", id: "all" },
                    ...products.map((p) => ({
                      name: p.name,
                      id: p.id || p._id,
                    })),
                  ]}
                  getOptionLabel={(option) => option.name}
                  value={
                    selectedProduct === "all"
                      ? { name: "Todos los productos", id: "all" }
                      : products.find(
                          (p) => (p.id || p._id) === selectedProduct
                        ) || { name: "Todos los productos", id: "all" }
                  }
                  onChange={(event, newValue) => {
                    setSelectedProduct(newValue ? newValue.id : "all");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Producto"
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "45px",
                          paddingTop: "0px !important",
                        },
                      }}
                    />
                  )}
                  disableClearable
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={2.5}>
                <FormControl fullWidth>
                  <InputLabel id="type-filter-label">Tipo</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    value={typeFilter}
                    label="Tipo"
                    onChange={(e) => setTypeFilter(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="IN">Ingreso</MenuItem>
                    <MenuItem value="OUT">Egreso</MenuItem>
                    <MenuItem value="RESERVED">Reserva</MenuItem>
                    <MenuItem value="RELEASED">Liberación</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} lg={2.5}>
                <FormControl fullWidth>
                  <InputLabel id="reason-filter-label">Motivo</InputLabel>
                  <Select
                    labelId="reason-filter-label"
                    value={reasonFilter}
                    label="Motivo"
                    onChange={(e) => setReasonFilter(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="BUY">Compra</MenuItem>
                    <MenuItem value="SALE">Venta</MenuItem>
                    <MenuItem value="ORDER">Pedido</MenuItem>
                    <MenuItem value="ADJUST">Ajuste</MenuItem>
                    <MenuItem value="ADJUST">Ajuste</MenuItem>
                    <MenuItem value="RETURN">Devolución</MenuItem>
                    <MenuItem value="MANUFACTURING">Producción</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

        {/* Movements Table */}
        <Card>
          <MDBox
            p={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h6">Historial de Movimientos</MDTypography>
            <MDTypography variant="caption" color="text">
              Mostrando {filteredMovements.length} movimientos
            </MDTypography>
          </MDBox>
          <MDBox
            sx={{
              height: 600,
              width: "100%",
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            {isLoadingMovements ? (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress color="info" />
              </MDBox>
            ) : isErrorMovements ? (
              <MDBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                gap={1}
              >
                <Icon color="error" fontSize="large">
                  error
                </Icon>
                <MDTypography variant="h6">
                  Error al cargar movimientos
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Por favor, intenta de nuevo más tarde
                </MDTypography>
              </MDBox>
            ) : (
              <DataGrid
                rows={movements}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
                getRowId={(row) => row.id || row._id}
                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f0f2f5",
                  },
                }}
              />
            )}
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default StockMovements;
