import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";

// API Hooks (RTK Query)
import {
  useCreateBuyMutation,
  useRegisterBuyPaymentMutation,
} from "api/buyApi";

import Loading from "components/DRLoading";
import { useGetSuppliersQuery } from "api/supplierApi";
import { useGetProductsQuery } from "api/productApi";
import { useGetPurchaseOrderByIdQuery } from "api/purchaseOrderApi";
import { Autocomplete } from "@mui/material";

// Helpers
import { formatPrice } from "utils/formaPrice";

const NewPurchase = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromOrderId = searchParams.get("fromOrder");

  // Mutations
  const [createBuy, { isLoading: isCreating }] = useCreateBuyMutation();
  const [registerBuyPayment] = useRegisterBuyPaymentMutation();

  // Queries
  const {
    data: suppliersData,
    isLoading: l1,
    error: e1,
  } = useGetSuppliersQuery();
  const {
    data: productsData,
    isLoading: l2,
    error: e2,
  } = useGetProductsQuery();
  const { data: orderData, isLoading: l3 } = useGetPurchaseOrderByIdQuery(
    fromOrderId,
    { skip: !fromOrderId }
  );

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [items, setItems] = useState([
    { id: Date.now().toString(), product: null, quantity: 1, unitCost: 0 },
  ]);
  const [registerPayment, setRegisterPayment] = useState(false);
  const [payments, setPayments] = useState([
    { id: Date.now().toString(), method: "", amount: 0, reference: "" },
  ]);

  // Prepopulate from Order
  useEffect(() => {
    if (fromOrderId && orderData?.data && productsData?.products) {
      const order = orderData.data;
      const products = productsData.products;

      // 1. Set Supplier
      setSelectedSupplier(order.supplier);

      // 2. Map Items
      const prepopulatedItems = order.items.map((orderItem) => {
        // Find matching product in our products list to ensure Autocomplete works
        const matchedProduct = products.find(
          (p) => p._id === (orderItem.product?._id || orderItem.product)
        );

        return {
          id: Math.random().toString(36).substr(2, 9),
          product: matchedProduct || orderItem.product,
          quantity: orderItem.quantityOrdered,
          unitCost: orderItem.estimatedUnitCost,
        };
      });

      setItems(prepopulatedItems);
    }
  }, [fromOrderId, orderData, productsData]);

  const addPayment = () => {
    setPayments([
      ...payments,
      { id: Date.now().toString(), method: "", amount: 0, reference: "" },
    ]);
  };

  const removePayment = (id) => {
    if (payments.length > 1) {
      setPayments(payments.filter((p) => p.id !== id));
    }
  };

  const updatePayment = (id, field, value) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculateTotalPayments = () => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), product: null, quantity: 1, unitCost: 0 },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  };

  const total = calculateTotal();

  const handleSubmit = async () => {
    if (!selectedSupplier || !purchaseDate || items.some((i) => !i.product)) {
      Swal.fire(
        "Error",
        "Por favor complete todos los campos requeridos",
        "error"
      );
      return;
    }

    if (registerPayment) {
      if (payments.some((p) => !p.method || p.amount <= 0)) {
        Swal.fire("Error", "Complete todos los datos de los pagos", "error");
        return;
      }
      if (calculateTotalPayments() > total) {
        Swal.fire(
          "Error",
          "El total de los pagos no puede superar el total de la compra",
          "error"
        );
        return;
      }
    }

    try {
      // 1. Crear la Compra (Ajustado al Controlador)
      const buyData = {
        purchaseOrder: fromOrderId || null,
        supplier: selectedSupplier._id, // Enviar el ID del objeto seleccionado
        date: purchaseDate,
        amount: total,
        items: items
          .filter((i) => i.product)
          .map((i) => ({
            product: i.product._id,
            nameSnapshot: i.product.name,
            quantity: i.quantity,
            unitCost: i.unitCost,
          })),
      };

      const result = await createBuy(buyData).unwrap();

      // 2. Si se marcó pago, registrarlo inmediatamente usando el ID de la compra creada
      if (registerPayment) {
        for (const p of payments) {
          await registerBuyPayment({
            id: result._id,
            payment: {
              amount: p.amount,
              paymentMethod: p.method,
              reference: p.reference,
            },
          }).unwrap();
        }
      }

      Swal.fire({
        title: "Compra Registrada",
        text: "La compra ha sido registrada exitosamente .",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/compras");
      });
    } catch (error) {
      Swal.fire(
        "Error",
        error.data?.message || "Ocurrió un error al registrar la compra",
        "error"
      );
    }
  };

  const loading = l1 || l2 || l3;
  const isError = e1 || e2;

  if (loading)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Loading />
        </MDBox>
      </DashboardLayout>
    );

  if (isError)
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
          <MDTypography variant="h4">Error</MDTypography>
          <MDTypography variant="body2" color="text">
            Hubo un error al cargar los datos necesarios.
          </MDTypography>
        </MDBox>
      </DashboardLayout>
    );

  const suppliers = suppliersData?.data.suppliers || [];
  const products = productsData?.products || [];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              Registrar Compra {fromOrderId ? `desde Orden` : ""}
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
                /{" "}
                {fromOrderId
                  ? `Convirtiendo orden ${orderData?.data?.code}`
                  : "Ingreso directo de una compra realizada"}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Proveedor
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        disabled={!!fromOrderId}
                        options={suppliers}
                        value={selectedSupplier}
                        onChange={(_, newValue) =>
                          setSelectedSupplier(newValue)
                        }
                        getOptionLabel={(option) =>
                          option ? option.businessName || option.name : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option._id === value?._id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Seleccionar proveedor"
                            size="small"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        disabled={!!fromOrderId}
                        type="date"
                        label="Fecha de Compra"
                        fullWidth
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              <Card>
                <MDBox
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="h6" fontWeight="medium">
                    Ítems
                  </MDTypography>
                  <MDButton
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={addItem}
                    disabled={!!fromOrderId}
                  >
                    <Icon>add</Icon>&nbsp;Agregar Ítem
                  </MDButton>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell width="40%">
                          Descripción / Producto
                        </TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Costo Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell width="50px"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Autocomplete
                              disabled={!!fromOrderId}
                              options={products}
                              value={item.product}
                              onChange={(_, newValue) =>
                                updateItem(item.id, "product", newValue)
                              }
                              getOptionLabel={(option) =>
                                option ? `${option.name}` : ""
                              }
                              isOptionEqualToValue={(option, value) =>
                                option._id === value?._id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Producto"
                                  size="small"
                                  fullWidth
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled={!!fromOrderId}
                              type="number"
                              fullWidth
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              variant="standard"
                              inputProps={{
                                style: { textAlign: "right" },
                                min: 1,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled={!!fromOrderId}
                              type="number"
                              fullWidth
                              value={item.unitCost}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unitCost",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              variant="standard"
                              inputProps={{
                                style: { textAlign: "right" },
                                min: 0,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography variant="button" fontWeight="medium">
                              {formatPrice(item.quantity * item.unitCost)}
                            </MDTypography>
                          </TableCell>
                          <TableCell>
                            <MDButton
                              variant="text"
                              color="error"
                              iconOnly
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1 || !!fromOrderId}
                            >
                              <Icon>delete</Icon>
                            </MDButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <MDBox p={2} display="flex" justifyContent="flex-end">
                  <MDBox textAlign="right">
                    <MDTypography variant="caption" color="text">
                      Total
                    </MDTypography>
                    <MDTypography variant="h4" fontWeight="bold">
                      {formatPrice(total)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>credit_card</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Registro de Pago (opcional)
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={registerPayment}
                          onChange={(e) => {
                            setRegisterPayment(e.target.checked);
                            if (e.target.checked)
                              setPayments([
                                {
                                  id: Date.now().toString(),
                                  method: "",
                                  amount: total,
                                  reference: "",
                                },
                              ]);
                          }}
                        />
                      }
                      label={
                        <MDTypography variant="body2" color="text">
                          Registrar pago junto con la compra
                        </MDTypography>
                      }
                    />
                  </MDBox>

                  {registerPayment && (
                    <MDBox mt={2}>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <MDTypography variant="h6">
                          Métodos de Pago
                        </MDTypography>
                        <MDButton
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={addPayment}
                          disabled={payments.length >= 4}
                        >
                          <Icon>add</Icon>&nbsp;Agregar Pago
                        </MDButton>
                      </MDBox>
                      {payments.map((p) => (
                        <Grid
                          container
                          spacing={2}
                          key={p.id}
                          mb={2}
                          alignItems="center"
                        >
                          <Grid item xs={12} sm={4}>
                            <Autocomplete
                              options={[
                                "TRANSFER",
                                "CASH",
                                "CHECK",
                                "CREDIT_CARD",
                                "DEBIT_CARD",
                              ].filter(
                                (option) =>
                                  !payments.some(
                                    (pay) =>
                                      pay.method === option && pay.id !== p.id
                                  )
                              )}
                              value={p.method}
                              onChange={(_, newValue) =>
                                updatePayment(p.id, "method", newValue)
                              }
                              getOptionLabel={(option) => {
                                const labels = {
                                  TRANSFER: "Transferencia",
                                  CASH: "Efectivo",
                                  CHECK: "Cheque",
                                  CREDIT_CARD: "Tarjeta de Credito",
                                  DEBIT_CARD: "Tarjeta de Debito",
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
                          <Grid item xs={12} sm={3}>
                            <TextField
                              type="number"
                              label="Monto"
                              fullWidth
                              value={p.amount}
                              onChange={(e) =>
                                updatePayment(
                                  p.id,
                                  "amount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Referencia (opcional)"
                              fullWidth
                              value={p.reference}
                              placeholder="N° de transferencia, cheque, etc."
                              onChange={(e) =>
                                updatePayment(p.id, "reference", e.target.value)
                              }
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <MDButton
                              variant="text"
                              color="error"
                              iconOnly
                              onClick={() => removePayment(p.id)}
                              disabled={payments.length === 1}
                            >
                              <Icon>delete</Icon>
                            </MDButton>
                          </Grid>
                        </Grid>
                      ))}
                    </MDBox>
                  )}
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
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
                      {selectedSupplier?.businessName ||
                        selectedSupplier?.name ||
                        "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Fecha
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {purchaseDate || "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Ítems
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {items.filter((i) => i.product).length}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <MDTypography variant="body2" fontWeight="medium">
                      Total Compra
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="bold">
                      {formatPrice(total)}
                    </MDTypography>
                  </MDBox>

                  {registerPayment && (
                    <>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="body2" color="text">
                          Pago a Registrar
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          fontWeight="bold"
                          color="success"
                        >
                          {formatPrice(calculateTotalPayments())}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" justifyContent="space-between">
                        <MDTypography variant="body2" color="text">
                          Saldo Pendiente
                        </MDTypography>
                        <MDTypography
                          variant="body2"
                          fontWeight="bold"
                          color={
                            total - calculateTotalPayments() > 0
                              ? "warning"
                              : "success"
                          }
                        >
                          {formatPrice(
                            Math.max(0, total - calculateTotalPayments())
                          )}
                        </MDTypography>
                      </MDBox>
                    </>
                  )}
                </MDBox>
              </Card>

              <MDButton
                variant="gradient"
                color="success"
                fullWidth
                onClick={handleSubmit}
                disabled={isCreating}
              >
                <Icon>check</Icon>&nbsp;
                {isCreating ? "Registrando..." : "Confirmar Compra"}
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewPurchase;
