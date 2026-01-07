import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DataGrid } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "components/OUTables/CustomNoRowsOverlay";

// Data
import { useGetStockListQuery, useGetStockSummaryQuery } from "api/stockApi";
import { useGetCategoriesQuery } from "api/categoryApi";
import { usePutProductMutation } from "api/productApi";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import colors from "assets/theme/base/colors";

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

const StockPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Paginación
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const queryParams = useMemo(
    () => ({
      query: search || undefined,
      category: categoryFilter === "all" ? undefined : categoryFilter,
      stockStatus: statusFilter === "all" ? undefined : statusFilter,
      page: paginationModel.page + 1, // backend 1-based
      limit: paginationModel.pageSize,
    }),
    [search, categoryFilter, statusFilter, paginationModel]
  );

  const {
    data: stockData,
    isLoading: isLoadingStock,
    isError: isErrorStock,
  } = useGetStockListQuery(queryParams);

  const { data: summaryData, isLoading: isLoadingSummary } =
    useGetStockSummaryQuery();

  const { data: categoriesData } = useGetCategoriesQuery();
  const [putProduct] = usePutProductMutation();

  const stockItems =
    stockData?.data || (Array.isArray(stockData) ? stockData : []);
  const stats = summaryData || {
    totalProducts: 0,
    normalStockCount: 0,
    lowStockCount: 0,
    zeroStockCount: 0,
  };
  const categoriesList = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    if (newRow.minStock === oldRow.minStock) return oldRow;

    // Validación: No permitir números negativos
    if (newRow.minStock < 0) {
      Swal.fire({
        icon: "warning",
        title: "Valor Inválido",
        text: "El stock mínimo no puede ser un número negativo.",
        confirmButtonColor: colors.info.main,
      });
      return oldRow;
    }

    // Pedir motivo del cambio para el historial
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Motivo del cambio",
      text: "¿Por qué se está modificando el stock mínimo?",
      input: "text",
      inputPlaceholder: "Ej: Ajuste de stock de seguridad, reabastecimiento...",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: colors.info.main,
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un motivo para el historial de cambios.";
        }
      },
    });

    if (!isConfirmed) return oldRow;

    try {
      await putProduct({
        id: newRow.productId,
        minStock: Number(newRow.minStock),
        reason: reason, // Incluimos el motivo
      }).unwrap();
      return newRow;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de Actualización",
        text:
          "No se pudo actualizar el stock mínimo: " +
          (error.data?.message || error.message),
        confirmButtonColor: colors.info.main,
      });
      return oldRow;
    }
  };

  const columns = [
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography variant="caption" fontWeight="medium" color="text">
          {row?.code || "PROD-2026-0001"}
        </MDTypography>
      ),
    },
    {
      field: "name",
      headerName: "Producto",
      flex: 1.5,
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="medium">
          {row.name}
        </MDTypography>
      ),
    },
    {
      field: "category",
      headerName: "Categoría",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography variant="caption" color="text">
          {row.category?.name}
        </MDTypography>
      ),
    },
    {
      field: "quantityAvailable",
      headerName: "Stock Disponible",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Tooltip
          title={
            <MDBox>
              <MDTypography variant="caption" color="white" display="block">
                Stock total: {row.stockAvailable}
              </MDTypography>
              <MDTypography variant="caption" color="white" display="block">
                Reservado: {row.quantityReserved}
              </MDTypography>
              <MDTypography variant="caption" color="white" display="block">
                Disponible: {row.quantityAvailable}
              </MDTypography>
            </MDBox>
          }
          placement="top"
          arrow
        >
          <MDBox>
            <MDBadge
              variant="gradient"
              color={getStatusColor(row.stockStatus)}
              badgeContent={String(row.quantityAvailable)}
              size="sm"
              container
              max={99999}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  height: "24px",
                  minWidth: "24px",
                  padding: "0 6px",
                  fontWeight: "bold",
                },
              }}
            />
          </MDBox>
        </Tooltip>
      ),
    },
    {
      field: "quantityReserved",
      headerName: "Reservado",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <MDTypography variant="caption" color="text">
          {row.quantityReserved > 0 ? row.quantityReserved : "No"}
        </MDTypography>
      ),
    },
    {
      field: "unit",
      headerName: "Unidad",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography
          variant="caption"
          color="text"
          sx={{ textTransform: "capitalize" }}
        >
          {row.unit}
        </MDTypography>
      ),
    },
    {
      field: "minStock",
      headerName: "Stock Mínimo",
      type: "number",
      editable: true,
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <MDBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <MDTypography variant="caption" fontWeight="medium" color="info">
            {row.minStock}
          </MDTypography>
          <Icon
            fontSize="small"
            sx={{ ml: 0.5, opacity: 0.5, fontSize: "12px !important" }}
          >
            edit
          </Icon>
        </MDBox>
      ),
    },
    {
      field: "stockStatus",
      headerName: "Estado",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <MDBadge
          variant="gradient"
          color={getStatusColor(row.stockStatus)}
          badgeContent={getStatusLabel(row.stockStatus)}
          size="sm"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.65rem",
              height: "24px",
              minWidth: "24px",
              fontWeight: "bold",
            },
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Acción",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDButton
          variant="text"
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/productos/detalle/${row.productId}?tab=1`);
          }}
        >
          Ver&nbsp;<Icon>arrow_forward</Icon>
        </MDButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
        {/*  <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="medium">
            Stock Actual
          </MDTypography>
          <MDTypography variant="button" color="text">
            Consulta el inventario disponible en tiempo real
          </MDTypography>
        </MDBox> */}
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mt={0}
          p={3}
          mb={6}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox>
            <MDTypography variant="h6" color="white" textTransform="uppercase">
              Stock Actual
            </MDTypography>
            <MDTypography
              variant="button"
              color="white"
              fontWeight="regular"
              opacity={0.8}
            >
              Consulta el inventario disponible en tiempo real
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* KPIs */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <ComplexStatisticsCard
              color="dark"
              icon="inventory_2"
              title="Total Productos"
              count={isLoadingSummary ? "..." : stats.totalProducts}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ComplexStatisticsCard
              color="success"
              icon="check_circle"
              title="Stock Normal"
              count={isLoadingSummary ? "..." : stats.normalStockCount}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ComplexStatisticsCard
              color="warning"
              icon="warning"
              title="Stock Bajo"
              count={isLoadingSummary ? "..." : stats.lowStockCount}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ComplexStatisticsCard
              color="error"
              icon="error"
              title="Sin Stock"
              count={isLoadingSummary ? "..." : stats.zeroStockCount}
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <MDBox
            p={3}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
          >
            <MDBox flex={1}>
              <MDInput
                label="Buscar por nombre o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" gap={2}>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel id="category-filter-label">Categoría</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={categoryFilter}
                  label="Categoría"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {categoriesList.map((cat) => (
                    <MenuItem
                      key={typeof cat === "object" ? cat._id || cat.id : cat}
                      value={typeof cat === "object" ? cat._id || cat.id : cat}
                    >
                      {typeof cat === "object" ? cat.name : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel id="status-filter-label">Estado</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="NORMAL">Normal</MenuItem>
                  <MenuItem value="LOW">Bajo</MenuItem>
                  <MenuItem value="ZERO">Sin Stock</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
          </MDBox>
        </Card>

        {/* Table */}
        <Card>
          <MDBox p={2}>
            <MDTypography variant="h6">Lista de Productos</MDTypography>
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
              Puedes editar el <strong>Stock Mínimo</strong> haciendo doble clic
              en la celda. El estado cambiará automáticamente:{" "}
              <strong>Normal</strong> (Stock &gt; Mínimo), <strong>Bajo</strong>{" "}
              (Stock &lt; Mínimo) o <strong>Sin Stock</strong> (Stock &le; 0).
              El resto de los valores <strong>no son editables</strong> y se
              calcularán automáticamente con compras, ventas, devoluciones, etc.
            </MDTypography>
          </MDBox>
          <MDBox
            sx={{
              height: 500,
              width: "100%",
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            {isLoadingStock ? (
              <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress color="info" />
              </MDBox>
            ) : isErrorStock ? (
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
                  Error al cargar el stock
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Por favor, intenta de nuevo más tarde
                </MDTypography>
              </MDBox>
            ) : (
              <DataGrid
                rows={stockItems}
                columns={columns}
                getRowId={(row) => row.productId}
                rowCount={stockData?.total || 0}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 20, 50]}
                processRowUpdate={handleProcessRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                slots={{
                  noRowsOverlay: () => (
                    <CustomNoRowsOverlay
                      title="No se encontraron productos"
                      message="Intenta ajustar los filtros o verifica el inventario"
                    />
                  ),
                }}
                disableRowSelectionOnClick
                /* onRowClick={({ row }) =>
                  navigate(`/productos/stock/detalle/${row.productId}`)
                } */
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

export default StockPage;
