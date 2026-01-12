import { useState } from "react";
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
import Divider from "@mui/material/Divider";

// Helpers
import { formatPrice } from "utils/formaPrice";

import {
  useCreatePurchaseOrderMutation,
  useChangePurchaseOrderStatusMutation,
} from "api/purchaseOrderApi";
import { useGetSuppliersQuery } from "api/supplierApi";
import { useGetProductsQuery } from "api/productApi";
import { Autocomplete } from "@mui/material";
import Loading from "components/DRLoading";

const NewOrder = () => {
  const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
  const [changeStatus] = useChangePurchaseOrderStatusMutation();

  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    { id: "1", product: null, quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), product: null, quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const buildPayload = (status = "DRAFT") => ({
    supplier: selectedSupplier?._id,
    expectedDate,
    notes,
    status,
    items: items
      .filter((i) => i.product)
      .map((i) => ({
        product: i.product._id,
        nameSnapshot: i.product.name,
        quantityOrdered: i.quantity,
        estimatedUnitCost: i.unitPrice,
      })),
  });

  const handleSaveDraft = async () => {
    const isEmptyDraft = !selectedSupplier && items.every((i) => !i.product);

    if (isEmptyDraft) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Borrador vacío",
        text: "Estás por guardar un borrador sin datos. ¿Deseás continuar?",
        showCancelButton: true,
        confirmButtonText: "Guardar borrador",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#fb8c00",
        cancelButtonColor: "#7b809a",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await createPurchaseOrder(buildPayload("DRAFT")).unwrap();

      Swal.fire({
        icon: "success",
        title: "Borrador guardado",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/compras");
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el borrador",
        icon: "error",
        confirmButtonColor: "#d41f1a",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedSupplier || !expectedDate || items.every((i) => !i.product)) {
      Swal.fire({
        title: "Error",
        text: "Complete todos los campos requeridos",
        icon: "error",
        confirmButtonColor: "#d41f1a",
      });
      return;
    }

    try {
      await createPurchaseOrder(buildPayload("SUBMITTED")).unwrap();

      Swal.fire({
        icon: "success",
        title: "Orden enviada para aprobación",
        confirmButtonColor: "#4CAF50",
      });

      navigate("/compras");
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo enviar la orden",
        icon: "error",
        confirmButtonColor: "#d41f1a",
      });
    }
  };

  const {
    data: suppliersData,
    isLoading: l1,
    error: e1,
  } = useGetSuppliersQuery();
  const {
    data: productsData,
    isLoading: l2,
    error: e2,
  } = useGetProductsQuery({ includeCost: true });

  const loading = l1 || l2;
  const isError = e1 || e2;

  if (loading)
    return (
      <MDBox>
        <Loading />
      </MDBox>
    );
  if (isError)
    return (
      <MDBox>
        <MDTypography variant="h4">Error</MDTypography>
      </MDBox>
    );

  const suppliers = suppliersData?.data.suppliers || [];
  const products = productsData?.products || [];
  console.log(productsData);

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
              Nueva Orden de Compra
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
                / Planificá una nueva compra
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
                    value={selectedSupplier}
                    onChange={(_, newValue) => setSelectedSupplier(newValue)}
                    getOptionLabel={(option) =>
                      option ? option.businessName : ""
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
                </MDBox>
              </Card>

              {/* Items */}
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
                  >
                    <Icon>add</Icon>&nbsp;Agregar Ítem
                  </MDButton>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell width="40%">Descripción</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Precio Unit.</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell width="50px"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Autocomplete
                              options={products}
                              value={item.product}
                              onChange={(_, newValue) => {
                                updateItem(item.id, "product", newValue);
                                if (newValue) {
                                  updateItem(
                                    item.id,
                                    "unitPrice",
                                    newValue.cost || 0
                                  );
                                }
                              }}
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
                              type="number"
                              fullWidth
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unitPrice",
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
                              {formatPrice(item.quantity * item.unitPrice)}
                            </MDTypography>
                          </TableCell>
                          <TableCell>
                            <MDButton
                              variant="text"
                              color="error"
                              iconOnly
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
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
                      Total Estimado
                    </MDTypography>
                    <MDTypography variant="h4" fontWeight="bold">
                      {formatPrice(calculateTotal())}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Notes */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Notas (opcional)
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <TextField
                    multiline
                    rows={3}
                    placeholder="Agregar notas o comentarios..."
                    fullWidth
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    variant="outlined"
                  />
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Expected Date */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Fecha Esperada
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <TextField
                    type="date"
                    fullWidth
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </MDBox>
              </Card>

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
                      {selectedSupplier ? selectedSupplier.businessName : "-"}
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
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="body2" color="text">
                      Fecha Esperada
                    </MDTypography>
                    <MDTypography variant="body2" fontWeight="medium">
                      {expectedDate || "-"}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mb={2}>
                    <MDTypography variant="body2" fontWeight="medium">
                      Total Estimado
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="bold">
                      {formatPrice(calculateTotal())}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Actions */}
              <MDBox display="flex" flexDirection="column" gap={2}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleSubmit}
                >
                  <Icon>send</Icon>&nbsp;Enviar para Aprobación
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="dark"
                  fullWidth
                  onClick={handleSaveDraft}
                >
                  <Icon>save</Icon>&nbsp;Guardar Borrador
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewOrder;
