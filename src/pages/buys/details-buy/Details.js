/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Card, Divider } from "@mui/material";
import MDTypography from "components/MDTypography";
import ProductCard from "./ProductCard";

function Details({ buy }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "20px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "66%",
          alignSelf: "flex-start",
        }}
      >
        {buy.products.map((product) => (
          <ProductCard product={product} key={product.productId} />
        ))}
      </Box>
      <Card
        sx={{
          padding: "25px",
          width: "33%",
        }}
      >
        <MDTypography variant="h6">Resumen</MDTypography>
        <Divider />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <MDTypography variant="body2">Proveedor</MDTypography>
          <MDTypography variant="h6">{buy.supplier.businessName}</MDTypography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <MDTypography variant="body2">Total</MDTypography>
          <MDTypography variant="h6">${buy.total}</MDTypography>
        </Box>
        <MDTypography variant="h6">Pago</MDTypography>
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <MDTypography variant="body2">Efectivo</MDTypography>
          <MDTypography variant="h6">${buy?.payment?.cash || 0}</MDTypography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <MDTypography variant="body2">Transferencia</MDTypography>
          <MDTypography variant="h6">
            ${buy?.payment?.transfer || 0}
          </MDTypography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <MDTypography variant="body2">Deuda</MDTypography>
          <MDTypography variant="h6">${buy?.payment?.debt || 0}</MDTypography>
        </Box>

        <Divider />
        <Box display="flex" justifyContent="space-between">
          <MDTypography variant="body2">Comprado por:</MDTypography>
          <MDTypography variant="h6">{`${buy.user.name} ${buy.user.lastName}`}</MDTypography>
        </Box>
      </Card>
    </Box>
  );
}

export default Details;
