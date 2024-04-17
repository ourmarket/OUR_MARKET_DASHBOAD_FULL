/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Divider, Icon } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { dateToLocalDate } from "utils/dateFormat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "transparent",
    },
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
        suggestedMax: 500,
        beginAtZero: true,
        padding: 10,
        font: {
          size: 14,
          weight: 300,
          family: "Roboto",
          style: "normal",
          lineHeight: 2,
        },
        color: "#fff",
      },
    },
    x: {
      grid: {
        drawBorder: false,
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        borderDash: [5, 5],
        color: "rgba(255, 255, 255, .2)",
      },
      ticks: {
        display: true,
        color: "#f8f9fa",
        padding: 10,
        font: {
          size: 14,
          weight: 300,
          family: "Roboto",
          style: "normal",
          lineHeight: 2,
        },
      },
    },
  },
};

export function ChartExpensesTotal({ allData }) {
  // Crear un objeto para almacenar las ventas por mes
  const expensesForMonth = {};
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // Llenar el objeto con las ventas existentes
  for (const report of allData) {
    expensesForMonth[report.month] = {
      total: report.total || 0,
    };
  }
  for (const month of months) {
    if (!expensesForMonth.hasOwnProperty(month)) {
      expensesForMonth[month] = {
        total: 0,
        year: 0,
      };
    }
  }

  const oneYearExpenses = months.map((month) => ({
    month,
    ...expensesForMonth[month],
  }));

  const totalExpenses = oneYearExpenses.map((item) => item.total);

  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Total",
        data: totalExpenses,
        backgroundColor: "rgba(233, 17, 116, 0.8)",
      },
    ],
  };
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox padding="1rem">
        {useMemo(
          () => (
            <MDBox
              variant="gradient"
              borderRadius="lg"
              coloredShadow="dark"
              py={2}
              pr={0.5}
              mt={-5}
              sx={{
                background: "linear-gradient(0deg, #464b55 0%, #73809b 100%)",
              }}
            >
              <Bar options={options} data={data} />
            </MDBox>
          ),
          []
        )}
        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            Gastos Mensuales
          </MDTypography>
          <MDTypography
            component="div"
            variant="button"
            color="text"
            fontWeight="light"
          >
            Total de gastos por mes.
          </MDTypography>
          <Divider />
          <MDBox display="flex" alignItems="center">
            <MDTypography
              variant="button"
              color="text"
              lineHeight={1}
              sx={{ mt: 0.15, mr: 0.5 }}
            >
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              Actualizado {dateToLocalDate(new Date())}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}
