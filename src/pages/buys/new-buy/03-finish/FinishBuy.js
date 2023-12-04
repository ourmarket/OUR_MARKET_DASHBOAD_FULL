/* eslint-disable react/prop-types */
import { Alert, Card, Divider, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { usePostBuyMutation } from "api/buyApi";
import { useDispatch, useSelector } from "react-redux";
import ItemBuy from "./ItemBuy";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import { LoadingButton } from "@mui/lab";
import { formatPrice } from "utils/formaPrice";
import { useState } from "react";
import MDButton from "components/MDButton";
import Swal from "sweetalert2";
import { clearBuy } from "reduxToolkit/buySlice";

const FinishBuy = ({ setPage }) => {
  const dispatch = useDispatch();
  const { products, supplier, quantityProducts, total } = useSelector(
    (store) => store.buy
  );
  const { user } = useSelector((store) => store.auth);

  const [cash, setCash] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const [debt, setDebt] = useState(0);

  const [createBuyOrder, { isLoading: l1, isError: e1 }] = usePostBuyMutation();

  const handlerCreate = async () => {
    const data = {
      user,
      supplier: supplier.id,
      quantityProducts,
      total,

      payment: {
        cash,
        transfer,
        debt,
      },

      products,
    };

    const res = await createBuyOrder(data).unwrap();
    if (res.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Compra cargada con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
      dispatch(clearBuy());
      setPage(0);
    }
  };

  const handlerCash = () => {
    const rest = total - transfer - debt;
    setCash(rest);
  };
  const handlerTransfer = () => {
    const rest = total - cash - debt;
    setTransfer(rest);
  };
  const handlerDebt = () => {
    const rest = total - transfer - cash;
    setDebt(rest);
  };

  if (products.length === 0) {
    return <Alert severity="warning">Debes cargar antes los productos</Alert>;
  }
  return (
    <Box
      sx={{
        display: "flex",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          width: "70%",
        }}
      >
        {products.map((product) => (
          <ItemBuy product={product} key={product.productId} />
        ))}
      </Box>
      <Card
        sx={{
          width: "30%",
          padding: "30px",
          alignSelf: "flex-start",
        }}
      >
        <MDTypography variant="h6">Resumen</MDTypography>

        <Divider />
        <Box display="flex" justifyContent="space-between">
          <MDTypography variant="body2">Proveedor</MDTypography>
          <MDTypography variant="h6">{supplier?.businessName}</MDTypography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <MDTypography variant="body2">Cant. productos</MDTypography>
          <MDTypography variant="h6">{quantityProducts}</MDTypography>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between" mb={3}>
          <MDTypography variant="body2">Total</MDTypography>
          <MDTypography variant="h6">{formatPrice(total)}</MDTypography>
        </Box>

        <Divider />
        <MDTypography variant="h6">Pago</MDTypography>
        <Divider />
        <TextField
          type="number"
          label="Efectivo"
          margin="normal"
          InputProps={{ inputProps: { min: 0 } }}
          value={cash}
          onChange={(e) => {
            setCash(e.target.value);
          }}
        />
        <TextField
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          label="Transferencia"
          margin="normal"
          value={transfer}
          onChange={(e) => setTransfer(e.target.value)}
        />
        <TextField
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          label="Deuda"
          margin="normal"
          value={debt}
          onChange={(e) => setDebt(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: "10px" }}>
          <MDButton
            variant="outlined"
            color="success"
            onClick={handlerCash}
            sx={{
              mt: 3,
              flex: 1,
            }}
          >
            Efectivo
          </MDButton>
          <MDButton
            variant="outlined"
            color="success"
            onClick={handlerTransfer}
            sx={{
              mt: 3,
              flex: 1,
            }}
          >
            Transfer.
          </MDButton>
          <MDButton
            variant="outlined"
            color="error"
            onClick={handlerDebt}
            sx={{
              mt: 3,
              flex: 1,
            }}
          >
            Deuda
          </MDButton>
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={l1}
          onClick={handlerCreate}
          sx={{
            mt: 3,
            backgroundColor: `${colors.info.main}`,
            color: "white !important",
            width: "100%",
          }}
        >
          Confirmar compra
        </LoadingButton>
        {e1 && <Alert severity="error">Error: compra no cargada!</Alert>}
      </Card>
    </Box>
  );
};

export default FinishBuy;
