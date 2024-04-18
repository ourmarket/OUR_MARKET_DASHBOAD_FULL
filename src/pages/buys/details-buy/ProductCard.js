/* eslint-disable react/prop-types */
import { Box, Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import { formatPrice } from "utils/formaPrice";

function ProductCard({ product }) {
  return (
    <Card
      sx={{
        padding: "5px 20px 5px 5px",
        display: "flex",
        height: "75px",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "15px",
      }}
    >
      <Box
        sx={{
          width: 60,
          mr: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <img
          src={product?.img}
          alt={product?.name}
          loading="lazy"
          style={{
            width: "55px",
            height: "55",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <MDTypography variant="subtitle2" sx={{ width: "60%" }}>
          {product.name}
        </MDTypography>
        <MDTypography variant="subtitle2" sx={{ width: "40%" }}>
          {`${product.quantity} und.`}
        </MDTypography>
        <MDTypography variant="h6" sx={{ width: "40%", textAlign: "right" }}>
          {formatPrice(product.totalCost)}
        </MDTypography>
      </Box>
    </Card>
  );
}

export default ProductCard;
