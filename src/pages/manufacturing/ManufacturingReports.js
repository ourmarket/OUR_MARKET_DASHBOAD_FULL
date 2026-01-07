import { useState } from "react";

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

// Data and Helpers
import {
  productionOrders,
  getManufacturingStats,
  formatCurrency,
} from "./mockData";

// Calculate production by product
const getProductionByProduct = () => {
  const completed = productionOrders.filter((o) => o.status === "completed");
  const byProduct = {};

  completed.forEach((order) => {
    order.outputs.forEach((output) => {
      if (!byProduct[output.productId]) {
        byProduct[output.productId] = {
          name: output.product.name,
          quantity: 0,
          value: 0,
        };
      }
      byProduct[output.productId].quantity += output.quantityProduced;
      byProduct[output.productId].value += output.totalCost;
    });
  });

  return Object.values(byProduct);
};

// Calculate most used inputs
const getMostUsedInputs = () => {
  const completed = productionOrders.filter((o) => o.status === "completed");
  const byInput = {};

  completed.forEach((order) => {
    order.inputs.forEach((input) => {
      if (!byInput[input.productId]) {
        byInput[input.productId] = {
          id: input.productId,
          name: input.product.name,
          quantity: 0,
          cost: 0,
        };
      }
      byInput[input.productId].quantity += input.quantityRequired;
      byInput[input.productId].cost +=
        input.product.unitCost * input.quantityRequired;
    });
  });

  return Object.values(byInput).sort((a, b) => b.cost - a.cost);
};

// Monthly evolution mock data for charts
const monthlyData = [
  {
    month: "Oct",
    producciones: 8,
    costoInsumos: 180000,
    valorProducido: 220000,
  },
  {
    month: "Nov",
    producciones: 12,
    costoInsumos: 250000,
    valorProducido: 310000,
  },
  {
    month: "Dic",
    producciones: 15,
    costoInsumos: 320000,
    valorProducido: 400000,
  },
  {
    month: "Ene",
    producciones: 18,
    costoInsumos: 390000,
    valorProducido: 480000,
  },
];

const COLORS = ["#1A73E8", "#43A047", "#FB8C00", "#E91E63", "#7B1FA2"];

const ManufacturingReports = () => {
  const stats = getManufacturingStats();
  const productionByProduct = getProductionByProduct();
  const mostUsedInputs = getMostUsedInputs();
  const [period, setPeriod] = useState("month");

  const pieData = productionByProduct.map((item) => ({
    name: item.name,
    value: item.quantity,
  }));

  const inputColumns = [
    { field: "name", headerName: "Insumo", flex: 2 },
    {
      field: "quantity",
      headerName: "Cant. Consumida",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cost",
      headerName: "Costo Total",
      flex: 1.2,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <MDTypography variant="button" fontWeight="bold">
          {formatCurrency(value)}
        </MDTypography>
      ),
    },
    {
      field: "percentage",
      headerName: "% del Total",
      flex: 1.5,
      renderCell: ({ row }) => {
        const totalCost = mostUsedInputs.reduce((sum, i) => sum + i.cost, 0);
        const percentage = ((row.cost / totalCost) * 100).toFixed(1);
        return (
          <MDBox width="100%" display="flex" alignItems="center" gap={1}>
            <MDBox width="100%" mr={1}>
              <MDBox
                sx={{
                  width: `${percentage}%`,
                  height: "8px",
                  borderRadius: "4px",
                  bgcolor: "info.main",
                }}
              />
            </MDBox>
            <MDTypography variant="caption" color="text">
              {percentage}%
            </MDTypography>
          </MDBox>
        );
      },
    },
  ];

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
              Análisis y métricas del módulo de manufactura
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
                <MenuItem value="week">Esta Semana</MenuItem>
                <MenuItem value="month">Este Mes</MenuItem>
                <MenuItem value="quarter">Este Trimestre</MenuItem>
                <MenuItem value="year">Este Año</MenuItem>
              </Select>
            </FormControl>
          </MDBox>
        </MDBox>

        {/* KPIs */}
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="info"
                icon="factory"
                title="Producciones del Mes"
                count={stats.productionsThisMonth}
                percentage={{
                  color: "success",
                  amount: "+20%",
                  label: "vs mes anterior",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="error"
                icon="shopping_basket"
                title="Insumos Consumidos"
                count={formatCurrency(stats.totalInputsCost)}
                percentage={{
                  color: "secondary",
                  amount: "período actual",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="success"
                icon="inventory_2"
                title="Valor Producido"
                count={formatCurrency(stats.totalOutputsCost)}
                percentage={{
                  color: "success",
                  amount: "terminados",
                  label: "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <ComplexStatisticsCard
                color="dark"
                icon="api"
                title="Costo Promedio/Unidad"
                count={formatCurrency(stats.avgCostPerUnit)}
                percentage={{
                  color: "secondary",
                  amount: "promedio",
                  label: "",
                }}
              />
            </Grid>
          </Grid>
        </MDBox>

        <Grid container spacing={3}>
          {/* Producción por Producto - Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Producción por Producto
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Cantidades totales producidas
                </MDTypography>
              </MDBox>
              <Divider sx={{ m: 0 }} />
              <MDBox p={3} height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productionByProduct}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis type="number" fontSize={12} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      fontSize={12}
                    />
                    <RechartsTooltip
                      formatter={(value) => [`${value} unidades`, "Cantidad"]}
                    />
                    <Bar
                      dataKey="quantity"
                      fill="#1A73E8"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </MDBox>
            </Card>
          </Grid>

          {/* Distribución de Producción - Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Distribución de Producción
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Participación por producto
                </MDTypography>
              </MDBox>
              <Divider sx={{ m: 0 }} />
              <MDBox p={3} height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </MDBox>
            </Card>
          </Grid>

          {/* Evolución Mensual - Line Chart */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h6" fontWeight="medium">
                  Evolución Mensual
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Comparativa de producciones y valor
                </MDTypography>
              </MDBox>
              <Divider sx={{ m: 0 }} />
              <MDBox p={3} height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis yAxisId="left" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" fontSize={12} />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="producciones"
                      stroke="#1A73E8"
                      strokeWidth={3}
                      name="Producciones"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="valorProducido"
                      stroke="#43A047"
                      strokeWidth={3}
                      name="Valor Producido ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </MDBox>
            </Card>
          </Grid>

          {/* Insumos más utilizados - DataGrid */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center" gap={1}>
                <Icon color="info">analytics</Icon>
                <MDTypography variant="h6">
                  Insumos con Mayor Impacto de Costo
                </MDTypography>
              </MDBox>
              <MDBox p={3} sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={mostUsedInputs}
                  columns={inputColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  disableSelectionOnClick
                  sx={{ border: "none" }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ManufacturingReports;
