import { Alert, Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useGetRolesQuery } from "api/roleApi";
import { useGetUserQuery } from "api/userApi";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from "react-router-dom";
import UserEdit from "./UserEdit";

function EditUser() {
  const { id } = useParams();
  const { data: listRoles, isLoading: l1, isError: e1 } = useGetRolesQuery();
  const { data: user, isLoading: l2, isError: e2 } = useGetUserQuery(id);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                    Edición de Usuario
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox>
                {(l1 || l2) && <Loading />}
                {(e1 || e2) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {listRoles && user && (
                  <UserEdit
                    listRoles={listRoles.data.roles}
                    user={user.data.user}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditUser;
