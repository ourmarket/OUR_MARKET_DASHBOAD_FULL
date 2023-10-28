import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useGetUsersQuery } from "api/userApi";
import Loading from "components/DRLoading";
import { Alert, Box, Tab, Tabs } from "@mui/material";
import TableListUsers from "./TableListUsers";
import { useState } from "react";

function ListUsers() {
  const { data: listUsers, isLoading, error } = useGetUsersQuery();

  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  console.log(listUsers);

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
                Lista de usuarios
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
                <Tab label="Empleados" />
                <Tab label="Clientes" />
              </Tabs>
            </Box>
            {page === 0 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Card>
                  {isLoading && <Loading />}
                  {error && <Alert severity="error">{error.error}</Alert>}
                  {listUsers && (
                    <TableListUsers
                      users={listUsers.data.users.filter(
                        (user) => user.role.type === "employee"
                      )}
                    />
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
                <Card>
                  {isLoading && <Loading />}
                  {error && <Alert severity="error">{error.error}</Alert>}
                  {listUsers && (
                    <TableListUsers
                      users={listUsers.data.users.filter(
                        (user) => user.role.type === "client"
                      )}
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
}

export default ListUsers;
