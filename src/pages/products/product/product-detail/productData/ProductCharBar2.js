/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { dateToLocalDate } from "utils/dateFormat";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    datalabels: { color: "transparent" },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  scales: {
    y: {
      grid: {
        drawBorder: false,
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        borderDash: [5, 5],
        color: "rgba(255, 255, 255, .2)",
      },
      ticks: {
        suggestedMin: 0,
        beginAtZero: true,
        padding: 10,
        font: { size: 14, weight: 300, family: "Roboto", style: "normal", lineHeight: 2 },
        color: "#fff",
      },
    },
    x: {
      grid: {
        drawBorder: false,
        display: false,
        drawOnChartArea: false,
        drawTicks: false,
        color: "rgba(255, 255, 255, .2)",
      },
      ticks: {
        display: true,
        color: "#f8f9fa",
        padding: 10,
        font: { size: 14, weight: 300, family: "Roboto", style: "normal", lineHeight: 2 },
      },
    },
  },
};

function ProductCharBar2({ reports }) {
  // 1. Obtener años únicos de los reportes para el selector
  const availableYears = useMemo(() => {
    const years = [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [reports]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  // 2. Procesar datos según el año seleccionado
  const chartData = useMemo(() => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const salesForMonth = {};
    
    // Inicializar meses en 0
    months.forEach(m => salesForMonth[m] = 0);

    // Llenar con datos del año seleccionado
    reports
      .filter((report) => report.year === selectedYear)
      .forEach((report) => {
        salesForMonth[report.month] = report.count;
      });

    return {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      datasets: [
        {
          label: "Cantidad",
          data: months.map((m) => salesForMonth[m]),
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Barras blancas semi-transparentes para resaltar sobre el fondo azul
          borderRadius: 4,
        },
      ],
    };
  }, [reports, selectedYear]);

  return (
     <MDBox border="1px solid #e6e3e3ff" borderRadius="lg" p={2} height="100%">
      <MDBox padding="1rem">
        <MDBox
          variant="gradient"
          bgColor="info" // Cambiado a "info" para que sea azul/cian como el otro gráfico
          borderRadius="lg"
          coloredShadow="info"
          py={2}
          pr={0.5}
          mt={-7}
          height="14rem"
        >
          <Bar options={options} data={chartData} />
        </MDBox>
        <MDBox pt={3} pb={1} px={1}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" textTransform="capitalize">
                Cantidades Vendidas
              </MDTypography>
              <MDTypography component="div" variant="button" color="text" fontWeight="light">
                Análisis por unidades
              </MDTypography>
            </MDBox>
            
            {/* Selector de Año */}
            <MDBox width="6rem">
              
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                size="small"
                fullWidth
                sx={{ height: "2rem" }}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </MDBox>
          </MDBox>
          
          <Divider sx={{ my: 2 }} />
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              Actualizado {dateToLocalDate(new Date())}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default ProductCharBar2;