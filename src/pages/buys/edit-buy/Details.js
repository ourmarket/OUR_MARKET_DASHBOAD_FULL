/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Alert, Box, Card, Divider, TextField } from "@mui/material";
import MDTypography from "components/MDTypography";
import ProductCard from "./ProductCard";
import { useState } from "react";
import MDButton from "components/MDButton";
import { LoadingButton } from "@mui/lab";
import colors from "assets/theme/base/colors";
import { usePutBuyMutation } from "api/buyApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function Details({ buy }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editBuyOrder, { isLoading: l1, isError: e1 }] = usePutBuyMutation();

  const [cash, setCash] = useState(buy.payment.cash);
  const [transfer, setTransfer] = useState(buy.payment.transfer);
  const [debt, setDebt] = useState(buy.payment.debt);

  const handlerCash = () => {
    const rest = buy.total - transfer - debt;
    setCash(rest);
  };
  const handlerTransfer = () => {
    const rest = buy.total - cash - debt;
    setTransfer(rest);
  };
  const handlerDebt = () => {
    const rest = buy.total - transfer - cash;
    setDebt(rest);
  };

  const handleEdit = async () => {
    const data = {
      payment: {
        cash,
        transfer,
        debt,
      },
    };

    const res = await editBuyOrder({ id, ...data });

    if (res) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Compra editada con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
      navigate(-1);
    }
  };

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

        <Divider />
        <Box display="flex" justifyContent="space-between">
          <MDTypography variant="body2">Comprado por:</MDTypography>
          <MDTypography variant="h6">{`${buy.user.name} ${buy.user.lastName}`}</MDTypography>
        </Box>
        <Divider />
        <MDTypography variant="h6">Pago</MDTypography>

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
          onClick={handleEdit}
          sx={{
            mt: 3,
            backgroundColor: `${colors.info.main}`,
            color: "white !important",
            width: "100%",
          }}
        >
          Editar
        </LoadingButton>
        {e1 && <Alert severity="error">Error: compra no cargada!</Alert>}
      </Card>
    </Box>
  );
}

export default Details;
