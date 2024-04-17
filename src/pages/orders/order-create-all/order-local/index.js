/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Alert, Box, Card, Grid, Tab, Tabs } from "@mui/material";
import { useGetOfertsQuery } from "api/ofertApi";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "reduxToolkit/cartSlice";
import { useGetClientsQuery } from "api/clientsApi";
import Address from "../components/01-address-local/Address";
import Oferts from "../components/02-oferts/Oferts";
import CartLocal from "../components/03-cart/CartLocal";

function OrderLocalCreate() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.cart);

  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const { data: oferts, isLoading: l1, isError: e1 } = useGetOfertsQuery(1);
  const { data: clients, isLoading: l2, isError: e2 } = useGetClientsQuery();

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
                Venta Local
              </MDTypography>
            </MDBox>
            <MDBox pt={3} px={0} mb={3}>
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="1.Datos de envío" />
                <Tab label="2.Cargar ofertas" />
                <Tab label={`3.Confirmar pedido(${products.length})`} />
              </Tabs>
            </MDBox>
            {page === 0 && (
              <Card>
                {l2 && <Loading />}
                {e2 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {clients && (
                  <Address clients={clients.data.clients} setPage={setPage} />
                )}
              </Card>
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
              <Box>
                <CartLocal setPage={setPage} />
              </Box>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderLocalCreate;
