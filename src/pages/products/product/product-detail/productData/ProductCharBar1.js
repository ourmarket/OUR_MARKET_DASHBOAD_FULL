/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { dateToLocalDate } from "utils/dateFormat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// CONFIGURACIÓN DE ESTILOS PARA FONDO OSCURO
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    // Desactivamos datalabels si tienes el plugin instalado para evitar los números amontonados
    datalabels: { display: false },
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
        color: "rgba(255, 255, 255, .2)", // Líneas de guía claras
      },
      ticks: {
        suggestedMin: 0,
        beginAtZero: true,
        padding: 10,
        font: { size: 12, family: "Roboto", style: "normal" },
        color: "#fff", // Texto blanco
      },
    },
    x: {
      grid: {
        display: false, // Limpiamos el ruido vertical
      },
      ticks: {
        display: true,
        color: "#f8f9fa", // Texto blanco
        padding: 10,
        font: { size: 12, family: "Roboto" },
      },
    },
  },
};

const labels = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function ProductCharBar1({ reports }) {
  const availableYears = useMemo(() => {
    const years = [...new Set(reports.map((r) => r.year))].sort(
      (a, b) => b - a
    );
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [reports]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  const data = useMemo(() => {
    const salesForMonth = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: i + 1,
        total: 0,
        totalProfits: 0,
      }));

    reports
      .filter((r) => r.year === selectedYear)
      .forEach((r) => {
        const index = r.month - 1;
        if (salesForMonth[index]) {
          salesForMonth[index].total = r.total;
          salesForMonth[index].totalProfits = r.totalProfits;
        }
      });

    return {
      labels,
      datasets: [
        {
          label: "Ventas",
          data: salesForMonth.map((d) => d.total),
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Barras blancas semi-transparentes
          borderRadius: 5,
          barPercentage: 0.5,
        },
        {
          label: "Ganancia",
          data: salesForMonth.map((d) => d.totalProfits),
          backgroundColor: "rgba(3, 252, 157, 0.6)", // Verde neón suave
          borderRadius: 5,
          barPercentage: 0.5,
        },
      ],
    };
  }, [reports, selectedYear]);

  return (
    <MDBox border="1px solid #e6e3e3ff" borderRadius="lg" p={2} height="100%">
      <MDBox padding="1rem">
        <MDBox
          variant="gradient"
          bgColor="info" // Usa el color del tema que es azul oscuro/brillante
          borderRadius="lg"
          coloredShadow="info"
          py={2}
          pr={0.5}
          mt={-7}
          height="14rem"
        >
          <Bar options={chartOptions} data={data} />
        </MDBox>

        <MDBox pt={3} pb={1} px={1}>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDBox>
              <MDTypography variant="h6" textTransform="capitalize">
                Desempeño Mensual
              </MDTypography>
              <MDTypography
                component="div"
                variant="button"
                color="text"
                fontWeight="light"
              >
                Ventas vs Ganancias
              </MDTypography>
            </MDBox>

            <TextField
              select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              variant="standard"
              sx={{ width: "80px" }}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </MDBox>

          <Divider sx={{ my: 2 }} />

          <MDBox display="flex" alignItems="center">
            <Icon sx={{ color: "text.main", mr: 0.5, fontSize: "small" }}>
              schedule
            </Icon>
            <MDTypography variant="button" color="text" fontWeight="light">
              Actualizado el {dateToLocalDate(new Date())}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default ProductCharBar1;
