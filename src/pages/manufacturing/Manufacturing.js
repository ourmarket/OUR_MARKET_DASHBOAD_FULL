import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";

// Data
import {
  productionOrders,
  getManufacturingStats,
  formatCurrency,
  formatDate,
} from "./mockData";
import CustomNoRowsOverlay from "components/OUTables/CustomNoRowsOverlay";

const getStatusLabel = (status) => {
  switch (status) {
    case "draft":
      return "Borrador";
    case "in_progress":
      return "En Proceso";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "draft":
      return "secondary";
    case "in_progress":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "info";
  }
};

const Manufacturing = () => {
  const navigate = useNavigate();
  const stats = getManufacturingStats();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const getOutputsSummary = (outputs) => {
    if (!outputs || outputs.length === 0) return "-";
    if (outputs.length === 1)
      return `${outputs[0].quantityProduced} ${outputs[0].product.name}`;
    return `${outputs.length} productos`;
  };

  const getInputsSummary = (inputs) => {
    if (!inputs || inputs.length === 0) return "-";
    if (inputs.length === 1)
      return `${inputs[0].quantityRequired} ${inputs[0].product.name}`;
    return `${inputs.length} insumos`;
  };

  const columns = [
    {
      field: "orderNumber",
      headerName: "Código",
      flex: 1,
      renderCell: ({ value }) => (
        <MDTypography
          variant="button"
          fontWeight="medium"
          sx={{ fontFamily: "monospace" }}
        >
          {value}
        </MDTypography>
      ),
    },
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      renderCell: ({ value }) => (
        <MDTypography variant="button" color="text">
          {formatDate(value)}
        </MDTypography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ value }) => (
        <MDBadge
          variant="gradient"
          color={getStatusColor(value)}
          badgeContent={getStatusLabel(value)}
          size="xs"
        />
      ),
    },
    {
      field: "outputs",
      headerName: "Productos Generados",
      flex: 1.5,
      renderCell: ({ value }) => (
        <Tooltip title={getOutputsSummary(value)}>
          <MDTypography variant="button" color="text">
            {getOutputsSummary(value)}
          </MDTypography>
        </Tooltip>
      ),
    },
    {
      field: "inputs",
      headerName: "Insumos Consumidos",
      flex: 1.5,
      renderCell: ({ value }) => (
        <Tooltip title={getInputsSummary(value)}>
          <MDTypography variant="button" color="secondary">
            {getInputsSummary(value)}
          </MDTypography>
        </Tooltip>
      ),
    },
    {
      field: "user",
      headerName: "Usuario",
      flex: 1.2,
      valueGetter: (params) => params.row.executedBy || params.row.createdBy,
      renderCell: ({ value }) => (
        <MDTypography variant="button" color="text">
          {value}
        </MDTypography>
      ),
    },
    {
      field: "actions",
      headerName: "Acción",
      flex: 0.8,
      sortable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDButton
          variant="text"
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/manufactura/detalle/${row.id}`);
          }}
        >
          {row.status === "draft" ? "EJECUTAR" : "VER"}
          <Icon sx={{ ml: 1 }}>
            {row.status === "draft" ? "play_circle" : "arrow_forward"}
          </Icon>
        </MDButton>
      ),
    },
  ];

  const filteredOrders = productionOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.outputs.some((o) =>
        o.product.name.toLowerCase().includes(search.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date >= dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Órdenes de Producción
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Gestión de manufactura y producción
            </MDTypography>
          </MDBox>
          <MDButton
            component={Link}
            to="/manufactura/nueva"
            variant="gradient"
            color="info"
          >
            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
            &nbsp;NUEVA PRODUCCIÓN
          </MDButton>
        </MDBox>

        <MDBox mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="success"
                icon="factory"
                title="Producciones del Mes"
                count={stats.productionsThisMonth}
                percentage={{
                  color: "success",
                  amount: "completadas",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="warning"
                icon="play_circle"
                title="En Proceso"
                count={stats.inProgress}
                percentage={{
                  color: "warning",
                  amount: "órdenes activas",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="dark"
                icon="description"
                title="Borradores"
                count={stats.drafts}
                percentage={{
                  color: "secondary",
                  amount: "pendientes de ejecutar",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="info"
                icon="check_circle"
                title="Costo Promedio"
                count={formatCurrency(stats.avgCostPerUnit)}
                percentage={{
                  color: "info",
                  amount: "por unidad producida",
                  label: "",
                }}
              />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox
          mb={3}
          display="flex"
          gap={2}
          alignItems="center"
          flexWrap="wrap"
        >
          <MDBox flex={1} minWidth="250px">
            <MDInput
              placeholder="Buscar por código o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <Icon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  >
                    search
                  </Icon>
                ),
              }}
            />
          </MDBox>
          <MDBox minWidth="160px">
            <MDInput
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              fullWidth
            />
          </MDBox>
          <MDBox minWidth="150px">
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Estado</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
                sx={{ height: "45px" }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="draft">Borrador</MenuItem>
                <MenuItem value="in_progress">En Proceso</MenuItem>
                <MenuItem value="completed">Completada</MenuItem>
                <MenuItem value="cancelled">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
        </MDBox>

        <Card>
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
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              onRowClick={(params) =>
                navigate(`/manufactura/detalle/${params.row.id}`)
              }
              components={{
                NoRowsOverlay: () => (
                  <CustomNoRowsOverlay message="No se encontraron órdenes de producción" />
                ),
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f0f2f5",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                },
              }}
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default Manufacturing;
