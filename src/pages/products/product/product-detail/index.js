/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";

// API hooks
import { useGetCategoriesQuery } from "api/categoryApi";
import {
  useGetProductQuery,
  useGetProductsTotalByIDQuery,
  useGetTotalIndividualProductLast30DaysQuery,
} from "api/productApi";

// Child components
import DataProduct from "./productData/DataProduct";
import EditProductoForm from "components/OUForms/Product/edit-product/EditProduct";
import StockDetail from "pages/stock/StockDetail";
import { useGetStockByProductQuery } from "api/stockApi";

function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      setTabIndex(parseInt(tab, 10));
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Queries
  const {
    data: categoryData,
    isLoading: l1,
    error: e1,
  } = useGetCategoriesQuery();
  const {
    data: productById,
    isLoading: l2,
    error: e2,
  } = useGetProductQuery(id);
  const {
    data: totalProductSell,
    isLoading: l3,
    error: e3,
  } = useGetProductsTotalByIDQuery(id);
  const {
    data: totalProductSellLast30Days,
    isLoading: l4,
    error: e4,
  } = useGetTotalIndividualProductLast30DaysQuery({ id });

  const {
    data: stockData,
    isLoading: l5,
    isError: e5,
  } = useGetStockByProductQuery(id);

  const isLoading = l1 || l2 || l3 || l4 || l5;
  const hasError = e1 || e2 || e3 || e4 || e5;

  return (
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
                  <MDTypography
                    variant="h6"
                    color="white"
                    textTransform="uppercase"
                  >
                    Detalle del Producto
                  </MDTypography>
                  <MDTypography
                    variant="button"
                    color="white"
                    fontWeight="regular"
                    opacity={0.8}
                  >
                    {productById?.name || "Cargando..."}
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
                    "& .MuiTabs-indicator": {
                      backgroundColor: ({ palette: { info } }) => info.main,
                    },
                  }}
                >
                  <Tab
                    label="Información General"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Tab
                    label="Stock y Movimientos"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Tab
                    label="Configuración y Edición"
                    sx={{ fontWeight: "bold" }}
                  />
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
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ color: "white" }}
                    >
                      No se pudo cargar la información del producto. Inténtelo
                      más tarde.
                    </Alert>
                  </MDBox>
                )}

                {!isLoading && !hasError && (
                  <>
                    {tabIndex === 0 &&
                      productById &&
                      totalProductSell &&
                      totalProductSellLast30Days && (
                        <MDBox animate={{ opacity: 1 }}>
                          <DataProduct
                            productById={productById}
                            totalProductSell={totalProductSell.data.report}
                            totalProductSellLast30Days={
                              totalProductSellLast30Days.data.report
                            }
                            totalProductSellByMonth={
                              totalProductSell.data.byMonth
                            }
                          />
                        </MDBox>
                      )}

                    {tabIndex === 1 && stockData && (
                      <MDBox animate={{ opacity: 1 }}>
                        <StockDetail stockData={stockData} />
                      </MDBox>
                    )}
                    {tabIndex === 2 && categoryData && productById && (
                      <MDBox animate={{ opacity: 1 }}>
                        <EditProductoForm
                          listCategories={categoryData}
                          productData={productById}
                        />
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

export default ProductDetail;
