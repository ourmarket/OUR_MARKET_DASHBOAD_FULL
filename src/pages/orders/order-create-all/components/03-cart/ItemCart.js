/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Box, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTypography from "components/MDTypography";

import { useDispatch } from "react-redux";
import {
  deleteProduct,
  updateProduct,
  isValidStockOrder,
} from "reduxToolkit/cartSlice";
import { formatQuantity } from "utils/quantityFormat";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";

function sortByCreatedAt(arr) {
  return arr
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function updateStockFunction(stock, rest) {
  const sortedStock = sortByCreatedAt(stock);
  let remainingRest = rest;

  for (let i = 0; i < sortedStock.length && remainingRest > 0; i++) {
    const item = { ...sortedStock[i] }; // Crear una nueva copia del objeto
    const stockToSubtract = Math.min(item.stock, remainingRest);
    item.stock -= stockToSubtract;
    item.modify = stockToSubtract; // Agregar el campo modify
    remainingRest -= stockToSubtract;
    sortedStock[i] = item; // Reemplazar el objeto original con la copia modificada
  }

  return sortedStock;
}

function ItemCart({ product }) {
  const dispatch = useDispatch();

  const totalStock = product.stock.reduce((acc, curr) => curr.stock + acc, 0);

  const formik = useFormik({
    initialValues: {
      value: product.basePrice,
      quantity: product.finalQuantity,
    },

    validationSchema: yup.object().shape({
      quantity: yup
        .number()
        .required("Requerido")
        .positive("Valor invalido")
        .max(totalStock, "Valor mayor al stock"),
      value: yup.number().required("Requerido"),
    }),
  });

  useEffect(() => {
    dispatch(
      updateProduct({
        id: product._id,
        finalQuantity: formik.values.quantity,
        finalPrice: formik.values.quantity * formik.values.value,
        basePrice: formik.values.value,
        stockModify: updateStockFunction(product.stock, formik.values.quantity),
      })
    );
    if (formik.values.quantity > totalStock) {
      dispatch(isValidStockOrder(false));
    } else {
      dispatch(isValidStockOrder(true));
    }
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
          gap: "10px",
        }}
      >
        <MDTypography variant="subtitle2" sx={{ width: "30%" }}>
          {product.description} || {formatQuantity(totalStock)} unid.
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
            disabled={true}
          />
        </Box>

        <MDButton onClick={() => dispatch(deleteProduct(product._id))}>
          <DeleteIcon />
        </MDButton>
      </Box>
    </Card>
  );
}

export default ItemCart;
