import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  useGetDeliveryZoneQuery,
  useGetDeliveryZonesQuery,
} from "api/deliveryZoneApi";
import { Alert } from "@mui/material";
import Loading from "components/DRLoading";
import { useParams } from "react-router-dom";
import EditZone from "components/OUForms/Zone/edit-zone/EditZone";

function EditDeliveryZone() {
  const { id } = useParams();
  const {
    data: deliveryZone,
    isLoading: l1,
    isError: e1,
  } = useGetDeliveryZoneQuery(id);
  const {
    data: dataZones,
    isLoading: l2,
    isError: e2,
  } = useGetDeliveryZonesQuery();

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
                  Editar zona
                </MDTypography>
              </MDBox>
              <MDBox>
                {(l1 || l2) && <Loading />}
                {(e1 || e2) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {deliveryZone && dataZones && (
                  <EditZone
                    deliveryZone={deliveryZone.data.deliveryZone}
                    zones={dataZones.data.deliveryZones}
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

export default EditDeliveryZone;
