import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

// API & Utils
import { useGetBuyByIdQuery, useRegisterBuyPaymentMutation } from "api/buyApi";
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";

const PaymentByBuyId = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: buy, isLoading: isLoadingBuy, error } = useGetBuyByIdQuery(id);
  const [registerPayment, { isLoading: isRegistering }] =
    useRegisterBuyPaymentMutation();

  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");

  const paidAmount = useMemo(() => {
    return buy?.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
  }, [buy]);

  const balanceDue = useMemo(() => {
    if (!buy) return 0;
    return buy.total - paidAmount;
  }, [buy, paidAmount]);

  useEffect(() => {
    if (buy && amount === 0) {
      setAmount(buy.total - paidAmount);
    }
  }, [buy, paidAmount]);

  const handleSubmit = async () => {
    if (!paymentMethod || amount <= 0) {
      Swal.fire(
        "Error",
        "Por favor complete todos los campos requeridos",
        "error"
      );
      return;
    }

    if (amount > balanceDue + 0.01) {
      const confirm = await Swal.fire({
        title: "¿Monto superior al saldo?",
        text: `El monto ingresado (${formatPrice(
          amount
        )}) es superior al saldo pendiente (${formatPrice(
          balanceDue
        )}). ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "No, corregir",
      });
      if (!confirm.isConfirmed) return;
    }

    try {
      await registerPayment({
        id,
        payment: {
          amount,
          paymentMethod,
          reference,
          date: paymentDate,
        },
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Pago Registrado",
        text: "El pago ha sido registrado exitosamente.",
      }).then(() => {
        navigate(`/compras/detalle1/${id}`);
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al registrar el pago", "error");
    }
  };

  if (isLoadingBuy) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error || !buy) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <MDTypography variant="h4" gutterBottom>
            Compra no encontrada
          </MDTypography>
          <MDButton
            variant="contained"
            color="info"
            onClick={() => navigate("/compras")}
          >
            Volver a Compras
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              Registrar Pago: {buy.code}
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDButton
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate(`/compras/detalle1/${id}`)}
                sx={{ pl: 0, textTransform: "none" }}
              >
                <Icon>arrow_back</Icon>&nbsp;Volver al detalle
              </MDButton>
              <MDTypography variant="button" color="text" ml={1}>
                / Pago Individual
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Supplier Info */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Proveedor
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    display="block"
                    gutterBottom
                  >
                    {buy.supplier?.businessName ||
                      buy.supplier?.name ||
                      "Sin Nombre"}
                  </MDTypography>

                  <MDBox display="flex" alignItems="center" mb={0.5}>
                    <Icon fontSize="small" color="disabled" sx={{ mr: 1 }}>
                      email
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {buy.supplier?.email || "N/A"}
                    </MDTypography>
                  </MDBox>

                  <MDBox display="flex" alignItems="center">
                    <Icon fontSize="small" color="disabled" sx={{ mr: 1 }}>
                      phone
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      {buy.supplier?.phone || "N/A"}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Volvemos a compra pendiente */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>list_alt</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Compra pendiente
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell width="50px"></TableCell>
                        <TableCell>Nº Compra</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Saldo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell width="50px">
                          <Icon color="info">check_circle</Icon>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="button" fontWeight="medium">
                            {buy.code}
                          </MDTypography>
                        </TableCell>
                        <TableCell>
                          <MDTypography variant="button">
                            {dateToLocalDate(buy.date)}
                          </MDTypography>
                        </TableCell>
                        <TableCell align="right">
                          <MDTypography variant="button">
                            {formatPrice(buy.total)}
                          </MDTypography>
                        </TableCell>
                        <TableCell align="right">
                          <MDTypography
                            variant="button"
                            fontWeight="bold"
                            color="error"
                          >
                            {formatPrice(balanceDue)}
                          </MDTypography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Payment Details */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>credit_card</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Datos del Pago
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="date"
                        label="Fecha de Pago"
                        fullWidth
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={[
                          "TRANSFER",
                          "CASH",
                          "CHECK",
                          "CREDIT_CARD",
                          "DEBIT_CARD",
                        ]}
                        value={paymentMethod}
                        onChange={(_, newValue) => setPaymentMethod(newValue)}
                        getOptionLabel={(option) => {
                          const labels = {
                            TRANSFER: "Transferencia",
                            CASH: "Efectivo",
                            CHECK: "Cheque",
                            CREDIT_CARD: "Tarjeta de Crédito",
                            DEBIT_CARD: "Tarjeta de Débito",
                          };
                          return labels[option] || option;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Método de Pago"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type="number"
                        label="Monto a Pagar"
                        fullWidth
                        value={amount}
                        onChange={(e) =>
                          setAmount(parseFloat(e.target.value) || 0)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0 }}
                        helperText={`Saldo pendiente: ${formatPrice(
                          balanceDue
                        )}`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Referencia (opcional)"
                        fullWidth
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Nº trans., recibo, etc."
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          {/* Sidebar Summary */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Resumen Financiero
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Total Compra
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {formatPrice(buy.total)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Pagado anteriormente
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="medium"
                      color="success"
                    >
                      {formatPrice(paidAmount)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Saldo Pendiente
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="error"
                    >
                      {formatPrice(balanceDue)}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mt={2}>
                    <MDTypography variant="body2" fontWeight="bold">
                      Monto del Nuevo Pago
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="bold" color="info">
                      {formatPrice(amount)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSubmit}
                disabled={isRegistering || !paymentMethod || amount <= 0}
              >
                <Icon>save</Icon>&nbsp;
                {isRegistering ? "Registrando..." : "Registrar Pago"}
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default PaymentByBuyId;
