/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import { useGetClientsQuery } from "api/clientsApi";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";
import ClientAddressCreate from "./ClientAddressCreate";
import { useLoadScript } from "@react-google-maps/api";

function CreateNewClientAddress() {
  const { data: clients, isLoading: l1, isError: e1 } = useGetClientsQuery();
  const {
    data: zones,
    isLoading: l2,
    isError: e2,
  } = useGetDeliveryZonesQuery();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_MAP_API_KEY,
    libraries: ["places"],
  });

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
                  Crear nueva dirección de cliente
                </MDTypography>
              </MDBox>
              <MDBox>
                {(e1 || e2) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {clients && zones && isLoaded && (
                  <ClientAddressCreate
                    clients={clients.data.clients}
                    zones={zones.data.deliveryZones}
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

export default CreateNewClientAddress;
