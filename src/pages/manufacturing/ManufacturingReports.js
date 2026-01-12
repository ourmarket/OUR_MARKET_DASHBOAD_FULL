import { useState, useMemo } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
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
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";

// Recharts for visualizations
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";

// API
import { useGetManufacturingOrdersQuery } from "api/manufacturingOrderApi";
import { useGetProductsQuery } from "api/productApi";

// Utils
import { formatPrice } from "utils/formaPrice";

const COLORS = ["#1A73E8", "#43A047", "#FB8C00", "#E91E63", "#7B1FA2"];

const ManufacturingReports = () => {
  const [period, setPeriod] = useState("all");
  const [showInputsModal, setShowInputsModal] = useState(false);
  const [showOutputsModal, setShowOutputsModal] = useState(false);

  // API Calls
  const { data: ordersData, isLoading: isLoadingOrders } =
    useGetManufacturingOrdersQuery({ limit: 1000, status: "CLOSED" }); // Fetch closed/executed orders
  // Also fetch EXECUTED if you have a workflow where they stay executed before closing

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const orders = ordersData?.data || [];
  const products = productsData?.products || [];

  // --- Processing Logic ---
  const stats = useMemo(() => {
    if (!orders.length || !products.length)
      return {
        count: 0,
        inputCost: 0,
        outputValue: 0,
        margin: 0,
        marginPercent: 0,
        topInputs: [],
        monthlyData: [],
      };

    let filteredOrders = [...orders];
    const now = new Date();

    // Date Filtering
    if (period !== "all") {
      filteredOrders = filteredOrders.filter((o) => {
        const d = new Date(o.createdAt);
        if (period === "today") {
          return (
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        }
        if (period === "month")
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        if (period === "year") return d.getFullYear() === now.getFullYear();
        if (period === "week") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return d >= oneWeekAgo;
        }
        return true;
      });
    }

    // Calculations
    let totalInputCost = 0;
    let totalOutputValue = 0;
    const inputsMap = {};
    const outputsMap = {};
    const monthlyStats = {};
    const productsValueMap = {};

    filteredOrders.forEach((order) => {
      // 1. Inputs Cost (Real Historical)
      totalInputCost += order.totalInputCost || 0;

      // 2. Output Value (Estimated at Current Prices)
      let orderOutputValue = 0;
      order.outputs.forEach((out) => {
        const prod = products.find(
          (p) => p._id === out.product?._id || p._id === out.product
        );
        const currentPrice = prod?.price || 0;
        const val = currentPrice * out.quantity;
        orderOutputValue += val;

        // Pie Chart Aggregation (Value)
        const pId = prod?._id || "unknown";
        const pName = prod?.name || "Desconocido";
        if (!productsValueMap[pId]) {
          productsValueMap[pId] = { name: pName, value: 0 };
        }
        productsValueMap[pId].value += val;

        // Output Map Aggregation (Quantity)
        if (!outputsMap[pId]) {
          outputsMap[pId] = { id: pId, name: pName, quantity: 0 };
        }
        outputsMap[pId].quantity += out.quantity;
      });
      totalOutputValue += orderOutputValue;

      // 3. Top Inputs Aggregation
      order.inputs.forEach((inItem) => {
        const pid = inItem.product?._id || inItem.product;
        const pname = inItem.product?.name || "Desconocido";
        if (!inputsMap[pid]) {
          inputsMap[pid] = { id: pid, name: pname, quantity: 0, cost: 0 };
        }
        inputsMap[pid].quantity += inItem.quantity;
        inputsMap[pid].cost += (inItem.unitCost || 0) * inItem.quantity; // Historical cost
      });

      // 4. Monthly Evolution
      const date = new Date(order.createdAt);
      let timeLabel = date.toLocaleString("es-ES", { month: "short" });

      if (period === "today") {
        timeLabel = "Hoy";
      }

      if (!monthlyStats[timeLabel]) {
        monthlyStats[timeLabel] = {
          month: timeLabel,
          ordenes: 0,
          costo: 0,
          venta: 0,
        };
      }
      monthlyStats[timeLabel].ordenes += 1;
      monthlyStats[timeLabel].costo += order.totalInputCost || 0;
      monthlyStats[timeLabel].venta += orderOutputValue;
    });

    const margin = totalOutputValue - totalInputCost;
    const marginPercent =
      totalOutputValue > 0 ? (margin / totalOutputValue) * 100 : 0;

    const topInputs = Object.values(inputsMap)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);

    // Process Pie Data
    let pieDataRaw = Object.values(productsValueMap).sort(
      (a, b) => b.value - a.value
    );
    const topProducts = pieDataRaw.slice(0, 5);
    const otherProducts = pieDataRaw.slice(5);
    if (otherProducts.length > 0) {
      const otherValue = otherProducts.reduce(
        (sum, item) => sum + item.value,
        0
      );
      topProducts.push({ name: "Otros", value: otherValue });
    }

    // Convert monthlyStats object to array
    // Note: iterating keys might not preserve order. Ideally sort by date.
    // Quick fix: array map
    const monthlyData = Object.values(monthlyStats);

    const allInputs = Object.values(inputsMap).sort(
      (a, b) => b.quantity - a.quantity
    );
    const allOutputs = Object.values(outputsMap).sort(
      (a, b) => b.quantity - a.quantity
    );

    return {
      count: filteredOrders.length,
      inputCost: totalInputCost,
      outputValue: totalOutputValue,
      margin,
      marginPercent,
      topInputs,
      monthlyData,
      pieData: topProducts,
      allInputs,
      allOutputs,
    };
  }, [orders, products, period]);

  const inputColumns = [
    { field: "name", headerName: "Insumo", flex: 2 },
    {
      field: "quantity",
      headerName: "Consumo Total",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <MDTypography variant="button" color="text">
          {value.toFixed(2)} u
        </MDTypography>
      ),
    },
    {
      field: "cost",
      headerName: "Costo Acumulado",
      flex: 1.2,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <MDTypography variant="button" fontWeight="bold">
          {formatPrice(value)}
        </MDTypography>
      ),
    },
  ];

  const summaryColumns = [
    { field: "name", headerName: "Producto / Insumo", flex: 2 },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <MDTypography variant="button" color="text" fontWeight="bold">
          {value?.toFixed(2)} u
        </MDTypography>
      ),
    },
  ];

  if (isLoadingOrders || isLoadingProducts) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <LinearProgress color="info" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Header */}
        <MDBox
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Reportes de Producción
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Análisis financiero y operativo{" "}
            </MDTypography>
          </MDBox>
          <MDBox minWidth="180px">
            <FormControl fullWidth size="small">
              <InputLabel id="period-select-label">Período</InputLabel>
              <Select
                labelId="period-select-label"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                label="Período"
                sx={{ height: "45px" }}
              >
                <MenuItem value="today">Hoy</MenuItem>
                <MenuItem value="week">Esta Semana</MenuItem>
                <MenuItem value="month">Este Mes</MenuItem>
                <MenuItem value="year">Este Año</MenuItem>
                <MenuItem value="all">Todo el Historial</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
        </MDBox>

        {/* KPIs */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="dark"
                icon="factory"
                title="Producciones Ejecutadas"
                count={stats.count}
                percentage={{
                  color: "secondary",
                  amount: "",
                  label: "en el período",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="error"
                icon="money_off"
                title="Costo Real Insumos"
                count={formatPrice(stats.inputCost)}
                percentage={{
                  color: "secondary",
                  amount: "histórico",
                  label: "costo material",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="info"
                icon="point_of_sale"
                title="Valor Venta Est."
                count={formatPrice(stats.outputValue)}
                percentage={{
                  color: "success",
                  amount: "proyectado",
                  label: "a precios actuales",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color={stats.margin >= 0 ? "success" : "warning"}
                icon="trending_up"
                title="Margen Bruto Est."
                count={formatPrice(stats.margin)}
                percentage={{
                  color: stats.margin >= 0 ? "success" : "error",
                  amount: `${stats.marginPercent.toFixed(1)}%`,
                  label: "rentabilidad",
                }}
              />
            </Grid>
          </Grid>
        </MDBox>

        {/* Operational Summary (Entradas y Salidas) */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <MDBox
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <Icon color="secondary">arrow_downward</Icon>
                    <MDBox>
                      <MDTypography variant="h6">
                        Entradas (Insumos)
                      </MDTypography>
                      <MDTypography variant="button" color="text">
                        Lo que se procesó
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <IconButton
                    onClick={() => setShowInputsModal(true)}
                    size="small"
                    title="Ver lista completa"
                  >
                    <Icon>visibility</Icon>
                  </IconButton>
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox p={2} sx={{ height: 300, width: "100%" }}>
                  <DataGrid
                    rows={
                      period === "today"
                        ? stats.allInputs
                        : stats.allInputs.slice(0, 5)
                    }
                    columns={summaryColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    hideFooter={period !== "today"}
                    disableSelectionOnClick
                    sx={{ border: "none" }}
                    components={{
                      NoRowsOverlay: () => (
                        <MDBox p={2} textAlign="center">
                          Sin movimientos
                        </MDBox>
                      ),
                    }}
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <MDBox
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <Icon color="success">arrow_upward</Icon>
                    <MDBox>
                      <MDTypography variant="h6">
                        Salidas (Productos)
                      </MDTypography>
                      <MDTypography variant="button" color="text">
                        Lo que se obtuvo
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <IconButton
                    onClick={() => setShowOutputsModal(true)}
                    size="small"
                    title="Ver lista completa"
                  >
                    <Icon>visibility</Icon>
                  </IconButton>
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox p={2} sx={{ height: 300, width: "100%" }}>
                  <DataGrid
                    rows={
                      period === "today"
                        ? stats.allOutputs
                        : stats.allOutputs.slice(0, 5)
                    }
                    columns={summaryColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    hideFooter={period !== "today"}
                    disableSelectionOnClick
                    sx={{ border: "none" }}
                    components={{
                      NoRowsOverlay: () => (
                        <MDBox p={2} textAlign="center">
                          Sin movimientos
                        </MDBox>
                      ),
                    }}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        <Grid container spacing={3}>
          {/* Evolución Financiera - Chart */}
          <Grid item xs={12}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Evolución Financiera
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Comparativa Costo vs Venta Potencial
                </MDTypography>
              </MDBox>
              <Divider sx={{ m: 0 }} />
              <MDBox p={3} height="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <RechartsTooltip formatter={(val) => formatPrice(val)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="costo"
                      stroke="#F44335"
                      strokeWidth={3}
                      name="Costo Insumos"
                    />
                    <Line
                      type="monotone"
                      dataKey="venta"
                      stroke="#1A73E8"
                      strokeWidth={3}
                      name="Venta Estimada"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </MDBox>
            </Card>
          </Grid>

          {/* Insumos Top - DataGrid */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2} display="flex" alignItems="center" gap={1}>
                <Icon color="error">local_fire_department</Icon>
                <MDTypography variant="h6">Insumos Más Costosos</MDTypography>
              </MDBox>
              <Divider sx={{ m: 0 }} />
              <MDBox p={2} sx={{ height: 350, width: "100%" }}>
                <DataGrid
                  rows={stats.topInputs}
                  columns={inputColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  hideFooter
                  components={{
                    NoRowsOverlay: () => (
                      <MDBox p={2} textAlign="center">
                        Sin datos
                      </MDBox>
                    ),
                  }}
                  disableSelectionOnClick
                  sx={{ border: "none" }}
                />
              </MDBox>
            </Card>
          </Grid>

          {/* Distribución de Valor - Pie Chart (NEW) */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Valor Generado por Producto
                </MDTypography>
                <MDTypography variant="button" color="text">
                  ¿Qué productos aportan más venta estimada?
                </MDTypography>
              </MDBox>
              <Divider sx={{ m: 0 }} />
              <MDBox p={3} height="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {stats.pieData?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val) => formatPrice(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* MODALS FOR FULL DETAILS */}
      <Dialog
        open={showInputsModal}
        onClose={() => setShowInputsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle Completo de Entradas (Insumos)</DialogTitle>
        <DialogContent dividers>
          <MDBox height="500px">
            <DataGrid
              rows={stats.allInputs}
              columns={summaryColumns}
              pageSize={50}
              rowsPerPageOptions={[10, 25, 50, 100]}
              disableSelectionOnClick
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInputsModal(false)} color="dark">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showOutputsModal}
        onClose={() => setShowOutputsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle Completo de Salidas (Productos)</DialogTitle>
        <DialogContent dividers>
          <MDBox height="500px">
            <DataGrid
              rows={stats.allOutputs}
              columns={summaryColumns}
              pageSize={50}
              rowsPerPageOptions={[10, 25, 50, 100]}
              disableSelectionOnClick
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOutputsModal(false)} color="dark">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManufacturingReports;
