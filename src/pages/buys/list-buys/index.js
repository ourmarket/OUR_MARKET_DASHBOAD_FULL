import { Alert, Box, Card, Grid, Tab, Tabs } from "@mui/material";
import { useGetBuysQuery } from "api/buyApi";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TableListBuys from "components/OUTables/Buys/All/TableList";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";

const ListBuys = () => {
  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const { data: dataBuys, isLoading: l1, isError: e1 } = useGetBuysQuery();

  console.log(dataBuys);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                Lista de compras
              </MDTypography>
            </MDBox>

            <Box
              sx={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "column",
                px: 0,
                my: 2,
              }}
            >
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="Todas" />
                <Tab label="Pagas" />
                <Tab label="Impagas" />
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

                <Card sx={{ padding: "20px" }}>
                  {dataBuys && <TableListBuys buys={dataBuys.data.buys} />}
                </Card>
              </Box>
            )}
            {page === 1 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}

                <Card sx={{ padding: "20px" }}>
                  {dataBuys && (
                    <TableListBuys
                      buys={dataBuys.data.buys.filter((buy) => buy.paid)}
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
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}

                <Card sx={{ padding: "20px" }}>
                  {dataBuys && (
                    <TableListBuys
                      buys={dataBuys.data.buys.filter((buy) => !buy.paid)}
                    />
                  )}
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ListBuys;
