/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Box, Card, Grid, Tab, Tabs } from "@mui/material";
import { useGetClientAddressesQuery } from "api/clientsAddressApi";
import { useGetDeliveryTrucksQuery } from "api/deliveryTruckApi";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";

import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "reduxToolkit/cartSlice";
import Address from "../components/01-address-delivery/Address";

import Cart from "../components/03-cart/CartDelivery";
import { Oferts_index } from "../components/02-oferts/Oferts_index";

function OrderCreate() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.cart);

  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

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
                Venta con reparto
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
                <Oferts_index />
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
