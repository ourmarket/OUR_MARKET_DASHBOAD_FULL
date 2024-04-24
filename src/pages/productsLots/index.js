/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useGetProductsQuery } from "api/productApi";
import { useGetSuppliersQuery } from "api/supplierApi";
import AddStock from "components/OUForms/Stock/Add-Stock/AddStock";
import StockAvailableTable from "components/OUTables/Stocks/Available/StockAvailableTable";
import StockTotalTable from "components/OUTables/Stocks/Total/StockTotalsTable";
import StockAllTable from "components/OUTables/Stocks/All/StockAllTable";
import AddStockManufacture from "components/OUForms/Stock/Add-Stock-Manufacture/AddStockManufacture";
import { useGetAvailableStocksQuery, useGetStocksQuery } from "api/stockApi";

function StockMain() {
  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const {
    data: dataProducts,
    isLoading: l1,
    error: e1,
  } = useGetProductsQuery(1);

  const {
    data: ListSuppliers,
    isLoading: l3,
    isError: e3,
  } = useGetSuppliersQuery();

  const { data: allStock, isLoading: l4, isError: e4 } = useGetStocksQuery();
  const {
    data: allAvailableStock,
    isLoading: l5,
    isError: e5,
  } = useGetAvailableStocksQuery();

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
                Stock de productos
              </MDTypography>
            </MDBox>

            <Box
              sx={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "column",

                my: 2,
              }}
            >
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="Stock total" />
                <Tab label="Stock disponible" />
                <Tab label="Historial de compras" />
                <Tab label="Agregar stock" />
                {/*  <Tab label="Agregar stock subproducto" /> */}
              </Tabs>
            </Box>
            {page === 1 && (
              <Card>
                {l4 && <Loading />}
                {e4 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {allStock && (
                  <StockAvailableTable allStock={allStock.data.stock} />
                )}
              </Card>
            )}
            {page === 0 && (
              <Card>
                {l5 && <Loading />}
                {e5 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {allAvailableStock && (
                  <StockTotalTable actualStock={allAvailableStock.data.stock} />
                )}
              </Card>
            )}
            {page === 2 && (
              <Card>
                {l4 && <Loading />}
                {e4 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {allStock && <StockAllTable allStock={allStock.data.stock} />}
              </Card>
            )}
            {page === 3 && (
              <Card>
                {(l1 || l3) && <Loading />}
                {(e1 || e3) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {dataProducts && ListSuppliers && (
                  <AddStock
                    listProducts={dataProducts}
                    ListSuppliers={ListSuppliers}
                  />
                )}
              </Card>
            )}
            {page === 4 && (
              <Card>
                {(l1 || l3) && <Loading />}
                {(e1 || e3) && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {dataProducts && allAvailableStock && (
                  <AddStockManufacture
                    listProducts={dataProducts.products}
                    actualStock={allAvailableStock.data.stock}
                  />
                )}
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default StockMain;
