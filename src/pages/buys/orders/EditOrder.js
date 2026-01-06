import { useState, useEffect } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

// Helpers
import { formatPrice } from "utils/formaPrice";

import {
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
} from "api/purchaseOrderApi";
import { useGetSuppliersQuery } from "api/supplierApi";
import { useGetProductsQuery } from "api/productApi";
import { Autocomplete, Box } from "@mui/material";
import Loading from "components/DRLoading";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: orderData,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useGetPurchaseOrderByIdQuery(id);
  const [updatePurchaseOrder, { isLoading: isUpdating }] =
    useUpdatePurchaseOrderMutation();
  const [cancelOrder] = useCancelPurchaseOrderMutation();

  const { data: suppliersData, isLoading: l1 } = useGetSuppliersQuery();
  const { data: productsData, isLoading: l2 } = useGetProductsQuery();

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);

  // Load order data into state
  useEffect(() => {
    if (
      orderData?.data &&
      suppliersData?.data?.suppliers &&
      productsData?.products
    ) {
      const order = orderData.data;
      const suppliers = suppliersData.data.suppliers;
      const products = productsData.products;

      // Find full supplier object
      const matchedSupplier = suppliers.find(
        (s) => s._id === (order.supplier?._id || order.supplier)
      );
      setSelectedSupplier(matchedSupplier || null);

      // Date format YYYY-MM-DD
      if (order.expectedDate) {
        setExpectedDate(
          new Date(order.expectedDate).toISOString().split("T")[0]
        );
      }

      setNotes(order.notes || "");

      // Map items and find full product objects
      const mappedItems = order.items.map((item) => {
        const matchedProduct = products.find(
          (p) => p._id === (item.product?._id || item.product)
        );
        return {
          id: item._id || Math.random().toString(),
          product: matchedProduct || item.product,
          quantity: item.quantityOrdered,
          unitPrice: item.estimatedUnitCost,
        };
      });

      setItems(
        mappedItems.length > 0
          ? mappedItems
          : [
              {
                id: Date.now().toString(),
                product: null,
                quantity: 1,
                unitPrice: 0,
              },
            ]
      );
    }
  }, [orderData, suppliersData, productsData]);

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

  const isComplete =
    selectedSupplier &&
    expectedDate &&
    items.some((i) => i.product && i.quantity > 0);

  const buildPayload = (status = "DRAFT") => ({
    id,
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

  const handleUpdate = async (shouldSubmit = false) => {
    const status = shouldSubmit ? "SUBMITTED" : "DRAFT";

    try {
      await updatePurchaseOrder(buildPayload(status)).unwrap();

      Swal.fire({
        icon: "success",
        title: shouldSubmit
          ? "Orden enviada para aprobación"
          : "Orden actualizada",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/compras");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "No se pudo actualizar la orden",
        icon: "error",
        confirmButtonColor: "#d41f1a",
      });
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Cancelar orden",
      text: "La orden será cancelada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancelar orden",
      cancelButtonText: "Volver",
      confirmButtonColor: "#d41f1a",
      cancelButtonColor: "#7b809a",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelOrder(id).unwrap();

      Swal.fire({
        title: "Cancelada",
        text: "La orden fue cancelada",
        icon: "info",
        confirmButtonColor: "#009fc7",
      });
      navigate("/compras");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.data?.message || "No se pudo cancelar la orden",
        icon: "error",
        confirmButtonColor: "#d41f1a",
      });
    }
  };

  if (isLoadingOrder || l1 || l2) return <Loading />;
  if (orderError)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={3} textAlign="center">
          <MDTypography variant="h5" color="error">
            No se encontró la orden o hubo un error al cargar.
          </MDTypography>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => navigate("/compras")}
            sx={{ mt: 2 }}
          >
            Volver
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );

  const suppliers = suppliersData?.data.suppliers || [];
  const products = productsData?.products || [];

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
              Editar Orden: {orderData?.data?.code}
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
                / Modificando borrador
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <MDButton
                    variant="outlined"
                    color="dark"
                    fullWidth
                    onClick={() => handleUpdate(false)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <>
                        <Icon>save</Icon>&nbsp;Actualizar
                      </>
                    )}
                  </MDButton>
                  <MDButton
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleReject}
                  >
                    <Icon>delete</Icon>&nbsp;Eliminar
                  </MDButton>
                </Box>

                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={() => handleUpdate(true)}
                  disabled={isUpdating || !isComplete}
                >
                  {isUpdating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <>
                      <Icon>send</Icon>&nbsp;Enviar para Aprobación
                    </>
                  )}
                </MDButton>

                {!isComplete && (
                  <MDTypography
                    variant="caption"
                    color="error"
                    textAlign="center"
                    fontWeight="medium"
                  >
                    * Completar proveedor, fecha e ítems para enviar.
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default EditOrder;
