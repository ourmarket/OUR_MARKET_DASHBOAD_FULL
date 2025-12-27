import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SupplierCreate from "../../../components/OUForms/Suppliers/add-supplier/SupplierCreate";

function CreateNewSupplier() {
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
                    Gestión de Proveedores
                  </MDTypography>
                  <MDTypography
                    variant="button"
                    color="white"
                    fontWeight="regular"
                    opacity={0.8}
                  >
                    Crear Proveedor
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox>
                <SupplierCreate />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default CreateNewSupplier;
