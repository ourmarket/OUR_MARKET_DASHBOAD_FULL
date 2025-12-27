import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";

// API & Utils
import { useGetSuppliersQuery } from "api/supplierApi";
import {
  useGetBuysPendingQuery,
  useRegisterBuyPaymentMutation,
} from "api/buyApi";
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";

const NewPayment = () => {
  const navigate = useNavigate();
  const { data: suppliersData, isLoading: isLoadingSuppliers } =
    useGetSuppliersQuery();
  const { data: buysPendingData, isLoading: isLoadingBuys } =
    useGetBuysPendingQuery();
  const [registerPayment, { isLoading: isRegistering }] =
    useRegisterBuyPaymentMutation();

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [selectedPurchases, setSelectedPurchases] = useState([]);

  // Suppliers list from API
  const suppliers = suppliersData?.data.suppliers || [];

  // Pending purchases from API filtered by selected supplier
  const pendingPurchases = useMemo(() => {
    if (!selectedSupplier || !buysPendingData) return [];

    // Convert API buys to the format needed for the table if necessary,
    // though we can use them directly if they match.
    // Based on the schema provided, we calculate balanceDue.
    return buysPendingData
      .filter((buy) => {
        const supplierId = buy.supplier?._id || buy.supplier;
        return supplierId === selectedSupplier;
      })
      .map((buy) => {
        const paid = buy.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
        return {
          ...buy,
          id: buy._id,
          balanceDue: buy.total - paid,
        };
      });
  }, [selectedSupplier, buysPendingData]);

  const totalPendingSelected = useMemo(() => {
    return pendingPurchases
      .filter((p) => selectedPurchases.includes(p.id))
      .reduce((sum, p) => sum + p.balanceDue, 0);
  }, [pendingPurchases, selectedPurchases]);

  const togglePurchase = (purchaseId) => {
    setSelectedPurchases((prev) =>
      prev.includes(purchaseId)
        ? prev.filter((id) => id !== purchaseId)
        : [...prev, purchaseId]
    );
  };

  const handleSubmit = async () => {
    if (
      !selectedSupplier ||
      !paymentMethod ||
      amount <= 0 ||
      selectedPurchases.length === 0
    ) {
      Swal.fire(
        "Error",
        "Por favor complete todos los campos requeridos",
        "error"
      );
      return;
    }

    try {
      // If the user entered an amount, we distribute it among selected purchases.
      // For simplicity, we can pay the full balance of each selected purchase up to the total amount entered.
      let remainingAmount = amount;

      const paymentsToRegister = [];
      for (const buyId of selectedPurchases) {
        if (remainingAmount <= 0) break;

        const buy = pendingPurchases.find((p) => p.id === buyId);
        const amountToPay = Math.min(remainingAmount, buy.balanceDue);

        paymentsToRegister.push({
          id: buyId,
          payment: {
            amount: amountToPay,
            paymentMethod,
            reference,
            date: paymentDate,
          },
        });

        remainingAmount -= amountToPay;
      }

      // Execute all payments
      await Promise.all(
        paymentsToRegister.map((p) => registerPayment(p).unwrap())
      );

      Swal.fire({
        icon: "success",
        title: "Pago Registrado",
        text: "El pago ha sido registrado exitosamente.",
      }).then(() => {
        navigate("/compras");
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error al registrar el pago", "error");
    }
  };

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
              Registrar Pago
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDButton
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/compras")}
                sx={{ pl: 0, textTransform: "none" }}
              >
                <Icon>arrow_back</Icon>&nbsp;Volver
              </MDButton>
              <MDTypography variant="button" color="text" ml={1}>
                / Saldar compras pendientes
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Supplier Selection */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Proveedor
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <Autocomplete
                    options={suppliers}
                    value={
                      suppliers.find((s) => s._id === selectedSupplier) || null
                    }
                    onChange={(_, newValue) => {
                      setSelectedSupplier(newValue ? newValue._id : "");
                      setSelectedPurchases([]);
                      setAmount(0);
                    }}
                    getOptionLabel={(option) =>
                      option ? option.businessName || option.name : ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar proveedor"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </MDBox>
              </Card>

              {/* Pending Purchases */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>receipt_long</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Compras Pendientes
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  {!selectedSupplier ? (
                    <MDTypography
                      variant="body2"
                      color="text"
                      align="center"
                      py={3}
                    >
                      Seleccione un proveedor para ver sus compras pendientes
                    </MDTypography>
                  ) : pendingPurchases.length === 0 ? (
                    <MDTypography
                      variant="body2"
                      color="text"
                      align="center"
                      py={3}
                    >
                      Este proveedor no tiene compras pendientes de pago
                    </MDTypography>
                  ) : (
                    <>
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
                            {pendingPurchases.map((purchase) => (
                              <TableRow key={purchase.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedPurchases.includes(
                                      purchase.id
                                    )}
                                    onChange={() => togglePurchase(purchase.id)}
                                    color="primary"
                                  />
                                </TableCell>
                                <TableCell>
                                  <MDTypography
                                    variant="button"
                                    fontWeight="medium"
                                  >
                                    {purchase.code}
                                  </MDTypography>
                                </TableCell>
                                <TableCell>
                                  {dateToLocalDate(purchase.date)}
                                </TableCell>
                                <TableCell align="right">
                                  {formatPrice(purchase.total)}
                                </TableCell>
                                <TableCell align="right">
                                  <MDTypography
                                    variant="button"
                                    fontWeight="bold"
                                    color="warning"
                                  >
                                    {formatPrice(purchase.balanceDue)}
                                  </MDTypography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {selectedPurchases.length > 0 && (
                        <MDBox
                          mt={2}
                          display="flex"
                          justify="space-between"
                          alignItems="center"
                          borderTop="1px solid #f0f2f5"
                          pt={2}
                        >
                          <MDTypography variant="caption" color="text">
                            {selectedPurchases.length} compra(s) seleccionada(s)
                          </MDTypography>
                          <MDBox textAlign="right">
                            <MDTypography
                              variant="caption"
                              color="text"
                              display="block"
                            >
                              Total a Pagar
                            </MDTypography>
                            <MDTypography
                              variant="h6"
                              fontWeight="bold"
                              color="warning"
                            >
                              {formatPrice(totalPendingSelected)}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      )}
                    </>
                  )}
                </MDBox>
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
                        label="Monto"
                        fullWidth
                        value={amount}
                        onChange={(e) =>
                          setAmount(parseFloat(e.target.value) || 0)
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0 }}
                        helperText={
                          totalPendingSelected > 0
                            ? `Sugerido: ${formatPrice(totalPendingSelected)}`
                            : ""
                        }
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
                        placeholder="Nº de transferencia, cheque, etc."
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Summary */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Resumen
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Proveedor
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {selectedSupplier
                        ? suppliers.find((s) => s._id === selectedSupplier)
                            ?.businessName ||
                          suppliers.find((s) => s._id === selectedSupplier)
                            ?.name
                        : "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Fecha
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {paymentDate || "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Compras Seleccionadas
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {selectedPurchases.length}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Saldo Pendiente
                    </MDTypography>
                    <MDTypography
                      variant="body2"
                      fontWeight="bold"
                      color="warning"
                    >
                      {formatPrice(totalPendingSelected)}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <MDTypography variant="body2" fontWeight="medium">
                      Monto a Pagar
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      color="success"
                    >
                      {formatPrice(amount)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              <MDButton
                variant="gradient"
                color="success"
                fullWidth
                onClick={handleSubmit}
                disabled={
                  isLoadingSuppliers ||
                  isLoadingBuys ||
                  isRegistering ||
                  !selectedSupplier ||
                  selectedPurchases.length === 0 ||
                  !paymentMethod ||
                  amount <= 0
                }
              >
                <Icon>check</Icon>&nbsp;
                {isRegistering ? "Procesando..." : "Confirmar Pago"}
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewPayment;
