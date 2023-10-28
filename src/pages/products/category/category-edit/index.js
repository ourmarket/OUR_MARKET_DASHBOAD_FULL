import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from "react-router-dom";
import { useGetCategoryQuery } from "api/categoryApi";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import EditCategoryForm from "components/OUForms/Category/edit-category/EditCategoryForm";

function EditCategory() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCategoryQuery(id);
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
                  Editar categoria
                </MDTypography>
              </MDBox>
              <MDBox>
                {isLoading && <Loading />}
                {isError && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {data && <EditCategoryForm categoryData={data.category} />}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditCategory;
