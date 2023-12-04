/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Box, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTypography from "components/MDTypography";
import { useDispatch } from "react-redux";
import { deleteProduct } from "reduxToolkit/cartSlice";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";
import { updateProduct } from "reduxToolkit/buySlice";

function ItemBuy({ product }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      value: product.unitCost,
      quantity: product.quantity,
    },

    validationSchema: yup.object().shape({
      quantity: yup.number().required("Requerido").positive("Valor invalido"),
      value: yup.number().required("Requerido"),
    }),
  });

  useEffect(() => {
    dispatch(
      updateProduct({
        productId: product.productId,
        quantity: formik.values.quantity,
        unitCost: formik.values.value,
        totalCost: formik.values.quantity * formik.values.value,
      })
    );
  }, [formik.values]);

  return (
    <Card
      sx={{
        padding: "5px 20px 5px 10px",
        display: "flex",
        minHeight: "75px",
        flexDirection: "row",
        alignItems: "center",
        mb: 2,
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
          src={product.img}
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
          gap: "10px",
        }}
      >
        <MDTypography variant="subtitle2" sx={{ width: "30%" }}>
          {product.name}
        </MDTypography>

        <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
          <TextField
            type="number"
            label="Cantidad"
            focused
            name="quantity"
            InputProps={{ inputProps: { min: "0", step: "1" } }}
            value={formik.values.quantity}
            error={!!formik.errors.quantity}
            helperText={formik.errors.quantity}
            onChange={formik.handleChange}
          />
        </Box>

        <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
          <span>
            <MDTypography variant="subtitle2">$</MDTypography>
          </span>
          <TextField
            type="number"
            label="Valor Unidad"
            name="value"
            value={formik.values.value}
            error={!!formik.errors.value}
            helperText={formik.errors.value}
            onChange={formik.handleChange}
          />
        </Box>

        <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
          <span>
            <MDTypography variant="subtitle2">$</MDTypography>
          </span>
          <TextField
            type="number"
            value={formik.values.value * formik.values.quantity}
            label="Valor total"
            disabled="true"
          />
        </Box>

        <MDButton onClick={() => dispatch(deleteProduct(product.productId))}>
          <DeleteIcon />
        </MDButton>
      </Box>
    </Card>
  );
}

export default ItemBuy;
