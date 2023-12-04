import { Alert, Card, Grid, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import AddProducts from "./02-products/AddProducts";
import FinishBuy from "./03-finish/FinishBuy";
import { useGetProductsQuery } from "api/productApi";
import Loading from "components/DRLoading";
import { useGetSuppliersQuery } from "api/supplierApi";
import AddSuppliers from "./01-distributor/AddDistributor";
import { useSelector } from "react-redux";

const NewBuy = () => {
  const { quantityProducts } = useSelector((store) => store.buy);
  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const {
    data: dataSuppliers,
    isLoading: l1,
    isError: e1,
  } = useGetSuppliersQuery();
  const {
    data: dataProducts,
    isLoading: l2,
    isError: e2,
  } = useGetProductsQuery();

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
                Nueva compra
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
                <Tab label="1. Agregar Proveedor" />
                <Tab label="2. Agregar Productos" />
                <Tab
                  label={`3. Finalizar compra(${
                    quantityProducts ? quantityProducts : 0
                  })`}
                />
              </Tabs>
            </Box>
            {page === 0 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Card>
                  {l1 && <Loading />}
                  {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataSuppliers && (
                    <AddSuppliers
                      suppliersData={dataSuppliers.data.suppliers}
                      setPage={setPage}
                    />
                  )}
                </Card>
              </Box>
            )}
            {page === 1 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Card>
                  {l2 && <Loading />}
                  {e2 && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataProducts && (
                    <AddProducts products={dataProducts.products} />
                  )}
                </Card>
              </Box>
            )}
            {page === 2 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Box>
                  <FinishBuy setPage={setPage} />
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewBuy;
