/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "reduxToolkit/cartSlice";
import { formatPrice } from "utils/formaPrice";
import { formatQuantity } from "utils/quantityFormat";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.cart);
  const itemCart = products.find((item) => item._id === product._id);
  const productWithStock = product.stock.filter((item) => item.stock > 0);

  const totalStock = product.stock.reduce((acc, curr) => curr.stock + acc, 0);

  const handlerClick = () => {
    dispatch(
      addProduct({
        ...product,

        finalPrice: product.basePrice,
        finalQuantity: 1,
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
          src={product.product.img}
          alt=""
          style={{
            width: "100%",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",

          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/*   -----Nombre------- */}
        <MDTypography variant="subtitle2" sx={{ width: "40%" }}>
          {product.description}
        </MDTypography>

        {/*   -----Precio------- */}
        <MDTypography
          variant="h6"
          sx={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formatPrice(product.basePrice)}
        </MDTypography>
        <Box
          pr={3}
          sx={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MDTypography
            variant="h6"
            color="info"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {formatQuantity(totalStock)} unid.
          </MDTypography>
        </Box>
        {productWithStock.length === 0 && (
          <MDTypography
            variant="h6"
            color="error"
            sx={{
              width: "20%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Sin stock
          </MDTypography>
        )}
        <Box
          sx={{
            width: "20%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {product.stock.length === 0 && (
            <MDButton color="error" variant="gradient" disabled="true">
              Sin Stock
            </MDButton>
          )}
          {product.stock.length > 0 && (
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handlerClick}
              disabled={!!itemCart}
            >
              {!itemCart ? "Agregar" : "Agregado"}
            </MDButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
