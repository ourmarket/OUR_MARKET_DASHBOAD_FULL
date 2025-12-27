import { useState, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { Box, Tab, Tabs } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Data & Logic
import { useGetUsersQuery } from "api/userApi";
import Loading from "components/DRLoading";
import TableListUsers from "./TableListUsers";

function ListUsers() {
  const { data: listUsers, isLoading: l1, error: e1 } = useGetUsersQuery();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const isLoading = l1;
  const hasError = e1;

  console.log(listUsers);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ overflow: "visible" }}>
              {/* Header con gradiente integrado */}
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={3}
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox>
                  <MDTypography
                    variant="h6"
                    color="white"
                    textTransform="uppercase"
                  >
                    Gestión de Usuarios
                  </MDTypography>
                  <MDTypography
                    variant="button"
                    color="white"
                    fontWeight="regular"
                    opacity={0.8}
                  >
                    Lista de usuarios registrados en el sistema
                  </MDTypography>
                </MDBox>
              </MDBox>

              {/* BARRA DE ACCIONES (TABS Y FILTROS) */}
              <Box sx={{ mx: 2, mb: 1, p: 2 }}>
                <MDBox display="flex" flexDirection="column" gap={2}>
                  {/* Selector de tipo de usuario (Tabs) */}
                  <MDBox>
                    <Tabs
                      value={tabIndex}
                      onChange={handleTabChange}
                      centered
                      sx={{
                        "& .MuiTabs-indicator": {
                          backgroundColor: ({ palette: { info } }) => info.main,
                        },
                      }}
                    >
                      <Tab
                        label="Empleados"
                        sx={{ minWidth: "50%", fontWeight: "bold" }}
                      />
                      <Tab
                        label="Clientes"
                        sx={{ minWidth: "50%", fontWeight: "bold" }}
                      />
                    </Tabs>
                  </MDBox>
                </MDBox>
              </Box>

              {/* TABLA PRINCIPAL */}
              {isLoading && (
                <MDBox display="flex" justifyContent="center" py={5}>
                  <Loading />
                </MDBox>
              )}

              {hasError && (
                <MDBox mb={2}>
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ color: "white" }}
                  >
                    No se pudo cargar la información. Inténtelo más
                    tarde.
                  </Alert>
                </MDBox>
              )}
              {!isLoading && !hasError && (
                <>
                  {tabIndex === 0 && listUsers && (
                    <MDBox animate={{ opacity: 1 }}>
                      <TableListUsers
                        users={listUsers.data.users.filter(
                          (item) => item.role.type === "employee"
                        )}
                      />
                    </MDBox>
                  )}

                  {tabIndex === 1 && listUsers && (
                    <MDBox animate={{ opacity: 1 }}>
                      <TableListUsers
                        users={listUsers.data.users.filter(
                          (item) => item.role.type === "client"
                        )}
                      />
                    </MDBox>
                  )}
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ListUsers;
