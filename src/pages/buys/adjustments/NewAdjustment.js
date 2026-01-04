import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

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
import Autocomplete from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";

// Utils & Data
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";
import { purchases } from "../mockData";

const adjustmentTypes = [
  { value: "shortage", label: "Faltante" },
  { value: "damage", label: "Daño" },
  { value: "price", label: "Diferencia de Precio" },
  { value: "bonus", label: "Bonificación" },
];

const NewAdjustment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buyId = searchParams.get("buy");

  // Filter purchase from mock data
  const purchase = useMemo(() => {
    return buyId
      ? purchases.find((p) => p.id === buyId || p._id === buyId)
      : null;
  }, [buyId]);

  const [adjustmentType, setAdjustmentType] = useState(null);
  const [observations, setObservations] = useState("");
  const [items, setItems] = useState(
    purchase?.items?.map((item) => ({
      itemId: item.id || item._id,
      description: item.description || item.nameSnapshot,
      maxQuantity: item.quantity,
      quantity: 0,
      unitAmount: item.unitCost,
    })) || []
  );

  if (!purchase) {
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
          <MDTypography variant="body2" color="text" mb={3}>
            Debes acceder desde el detalle de una compra para registrar un
            ajuste.
          </MDTypography>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => navigate("/compras")}
          >
            Volver a Compras
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  const updateItemQuantity = (itemId, val) => {
    const qty = parseInt(val) || 0;
    setItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, quantity: Math.min(Math.max(0, qty), item.maxQuantity) }
          : item
      )
    );
  };

  const updateItemAmount = (itemId, val) => {
    const amount = parseFloat(val) || 0;
    setItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, unitAmount: Math.max(0, amount) }
          : item
      )
    );
  };

  const adjustedItems = items.filter((item) => item.quantity > 0);
  const totalAdjustment = adjustedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
  );

  const canSubmit =
    adjustmentType && adjustedItems.length > 0 && totalAdjustment > 0;

  const handleSubmit = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Confirmar ajuste?",
      html: `
        <p>Estás por registrar un ajuste de <b style="color: #f44336;">${formatPrice(
          totalAdjustment
        )}</b>.</p>
        <p style="font-size: 0.8rem; color: #7b809a;">Este monto reducirá el saldo pendiente de la compra.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      // Logic to save (mutation would go here)
      Swal.fire({
        title: "¡Ajuste registrado!",
        text: "El saldo de la compra ha sido actualizado.",
        icon: "success",
      });
      navigate(`/compras/detalle1/${purchase.id || purchase._id}`);
    }
  };

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
              Registrar Ajuste
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDButton
                variant="text"
                color="info"
                size="small"
                onClick={() =>
                  navigate(`/compras/detalle1/${purchase.id || purchase._id}`)
                }
                sx={{ pl: 0, textTransform: "none" }}
              >
                <Icon>arrow_back</Icon>&nbsp;Volver a la compra
              </MDButton>
              <MDTypography variant="button" color="text" ml={1}>
                / Crédito del proveedor
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Purchase Summary */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>receipt_long</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Compra Asociada
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        Nº Compra
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        display="block"
                        fontWeight="medium"
                      >
                        {purchase.purchaseNumber || purchase.code}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        Proveedor
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        display="block"
                        fontWeight="medium"
                      >
                        {purchase.supplier?.name ||
                          purchase.supplier?.businessName}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        Fecha
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        display="block"
                        fontWeight="medium"
                      >
                        {dateToLocalDate(purchase.date)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        Total Compra
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        display="block"
                        fontWeight="medium"
                      >
                        {formatPrice(purchase.totalAmount || purchase.total)}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>

              {/* Adjustment Type Selection */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>category</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Tipo de Ajuste
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <Autocomplete
                    options={adjustmentTypes}
                    getOptionLabel={(option) => option.label}
                    value={adjustmentType}
                    onChange={(_, newValue) => setAdjustmentType(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seleccionar motivo"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </MDBox>
              </Card>

              {/* Items Table */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>list_alt</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ítems Afectados
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Comprado</TableCell>
                        <TableCell align="right" width="120px">
                          Cant. Ajuste
                        </TableCell>
                        <TableCell align="right" width="150px">
                          Monto Unit.
                        </TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.itemId}>
                          <TableCell>
                            <MDTypography variant="button" fontWeight="medium">
                              {item.description}
                            </MDTypography>
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography variant="button">
                              {item.maxQuantity}
                            </MDTypography>
                          </TableCell>
                          <TableCell align="right">
                            <MDInput
                              type="number"
                              size="small"
                              value={item.quantity || ""}
                              onChange={(e) =>
                                updateItemQuantity(item.itemId, e.target.value)
                              }
                              inputProps={{
                                min: 0,
                                max: item.maxQuantity,
                                style: { textAlign: "right" },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <MDInput
                              type="number"
                              size="small"
                              value={item.unitAmount || ""}
                              onChange={(e) =>
                                updateItemAmount(item.itemId, e.target.value)
                              }
                              inputProps={{
                                min: 0,
                                style: { textAlign: "right" },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <MDTypography
                              variant="button"
                              fontWeight="bold"
                              color={item.quantity > 0 ? "error" : "text"}
                            >
                              {item.quantity > 0
                                ? formatPrice(
                                    -(item.quantity * item.unitAmount)
                                  )
                                : "-"}
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Observations */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>comment</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Observaciones
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Escriba el motivo del ajuste (ej. daño en transporte, bonificación especial)..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                  />
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
                    Resumen del Ajuste
                  </MDTypography>
                </MDBox>
                <MDBox p={2} pt={0}>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Tipo
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {adjustmentType?.label || "-"}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Ítems ajustados
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {adjustedItems.length}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mt={1}>
                    <MDTypography variant="button" fontWeight="bold">
                      Total Crédito
                    </MDTypography>
                    <MDTypography variant="h6" fontWeight="bold" color="error">
                      {formatPrice(-totalAdjustment)}
                    </MDTypography>
                  </MDBox>
                  <MDTypography
                    variant="caption"
                    color="text"
                    display="block"
                    mt={1}
                    sx={{ fontStyle: "italic" }}
                  >
                    Este crédito se aplicará automáticamente al saldo pendiente
                    de la compra.
                  </MDTypography>
                </MDBox>
              </Card>

              {/* Warning Notice */}
              <MDBox
                bgColor="error"
                variant="gradient"
                borderRadius="lg"
                p={2}
                display="flex"
                alignItems="flex-start"
              >
                <Icon sx={{ color: "#fff", mr: 1 }}>warning</Icon>
                <MDBox>
                  <MDTypography
                    variant="button"
                    color="white"
                    fontWeight="bold"
                    display="block"
                  >
                    Acción Irreversible
                  </MDTypography>
                  <MDTypography
                    variant="caption"
                    color="white"
                    sx={{ opacity: 0.8 }}
                  >
                    Una vez confirmado, el ajuste no podrá editarse y afectará
                    legalmente el saldo con el proveedor.
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                <Icon>check</Icon>&nbsp;Confirmar Ajuste
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewAdjustment;
