/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Box, Card, Tab, Tabs } from "@mui/material";
import { useGetClientAddressesQuery } from "api/clientsAddressApi";
import { useState } from "react";
import TableListClientAddress from "components/OUTables/Addresses/All/TableListClientAddress";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";
import TableListDeliveryZone from "components/OUTables/Zones/All/TableListDeliveryZone";
import { useLoadScript } from "@react-google-maps/api";
import MapsLocations from "components/OUMaps/LocationMap/MapsLocations";
import MapsHeat from "components/OUMaps/HeatMap/MapsHeat";

function ListClientAddress() {
  const {
    data: clientAddresses,
    isLoading: l1,
    error: e1,
  } = useGetClientAddressesQuery();
  const {
    data: dataZones,
    isLoading: l2,
    isError: e2,
  } = useGetDeliveryZonesQuery();

  const {
    data: clientAddressData,
    isLoading: l3,
    error: e3,
  } = useGetClientAddressesQuery();

  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_MAP_API_KEY,
    libraries: ["places", "visualization"],
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box>
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
                  Direcciones y ubicaciones
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
                  <Tab label="Lista de direcciones" />
                  <Tab label="Lista de zonas" />
                  <Tab label="Mapa de zonas" />
                  <Tab label="Mapa de calor" />
                </Tabs>
              </Box>

              {page === 0 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  {l1 && <Loading />}
                  {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {clientAddresses && (
                    <TableListClientAddress
                      clientAddress={clientAddresses.data.clientAddress}
                    />
                  )}
                </Box>
              )}
              {page === 1 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  {l2 && <Loading />}
                  {e2 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataZones && (
                    <TableListDeliveryZone
                      deliveryZones={dataZones.data.deliveryZones}
                    />
                  )}
                </Box>
              )}
              {page === 2 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  {l3 && <Loading />}
                  {e3 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {clientAddressData && dataZones && isLoaded && (
                    <Card>
                      <MapsLocations
                        clientAddress={clientAddressData.data.clientAddress}
                        zones={dataZones.data.deliveryZones}
                      />
                    </Card>
                  )}
                </Box>
              )}
              {page === 3 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  {(l3 || !isLoaded) && <Loading />}
                  {e3 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {clientAddressData && dataZones && (
                    <Card>
                      <MapsHeat
                        clientAddress={clientAddressData.data.clientAddress}
                        zones={dataZones.data.deliveryZones}
                      />
                    </Card>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListClientAddress;
