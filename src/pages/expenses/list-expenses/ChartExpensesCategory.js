/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Divider, Icon } from "@mui/material";
import colors from "assets/theme/base/colors";
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
import { firstLetterCapitalized } from "utils/firstLetterCapitalized";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "transparent",
    },
  },
  /*  interaction: {
    intersect: false,
    mode: "index",
  }, */
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

export function ChartExpenses({ allData, byMonthData }) {
  const labels = allData.map((data) => data.category);

  const allExpenses = allData.map((data) => data.total);

  const data = {
    labels: firstLetterCapitalized(labels),
    datasets: [
      {
        label: "Total",
        data: allExpenses,
        backgroundColor: colors.info.main,
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
            Gastos
          </MDTypography>
          <MDTypography
            component="div"
            variant="button"
            color="text"
            fontWeight="light"
          >
            Total de gastos por categoria.
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
/* return <Bar options={options} data={data} />; */
