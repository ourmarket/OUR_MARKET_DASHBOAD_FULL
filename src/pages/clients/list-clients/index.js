/* eslint-disable no-unused-vars */
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Box, Tab, Tabs } from "@mui/material";
import { useGetClientsQuery } from "api/clientsApi";
import {
  useGetReportTotalClientBuyQuery,
  useGetReportTotalClientDebtQuery,
} from "api/reportApi";
import { useGetConfigQuery } from "api/configApi";
import TotalClientsCards from "./TotalClientsCards";
import TableListClients from "components/OUTables/Clients/All/TableListClient";
import Config from "./Config";
import TableListClientsOrder from "components/OUTables/Clients/OrderByProfits/TableListClientOrder";
import TableDebtor from "components/OUTables/Clients/Debtor/TableDebtor";

function ListClients() {
  const {
    data: dataClients,
    isLoading: l1,
    isError: e1,
  } = useGetClientsQuery();
  const {
    data: dataClientsBuy,
    isLoading: l2,
    isError: e2,
  } = useGetReportTotalClientBuyQuery();

  const { data: dataConfig, isLoading: l3, isError: e3 } = useGetConfigQuery();

  const {
    data: dataClientsDebs,
    isLoading: l4,
    isError: e4,
  } = useGetReportTotalClientDebtQuery();
  console.log(dataClientsDebs);
  console.log(dataClientsBuy);

  const [page, setPage] = useState(0);

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
                Clientes
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
                <Tab label="Lista de clientes" />
                <Tab label="Venta por cliente" />
                <Tab label="Clientes deudores" />
                <Tab label="Clientes inactivos" />
                <Tab label="Configuración" />
              </Tabs>
            </Box>
            {page === 0 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {dataClients && (
                  <TotalClientsCards clients={dataClients.data.clients} />
                )}
                <Card sx={{ margin: "0 20px" }}>
                  {dataClients && (
                    <TableListClients clients={dataClients.data.clients} />
                  )}
                </Card>
              </Box>
            )}
            {page === 1 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                {l2 && <Loading />}
                {e2 && <Alert severity="error">Ha ocurrido un error</Alert>}

                <Card sx={{ margin: "0 20px" }}>
                  {dataClientsBuy && (
                    <TableListClientsOrder
                      clients={dataClientsBuy.data.report
                        .filter(
                          (client) =>
                            client.name !== "consumidor " &&
                            client.name !== "Caleb"
                        )
                        .sort((a, b) => b.totalProfits - a.totalProfits)}
                    />
                  )}
                </Card>
              </Box>
            )}
            {page === 2 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                {l4 && <Loading />}
                {e4 && <Alert severity="error">Ha ocurrido un error</Alert>}

                <Card sx={{ margin: "0 20px" }}>
                  {dataClientsDebs && (
                    <TableDebtor clients={dataClientsDebs.data.report} />
                  )}
                </Card>
              </Box>
            )}

            {page === 3 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Card sx={{ margin: "0 20px" }}>
                  {l2 && <Loading />}
                  {e2 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataClientsBuy && (
                    <TableListClientsOrder
                      clients={dataClientsBuy.data.report
                        .filter(
                          (client) =>
                            client.name !== "consumidor " &&
                            client.name !== "Caleb" &&
                            !client.active
                        )
                        .sort((a, b) => b.totalProfits - a.totalProfits)}
                    />
                  )}
                </Card>
              </Box>
            )}
            {page === 4 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Card sx={{ margin: "0 20px" }}>
                  {l3 && <Loading />}
                  {e3 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataConfig && <Config config={dataConfig.config} />}
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListClients;
