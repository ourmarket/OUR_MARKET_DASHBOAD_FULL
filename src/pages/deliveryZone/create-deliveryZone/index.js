import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import AddZones from "components/OUForms/Zone/add-zone/AddZone";

function CreateNewDeliveryZone() {
  const { data, isLoading, isError } = useGetDeliveryZonesQuery();

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
                  Nueva zona
                </MDTypography>
              </MDBox>

              <MDBox>
                {isLoading && <Loading />}
                {isError && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {data && <AddZones zones={data.data.deliveryZones} />}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default CreateNewDeliveryZone;
