/* eslint-disable no-prototype-builtins */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { Card, Box, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTypography from "components/MDTypography";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOrder,
  errorStock,
  clearErrorStock,
} from "reduxToolkit/ordersSlice";
import { adjustStock } from "utils/adjustStock";

function ItemCard({ product }) {
  const [quantity, setQuantity] = useState(product.totalQuantity);
  const [value, setValue] = useState(product.unitPrice);
  const [cost, setCost] = useState(product.originalUnitCost);
  const { existStock } = useSelector((store) => store.order);
  const dispatch = useDispatch();

  const { originalTotalQuantity, stockData, availableStock, originalUnitCost } =
    product;

  const actualStock = product.availableStock.reduce(
    (acc, curr) => acc + curr.stock,
    0
  );

  const handlerQuantity = (e) => {
    if (e.target.value > actualStock) {
      dispatch(errorStock());
    }
    if (e.target.value <= actualStock) {
      dispatch(clearErrorStock());
    }

    setQuantity(e.target.value);

    const modifyStock = adjustStock(
      originalTotalQuantity,
      e.target.value,
      availableStock,
      stockData,
      originalUnitCost
    );

    dispatch(
      updateOrder({
        id: product._id,
        totalQuantity: e.target.value,
        totalPrice: value * e.target.value,
        unitPrice: value,
        unitCost: modifyStock.unitCost,
        modifyStockData: modifyStock.modifyStock,
        modifyAvailableStock: modifyStock.availableStock,
        visible: true,
      })
    );
    setCost(modifyStock.unitCost);
  };
  const handlerValue = (e) => {
    setValue(e.target.value);

    dispatch(
      updateOrder({
        id: product._id,
        totalQuantity: quantity,
        totalPrice: e.target.value * quantity,
        unitPrice: e.target.value,
        unitCost: cost,
      })
    );
  };
  const handlerCost = (e) => {
    setCost(e.target.value);

    dispatch(
      updateOrder({
        id: product._id,
        totalQuantity: quantity,
        totalPrice: value * quantity,
        unitPrice: value,
        unitCost: e.target.value,
      })
    );
  };

  const handleDelete = () => {
    setQuantity(0);
    setValue(0);
    setCost(0);
    const modifyStock = adjustStock(
      originalTotalQuantity,
      0,
      availableStock,
      stockData,
      originalUnitCost
    );

    dispatch(
      updateOrder({
        id: product._id,
        totalQuantity: 0,
        totalPrice: value * 0,
        unitPrice: value,
        unitCost: modifyStock.unitCost,
        modifyStockData: modifyStock.modifyStock,
        modifyAvailableStock: modifyStock.availableStock,
        visible: false,
      })
    );
  };

  return (
    <Card
      sx={{
        padding: "5px 20px",
        minHeight: "75px",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Box
          sx={{
            width: 75,
            mr: 2,
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
            {`${product.name} || stock: ${actualStock}`}
          </MDTypography>

          <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
            <TextField
              type="number"
              value={quantity}
              label="Cantidad"
              onChange={handlerQuantity}
            />
          </Box>

          <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
            <span>
              <MDTypography variant="subtitle2">$</MDTypography>
            </span>
            <TextField
              type="number"
              value={value}
              label="Unidad"
              onChange={handlerValue}
            />
          </Box>

          <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
            <span>
              <MDTypography variant="subtitle2">$</MDTypography>
            </span>
            <TextField
              type="number"
              value={value * quantity}
              label="Total(*)"
              disabled={true}
              /*  onChange={handlerValue} */
            />
          </Box>
          <Box sx={{ width: "23%", display: "flex", alignItems: "center" }}>
            <span>
              <MDTypography variant="subtitle2">$</MDTypography>
            </span>
            <TextField
              type="number"
              value={cost}
              label="Costo(*)"
              onChange={handlerCost}
              disabled={true}
            />
          </Box>

          <MDButton onClick={handleDelete}>
            <DeleteIcon />
          </MDButton>
        </Box>
      </Box>

      {!existStock && (
        <MDTypography
          sx={{ color: "red", fontSize: "14px", textAlign: "center" }}
        >
          ⚠ Error: La cantidad es mayor al stock existente.
        </MDTypography>
      )}
    </Card>
  );
}

export default ItemCard;
