/* eslint-disable no-unused-vars */
import { Alert, Box, Card, Divider, Grid } from "@mui/material";
import { useGetCashierSessionQuery } from "api/apiCashierSession";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TableListOrdersWithoutPagination from "components/OUTables/Orders/All-without-pagination/TableList";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dateToLocalDate } from "utils/dateFormat";
import CardSession from "./CardSession";

const SalesDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCashierSessionQuery({
    id,
    orders: "all",
  });

  console.log(data);

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
                  Detalle de sesión
                </MDTypography>
              </MDBox>

              <MDBox>
                {isLoading && <Loading />}
                {isError && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {data && (
                  <Box my={4}>
                    <CardSession
                      orders={data.data.orders}
                      session={data.data.session}
                    />

                    <Card sx={{ padding: "20px", marginTop: "35px" }}>
                      <TableListOrdersWithoutPagination
                        orders={data.data.orders}
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
};

export default SalesDetail;
