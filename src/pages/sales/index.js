import { Alert, Box, Card, Grid, Tab, Tabs } from "@mui/material";
import { useGetCashierSessionsQuery } from "api/apiCashierSession";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SessionCashierList from "components/OUTables/Sales/all/SessionCashierList";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";

const Sales = () => {
  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const {
    data: sessionsData,
    isLoading: l1,
    isError: e1,
  } = useGetCashierSessionsQuery();

  console.log(sessionsData);

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
                Ventas
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
                <Tab label="Sesiones caja" />
                <Tab label="Sesiones abiertas" />
                <Tab label="Sesiones cerradas" />
              </Tabs>
            </Box>
            {page === 0 && (
              <>
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {sessionsData && (
                  <Card>
                    <SessionCashierList sessions={sessionsData.data.sessions} />
                  </Card>
                )}
              </>
            )}
            {page === 1 && (
              <>
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {sessionsData && (
                  <Card>
                    <SessionCashierList
                      sessions={sessionsData.data.sessions.filter(
                        (session) => !session.finishDate
                      )}
                    />
                  </Card>
                )}
              </>
            )}
            {page === 2 && (
              <>
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {sessionsData && (
                  <Card>
                    <SessionCashierList
                      sessions={sessionsData.data.sessions.filter(
                        (session) => session.finishDate
                      )}
                    />
                  </Card>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Sales;
