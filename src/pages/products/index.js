/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Divider, Tab, Tabs } from "@mui/material";
import { useGetProductsQuery } from "api/productApi";
import { Box } from "@mui/system";
import { useState } from "react";
import { useGetCategoriesQuery } from "api/categoryApi";
import TableListCategories from "./category/category-list/TableListCategories";
import TableProductsLite from "./product/products-list/TableListProductsNew";

function Products() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  // Queries
  const {
    data: listProducts,
    isLoading: l1,
    error: e1,
  } = useGetProductsQuery();
  const {
    data: listCategories,
    isLoading: l2,
    error: e2,
  } = useGetCategoriesQuery();

  const isLoading = l1 || l2;
  const hasError = e1 || e2;

  return (
   /*  <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
         <Grid container justifyContent="center">
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
                Productos
              </MDTypography>
            </MDBox>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "column",
                px: 2,
                my: 2,
              }}
            >
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="Productos" />
                <Tab label="Categorías" />
              </Tabs>
            </Box>
            {page === 0 && (
              <Card
                sx={{
                  mx: 2.5,
                }}
              >
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {listProducts && <TableProductsLite products={listProducts} />}
              </Card>
            )}
            {page === 1 && (
              <Card
                sx={{
                  mx: 2.5,
                }}
              >
                {l2 && <Loading />}
                {e2 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {listCategories && (
                  <TableListCategories categories={listCategories.categories} />
                )}
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout> */
     <DashboardLayout>
          <DashboardNavbar />
          <MDBox pt={6} pb={3}>
            <Grid container justifyContent="center">
              <Grid item xs={12} lg={12}>
                <Card sx={{ overflow: "visible" }}>
                  {/* Header con gradiente integrado */}
                  <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={3}
                    mb={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDBox>
                      <MDTypography variant="h6" color="white" textTransform="uppercase">
                        Producto y Categorías
                      </MDTypography>
                      <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                        Lista de todos los productos y categorias
                      </MDTypography>
                    </MDBox>
                  </MDBox>
    
                  {/* Selector de pestañas más moderno */}
                  <MDBox px={2} mt={1}>
                    <Tabs 
                      value={tabIndex} 
                      onChange={handleTabChange} 
                      variant="standard"
                      sx={{
                        background: "transparent",
                        "& .MuiTabs-indicator": { backgroundColor: ({ palette: { info } }) => info.main }
                      }}
                    >
                      <Tab label="Catálogo de Productos" sx={{ fontWeight: "bold" }} />
                      <Tab label="Categorías de Productos" sx={{ fontWeight: "bold" }} />
                    </Tabs>
                    <Divider sx={{ mt: 0, mb: 3 }} />
                  </MDBox>
    
                  {/* Área de Contenido */}
                  <MDBox pb={3} px={3}>
                    {isLoading && (
                      <MDBox display="flex" justifyContent="center" py={5}>
                        <Loading />
                      </MDBox>
                    )}
    
                    {hasError && (
                      <MDBox mb={2}>
                        <Alert severity="error" variant="filled" sx={{ color: "white" }}>
                          No se pudo cargar la información del producto. Inténtelo más tarde.
                        </Alert>
                      </MDBox>
                    )}
    
                    {!isLoading && !hasError && (
                      <>
                        {tabIndex === 0 && listProducts && (
                          <MDBox animate={{ opacity: 1 }}>
                            <TableProductsLite products={listProducts} />
                          </MDBox>
                        )}
    
                        {tabIndex === 1 && listCategories && (
                          <MDBox animate={{ opacity: 1 }}>
                            <TableListCategories categories={listCategories.categories} />
                          </MDBox>
                        )}
                      </>
                    )}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </DashboardLayout>
  );
}

export default Products;
