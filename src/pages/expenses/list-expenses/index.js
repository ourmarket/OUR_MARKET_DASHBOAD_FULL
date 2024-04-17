/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Box } from "@mui/material";
import { useGetAllExpensesQuery } from "api/expensesApi";
import TableListExpenses from "./Table";
import { ChartExpenses } from "./ChartExpensesCategory";
import {
  useGetReportTotalExpensesByMonthQuery,
  useGetTotalCategoryExpensesReportQuery,
} from "api/reportApi";
import { ChartExpensesTotal } from "./ChartExpensesTotal";

function ListExpenses() {
  const {
    data: dataAllExpenses,
    isLoading: l1,
    isError: e1,
  } = useGetAllExpensesQuery();
  const {
    data: dataAllExpensesByCategory,
    isLoading: l2,
    isError: e2,
  } = useGetTotalCategoryExpensesReportQuery();
  const {
    data: dataMonth,
    isLoading: l3,
    isError: e3,
  } = useGetReportTotalExpensesByMonthQuery();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box>
              <MDBox
                mx={0}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Lista de gastos
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {(l1 || l2 || l3) && <Loading />}
                {(e1 || e2 || e3) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {dataAllExpenses && dataAllExpensesByCategory && dataMonth && (
                  <Box>
                    <MDBox mt={4.5}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={6}>
                          <MDBox mb={3}>
                            <ChartExpenses
                              allData={dataAllExpensesByCategory.data.report}
                            />
                          </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <MDBox mb={3}>
                            <ChartExpensesTotal
                              allData={dataMonth.data.report}
                            />
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <Card sx={{ padding: "10px" }}>
                      <TableListExpenses
                        expenses={dataAllExpenses.data.expenses}
                      />
                    </Card>
                  </Box>
                )}
              </MDBox>
            </Box>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListExpenses;
