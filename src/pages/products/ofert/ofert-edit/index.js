import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useGetProductsQuery } from "api/productApi";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import { useGetOfertQuery } from "api/ofertApi";
import { useParams } from "react-router-dom";
import EditOfertForm from "components/OUForms/Ofert/edit-ofert/EditOfert";

function EditOfert() {
  const { id } = useParams();
  const { data: listProducts, isLoading, error } = useGetProductsQuery();
  const {
    data: ofertById,
    isLoading: isLoadingProduct,
    error: errorProduct,
  } = useGetOfertQuery(id);

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
                  Editar oferta de producto
                </MDTypography>
              </MDBox>
              <MDBox>
                {(isLoading || isLoadingProduct) && <Loading />}
                {(error || errorProduct) && (
                  <Alert severity="error">{error.error}</Alert>
                )}
                {listProducts && ofertById && (
                  <EditOfertForm
                    listProducts={listProducts}
                    ofertById={ofertById}
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

export default EditOfert;
