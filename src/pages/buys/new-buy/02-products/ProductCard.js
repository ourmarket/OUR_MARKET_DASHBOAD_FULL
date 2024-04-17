/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "reduxToolkit/buySlice";
import { v4 as uuidv4 } from "uuid";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.buy);
  const itemCart = products.find((item) => item.productId === product._id);

  const handleClick = () => {
    dispatch(
      addProduct({
        stockId: uuidv4(),
        productId: product._id,
        name: product.name,
        img: product.img,
        quantity: 1,
        unitCost: 0,
        totalCost: 0,
      })
    );
  };

  return (
    <Box
      sx={{
        padding: "5px 20px 5px 5px",
        display: "flex",
        height: "65px",
        flexDirection: "row",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "10px",
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
            width: "60px",
            height: "60px",
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
        <MDTypography variant="subtitle2" sx={{ width: "40%" }}>
          {product.name}
        </MDTypography>

        <MDButton
          color="dark"
          variant="gradient"
          onClick={handleClick}
          disabled={itemCart}
        >
          {!itemCart ? "Agregar" : "Agregado"}
        </MDButton>
      </Box>
    </Box>
  );
}

export default ProductCard;
