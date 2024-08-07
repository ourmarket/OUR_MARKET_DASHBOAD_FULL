/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { dateToLocalDate } from "utils/dateFormat";
import { Box, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuChart3 from "./MenuChart4";
import colors from "assets/theme/base/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
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

const getDataChart = (reports, expenses, selectYear) => {
  const salesForMonth = {};
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const fullReport = reports
    .map((item1) => {
      const matchingItem = expenses.find(
        (item2) => item1.month === item2.month && item1.year === item2.year
      );

      const newItem = { ...item1 };

      if (matchingItem) {
        newItem.totalExpenses = matchingItem.total;
      }

      return newItem;
    })
    .filter((report) => report.year === selectYear);

  for (const report of fullReport) {
    salesForMonth[report.month] = {
      totalCost: report.totalCost,
      totalProfits: report.totalProfits,
      totalSell: report.totalSell,
      totalExpenses: report.totalExpenses || 0,
      year: report.year,
    };
  }
  for (const month of months) {
    if (!salesForMonth.hasOwnProperty(month)) {
      salesForMonth[month] = {
        totalCost: 0,
        totalProfits: 0,
        totalSell: 0,
        totalExpenses: 0,
        year: 0,
      };
    }
  }

  const oneYearSales = months.map((month) => ({
    month,
    ...salesForMonth[month],
  }));

  return oneYearSales;
};

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

function CharBar4({ reports, expenses }) {
  const date = new Date();
  const yearDate = date.getFullYear();
  const reportYears = reports.map((item) => item.year);
  const years = [...new Set(reportYears)];

  const [open, setOpen] = useState(null);
  const [selectYear, setSelectYear] = useState(yearDate);
  const [oneYearData, setOneYearData] = useState(
    getDataChart(reports, expenses, selectYear)
  );

  useEffect(() => {
    setOneYearData(getDataChart(reports, expenses, selectYear));
  }, [selectYear]);

  const data = {
    labels,
    datasets: [
      {
        label: "Ganancia Bruta",
        data: oneYearData.map((item) => item.totalProfits),
        backgroundColor: colors.info.main,
      },
      {
        label: "Ganancia Neta",
        data: oneYearData.map((item) => item.totalProfits - item.totalExpenses),
        backgroundColor: "rgba(85, 230, 18, 0.7)",
      },
      {
        label: "Gastos",
        data: oneYearData.map((item) => item.totalExpenses),
        backgroundColor: "rgba(230, 18, 18, 0.7)",
      },

      {
        label: "Ganancia Neta%",
        data: oneYearData.map(
          (item) => (item.totalProfits * 100) / item.totalCost
        ),
        backgroundColor: "rgba(3, 252, 157, 0.7)",
      },
    ],
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Card sx={{ height: "100%" }}>
        <MDBox padding="1rem">
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

          <MDBox pt={3} pb={1} px={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <MDTypography variant="h6">
                  {`Ganancia del ${selectYear}`}
                </MDTypography>
                <MDTypography
                  component="div"
                  variant="button"
                  color="text"
                  fontWeight="light"
                >
                  Total de ganancia
                </MDTypography>
              </Box>
              <IconButton
                size="large"
                color="inherit"
                onClick={(e) => handleOpenMenu(e)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>

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
      <MenuChart3
        open={open}
        handleCloseMenu={handleCloseMenu}
        years={years}
        setSelectYear={setSelectYear}
      />
    </>
  );
}

export default CharBar4;
