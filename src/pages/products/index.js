/* eslint-disable no-unused-vars */
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Tab, Tabs } from "@mui/material";
import { useGetProductsQuery } from "api/productApi";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "api/categoryApi";
import { useGetOfertsQuery } from "api/ofertApi";
import TableListProducts from "./product/products-list/TableListProducts";
import TableListCategories from "./category/category-list/TableListCategories";
import TableListOfertsLite from "./ofert/oferts-list/TableListOfertsLite";

function Products() {
  const [page, setPage] = useState(0);
  const [ofertWithStock, setOfertWithStock] = useState([]);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };
  const {
    data: listProducts,
    isLoading: l1,
    error: e1,
  } = useGetProductsQuery(1);
  const {
    data: listCategories,
    isLoading: l2,
    error: e2,
  } = useGetCategoriesQuery();
  const { data: listOferts, isLoading: l3, error: e3 } = useGetOfertsQuery();

  /* useEffect(() => {
    if (listOferts && listProducts) {
      const oferts = listOferts.data.oferts;
      const products = listProducts.products;
      const ofertsWithStockArr = [];
      for (let i = 0; i < oferts.length; i++) {
        for (let x = 0; x < products.length; x++) {
          if (
            oferts[i]?.product?._id.toString() === products[x]?._id.toString()
          )
            ofertsWithStockArr.push({
              ...oferts[i],
              stock: products[x].stock,
            });
        }
      }

      setOfertWithStock(ofertsWithStockArr);
    }
  }, [listOferts, listProducts]); */

  useEffect(() => {
    if (listOferts && listProducts) {
      const oferts = listOferts.data.oferts;
      const products = listProducts.products;

      const ofertsWithStockArr = oferts.map((ofert) => {
        const productWithStock = products.find(
          (product) => ofert.product?._id.toString() === product?._id.toString()
        );

        if (productWithStock) {
          return {
            ...ofert,
            stock: productWithStock.stock,
          };
        }

        return ofert;
      });

      setOfertWithStock(ofertsWithStockArr);
    }
  }, [listOferts, listProducts]);

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
                <Tab label="Ofertas" />
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
                {listProducts && <TableListProducts products={listProducts} />}
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
            {page === 2 && (
              <Card
                sx={{
                  mx: 2.5,
                }}
              >
                {l3 && <Loading />}
                {e3 && <Alert severity="error">Ha ocurrido un error</Alert>}
                {listOferts && <TableListOfertsLite oferts={ofertWithStock} />}
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Products;
