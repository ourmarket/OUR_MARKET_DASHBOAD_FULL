/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import { useGetClientTypesQuery } from "api/clientsTypeApi";
import { useGetClientCategoriesQuery } from "api/clientsCategoryApi";
import { useGetUsersQuery } from "api/userApi";
import { useParams } from "react-router-dom";
import { useGetClientQuery } from "api/clientsApi";
import ClientEdit from "../../../components/OUForms/Clients/edit-client/ClientEdit";

function EditClient() {
  const { id } = useParams();
  const { data: types, isLoading: l1, isError: e1 } = useGetClientTypesQuery();
  const {
    data: categories,
    isLoading: l2,
    isError: e2,
  } = useGetClientCategoriesQuery();
  const { data: users, isLoading: l3, isError: e3 } = useGetUsersQuery();
  const { data: client, isLoading: l4, isError: e4 } = useGetClientQuery(id);

  console.log(client);
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
                <MDTypography variant="h6" color="white">
                  Editar cliente
                </MDTypography>
              </MDBox>
              <MDBox>
                {(l1 || l2 || l3 || l4) && <Loading />}
                {(e1 || e2 || e3 || e4) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {types && categories && users && client && (
                  <ClientEdit
                    types={types.data.clientTypes}
                    categories={categories.data.clientCategories}
                    users={users.data.users}
                    client={client.data.client}
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

export default EditClient;
