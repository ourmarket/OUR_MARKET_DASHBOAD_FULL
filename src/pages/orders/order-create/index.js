/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Box, Card, Grid, Tab, Tabs } from "@mui/material";
import { useGetClientAddressesQuery } from "api/clientsAddressApi";
import { useGetDeliveryTrucksQuery } from "api/deliveryTruckApi";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";
import { useGetOfertsQuery } from "api/ofertApi";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "reduxToolkit/cartSlice";
import Address from "./01-address/Address";
import Oferts from "./02-oferts/Oferts";
import Cart from "./03-cart/Cart";

function OrderCreate() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.cart);

  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const { data: oferts, isLoading: l1, isError: e1 } = useGetOfertsQuery();
  const {
    data: clientAddresses,
    isLoading: l2,
    isError: e2,
  } = useGetClientAddressesQuery();
  const {
    data: zones,
    isLoading: l3,
    isError: e3,
  } = useGetDeliveryZonesQuery();
  const {
    data: deliveryTrucks,
    isLoading: l4,
    isError: e4,
  } = useGetDeliveryTrucksQuery();

  useEffect(() => {
    dispatch(clearCart());
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                Orden de reparto
              </MDTypography>
            </MDBox>
            <MDBox pt={3} px={2}>
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="1.Datos de envío" />
                <Tab label="2.Cargar ofertas" />
                <Tab label={`3.Confirmar pedido(${products.length})`} />
              </Tabs>
            </MDBox>
            {page === 0 && (
              <Box
                sx={{
                  mx: 2.5,
                  mt: 3,
                }}
              >
                {(l2 || l3 || l4) && <Loading />}
                {(e2 || e3 || e4) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {clientAddresses && zones && deliveryTrucks && (
                  <Address
                    clientAddresses={clientAddresses.data.clientAddress}
                    setPage={setPage}
                    zones={zones.data.deliveryZones}
                    deliveryTrucks={deliveryTrucks.data.deliveryTrucks}
                  />
                )}
              </Box>
            )}
            {page === 1 && (
              <Card
                sx={{
                  mx: 2.5,
                  mt: 3,
                  p: 2,
                }}
              >
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {oferts && <Oferts oferts={oferts.data.oferts} />}
              </Card>
            )}
            {page === 2 && (
              <Box
                sx={{
                  mx: 2.5,
                  mt: 3,
                }}
              >
                <Cart />
              </Box>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderCreate;
