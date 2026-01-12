import { useState, useMemo } from "react";
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
import LinearProgress from "@mui/material/LinearProgress";

// API
import { useGetManufacturingOrdersQuery } from "api/manufacturingOrderApi";

// Utils
import { formatPrice } from "utils/formaPrice";
import CustomNoRowsOverlay from "components/OUTables/CustomNoRowsOverlay";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getStatusLabel = (status) => {
  switch (status) {
    case "DRAFT":
      return "Borrador";
    case "EXECUTED":
      return "Ejecutada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "EXECUTED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "info";
  }
};

const Manufacturing = () => {
  const navigate = useNavigate();

  // State for filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // API Query
  const { data, isLoading } = useGetManufacturingOrdersQuery({
    limit: 100, // Fetching 100 for now to get a good list for the stats
    page: 1,
    // Status filtering could be done on backend, but we do client side for the generic 'search'
    // If we wanted to use backend filter: status: statusFilter !== 'all' ? statusFilter : undefined
  });

  const orders = data?.data || [];

  // Client-side filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.code.toLowerCase().includes(search.toLowerCase()) ||
        order.outputs.some((o) =>
          o.product?.name?.toLowerCase().includes(search.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const orderDate = new Date(order.productionDate || order.createdAt)
        .toISOString()
        .split("T")[0];
      const matchesDate = !dateFilter || orderDate >= dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, statusFilter, dateFilter]);

  // Statistics Calculation (based on loaded data)
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const executed = filteredOrders.filter(
      (o) => o.status === "EXECUTED"
    ).length;
    const drafts = filteredOrders.filter((o) => o.status === "DRAFT").length;
    const inProgress = 0; // Backend doesn't have 'in_progress', immediate execution

    // Avg Cost Per Unit (Total Output Cost / Total Output Quantity)
    // Only for executed orders
    let totalCost = 0;
    let totalUnits = 0;
    filteredOrders.forEach((o) => {
      if (o.status === "EXECUTED") {
        totalCost += o.totalOutputCost || 0;
        totalUnits += o.outputs.reduce(
          (acc, out) => acc + (out.quantity || 0),
          0
        );
      }
    });

    const avgCost = totalUnits > 0 ? totalCost / totalUnits : 0;

    return {
      productions: total, // Using filtered count for now
      executed: executed,
      drafts: drafts,
      inProgress: inProgress,
      avgCostPerUnit: avgCost,
    };
  }, [filteredOrders]);

  const getOutputsSummary = (outputs) => {
    if (!outputs || outputs.length === 0) return "-";
    if (outputs.length === 1)
      return `${outputs[0].quantity} ${outputs[0].product?.name || "Unknown"}`;
    return `${outputs.length} productos`;
  };

  const getInputsSummary = (inputs) => {
    if (!inputs || inputs.length === 0) return "-";
    if (inputs.length === 1)
      return `${inputs[0].quantity} ${inputs[0].product?.name || "Unknown"}`;
    return `${inputs.length} insumos`;
  };

  const columns = [
    {
      field: "code", // Changed from orderNumber
      headerName: "Código",
      flex: 1,
      minWidth: 120,
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
      field: "productionDate", // Changed from date
      headerName: "Fecha",
      flex: 1,
      renderCell: ({ row }) => (
        <MDTypography variant="button" color="text">
          {formatDate(row.productionDate || row.createdAt)}
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
      headerName: "Productos",
      flex: 1.5,
      renderCell: ({ value }) => (
        <Tooltip title={getOutputsSummary(value)}>
          <MDBox>
            <MDTypography variant="button" color="text" display="block">
              {getOutputsSummary(value)}
            </MDTypography>
          </MDBox>
        </Tooltip>
      ),
    },
    {
      field: "inputs",
      headerName: "Insumos",
      flex: 1.5,
      renderCell: ({ value }) => (
        <Tooltip title={getInputsSummary(value)}>
          <MDBox>
            <MDTypography variant="button" color="secondary" display="block">
              {getInputsSummary(value)}
            </MDTypography>
          </MDBox>
        </Tooltip>
      ),
    },
    {
      field: "createdBy", // Changed from user
      headerName: "Usuario",
      flex: 1.2,
      renderCell: ({ value }) => (
        <MDTypography variant="button" color="text">
          {value ? `${value.name} ${value.lastName}` : "Sistema"}
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
            if (row.status === "DRAFT") {
              // For DRAFT, maybe we want to go to Edit/Execute page?
              // For now let's assume 'NewProduction' can load an existing draft or detail view has an Execute button.
              // The 'detalle' route probably needs to handle execution.
              navigate(`/manufactura/detalle/${row._id}`);
            } else {
              navigate(`/manufactura/detalle/${row._id}`);
            }
          }}
        >
          {row.status === "DRAFT" ? "GESTIONAR" : "VER"}
          <Icon sx={{ ml: 1 }}>
            {row.status === "DRAFT" ? "settings" : "visibility"}
          </Icon>
        </MDButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {isLoading && <LinearProgress color="info" sx={{ mb: 2 }} />}

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

        {/* Statistics Cards */}
        <MDBox mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="dark"
                icon="factory"
                title="Total Registros"
                count={stats.productions}
                percentage={{
                  color: "success",
                  amount: "órdenes listadas",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="success"
                icon="check_circle"
                title="Ejecutadas"
                count={stats.executed}
                percentage={{
                  color: "success",
                  amount: "finalizadas",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="warning"
                icon="edit_note"
                title="Borradores"
                count={stats.drafts}
                percentage={{
                  color: "secondary",
                  amount: "pendientes",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="info"
                icon="attach_money"
                title="Costo Unit. Prom."
                count={formatPrice(stats.avgCostPerUnit)}
                percentage={{
                  color: "info",
                  amount: "sobre ejecutadas",
                  label: "",
                }}
              />
            </Grid>
          </Grid>
        </MDBox>
        <Card sx={{ mb: 2 }}>
          <MDBox
            display="flex"
            gap={2}
            alignItems="center"
            flexWrap="wrap"
            p={2}
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
                  <MenuItem value="DRAFT">Borrador</MenuItem>
                  <MenuItem value="EXECUTED">Ejecutada</MenuItem>
                  <MenuItem value="CANCELLED">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
          </MDBox>
        </Card>

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
              getRowId={(row) => row._id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              onRowClick={(params) =>
                navigate(`/manufactura/detalle/${params.row._id}`)
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
