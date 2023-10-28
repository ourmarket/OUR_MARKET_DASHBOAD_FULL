/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TableAllOrders from "components/OUTables/Orders/All/TableAllOrders";
import TableActiveOrders from "components/OUTables/Orders/Active/TableActiveOrders";
import TableUnpaidOrders from "components/OUTables/Orders/Unpaid/TableUnpaidOrders";
import { useSelector } from "react-redux";

function ListOrders() {
  const [page, setPage] = useState(0);
  const { version } = useSelector((store) => store.auth);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Lista de ordenes
              </MDTypography>
            </MDBox>

            <Box
              sx={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "column",
                px: 2,
                my: 2,
              }}
            >
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="Todas las ordenes" />
                {version === "full" && <Tab label="Ordenes Activas" />}
                {version === "dr" && <Tab label="Ordenes Activas" />}

                <Tab label="Ordenes impagas" />
              </Tabs>
            </Box>
            {page === 0 && (
              <Card
                sx={{
                  mx: 2.5,
                }}
              >
                <TableAllOrders />
              </Card>
            )}
            {page === 1 && (
              <Card
                sx={{
                  mx: 2.5,
                }}
              >
                <TableUnpaidOrders />
              </Card>
            )}
            {page === 2 && (
              <Card
                sx={{
                  mx: 2.5,
                }}
              >
                <TableActiveOrders />
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListOrders;
