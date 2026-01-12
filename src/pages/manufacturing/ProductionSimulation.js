import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";

// Data and Helpers
// Utils
import { formatPrice as formatCurrency } from "utils/formaPrice";
import LinearProgress from "@mui/material/LinearProgress";
import { useGetActiveBomsQuery } from "api/bomApi";
import { useGetProductsQuery } from "api/productApi";

const ProductionSimulation = () => {
  const navigate = useNavigate();
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [quantityToProduce, setQuantityToProduce] = useState(1);
  const [estimatedDate, setEstimatedDate] = useState("");
  const [overriddenOutputs, setOverriddenOutputs] = useState({});

  // Reset overrides when recipe changes
  useMemo(() => {
    setOverriddenOutputs({});
  }, [selectedRecipeId]);

  // API Hooks
  const { data: bomsData, isLoading: isLoadingBoms } = useGetActiveBomsQuery();
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery();

  const activeRecipes = bomsData || [];
  const products = productsData?.products || [];

  const simulation = useMemo(() => {
    if (!selectedRecipeId || !products.length) return null;

    const recipe = activeRecipes.find((r) => r._id === selectedRecipeId);
    if (!recipe) return null;

    const multiplier = quantityToProduce;

    // --- 1. Process Inputs ---
    let totalInputCost = 0;
    const inputs = recipe.inputs.map((input) => {
      const product = products.find(
        (p) => p._id === input.product?._id || p._id === input.product
      );
      const requiredQuantity = input.quantity * multiplier;
      // FIX: Use 'stockAvailable' from product model (fallback to 'stock' if backend projection changed)
      const availableStock = product?.stockAvailable ?? product?.stock ?? 0;

      const shortage = Math.max(0, requiredQuantity - availableStock);
      const unitCost =
        product?.cost || product?.averageCost || product?.price || 0;
      // Note: Ideally backend provides precise cost. For now using product.cost or price.
      const totalCost = requiredQuantity * unitCost;

      totalInputCost += totalCost;

      let status;
      if (availableStock === 0) {
        status = "out_of_stock";
      } else if (shortage > 0) {
        status = "insufficient";
      } else {
        status = "available";
      }

      return {
        productId: product?._id,
        productName: product?.name || "Desconocido",
        requiredQuantity,
        availableStock,
        shortage,
        unit: product?.unit || "u",
        unitCost,
        totalCost,
        status,
      };
    });

    // --- 2. Process Outputs & Financials ---
    let totalPotentialSales = 0;
    const outputs = (recipe.outputs || []).map((output) => {
      const product = products.find(
        (p) => p._id === output.product?._id || p._id === output.product
      );

      const productId = product?._id;
      let expectedQuantity = 0;

      if (overriddenOutputs[productId] !== undefined) {
        expectedQuantity = parseFloat(overriddenOutputs[productId]) || 0;
      } else {
        expectedQuantity = (output.expectedQuantity || 0) * multiplier;
      }

      const sellingPrice = product?.price || 0;
      const potentialSales = expectedQuantity * sellingPrice;

      const costPercent = output.costPercent || 0; // % of total input cost assigned to this product
      const allocatedCost = totalInputCost * (costPercent / 100);
      const estimatedUnitCost =
        expectedQuantity > 0 ? allocatedCost / expectedQuantity : 0;

      totalPotentialSales += potentialSales;

      return {
        productId: product?._id,
        productName: product?.name || "Desconocido",
        expectedQuantity,
        baseExpected: (output.expectedQuantity || 0) * multiplier,
        unit: product?.unit || "u",
        sellingPrice,
        potentialSales,
        costPercent,
        allocatedCost,
        estimatedUnitCost,
      };
    });

    // If no outputs defined in array, maybe check recipe.product (legacy/simple model)
    if (outputs.length === 0 && recipe.product) {
      // ... (Similar logic if needed, but assuming outputs array based on model)
    }

    // --- 3. KPIs ---

    // Inputs Analysis
    const totalInputsCount = inputs.length;
    const inputsWithShortage = inputs.filter(
      (i) => i.status !== "available"
    ).length;

    // Viability
    const canProduce = inputsWithShortage === 0;
    const viabilityPercent =
      totalInputsCount > 0
        ? Math.round(
            ((totalInputsCount - inputsWithShortage) / totalInputsCount) * 100
          )
        : 0;

    // Financials
    const estimatedGrossMargin = totalPotentialSales - totalInputCost;
    const estimatedGrossMarginPercent =
      totalPotentialSales > 0
        ? (estimatedGrossMargin / totalPotentialSales) * 100
        : 0;

    // --- 4. Alerts ---
    const alerts = [];
    if (inputs.some((i) => i.status === "out_of_stock")) {
      alerts.push({
        type: "error",
        message: "Hay insumos sin stock. No se puede producir.",
      });
    } else if (inputs.some((i) => i.status === "insufficient")) {
      alerts.push({
        type: "warning",
        message: "Stock insuficiente para la cantidad solicitada.",
      });
    } else {
      alerts.push({ type: "info", message: "Todos los insumos disponibles." });
    }

    return {
      recipe,
      inputs,
      outputs,
      totalInputsCount,
      inputsWithShortage,
      viabilityPercent,
      canProduce,
      alerts,
      financials: {
        totalInputCost,
        totalPotentialSales,
        estimatedGrossMargin,
        estimatedGrossMarginPercent,
      },
    };
  }, [
    selectedRecipeId,
    quantityToProduce,
    activeRecipes,
    products,
    overriddenOutputs,
  ]);

  const handleOutputChange = (productId, value) => {
    setOverriddenOutputs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleCreateOrder = () => {
    navigate(
      `/manufactura/nueva?recipeId=${selectedRecipeId}&quantity=${quantityToProduce}`
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return (
          <MDBadge
            variant="gradient"
            color="success"
            badgeContent="OK"
            size="xs"
          />
        );
      case "insufficient":
        return (
          <MDBadge
            variant="gradient"
            color="warning"
            badgeContent="Falta"
            size="xs"
          />
        );
      case "out_of_stock":
        return (
          <MDBadge
            variant="gradient"
            color="error"
            badgeContent="Sin Stock"
            size="xs"
          />
        );
      default:
        return null;
    }
  };

  if (isLoadingBoms || isLoadingProducts) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <LinearProgress color="info" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Simulación de Producción
            </MDTypography>
            <MDTypography variant="button" color="text">
              Proyección de costos, insumos y rentabilidad
            </MDTypography>
          </MDBox>
          <MDButton
            variant="outlined"
            color="dark"
            onClick={() => navigate("/manufactura/ordenes")}
          >
            <Icon sx={{ mr: 1 }}>arrow_back</Icon> VOLVER
          </MDButton>
        </MDBox>

        <Grid container spacing={3}>
          {/* LEFT COLUMN: Controls & Recipe Selection */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Configuración
                  </MDTypography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="recipe-label">Receta / Proceso</InputLabel>
                    <Select
                      labelId="recipe-label"
                      label="Receta / Proceso"
                      value={selectedRecipeId}
                      onChange={(e) => setSelectedRecipeId(e.target.value)}
                      sx={{ height: 45 }}
                    >
                      {activeRecipes.map((recipe) => (
                        <MenuItem key={recipe._id} value={recipe._id}>
                          {recipe.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <MDInput
                    type="number"
                    label="Cantidad de Ejecuciones (Batch)"
                    fullWidth
                    value={quantityToProduce}
                    onChange={(e) =>
                      setQuantityToProduce(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    helperText="Multiplicador de la receta base"
                  />
                </MDBox>
              </Card>

              {simulation && (
                <Card>
                  <MDBox p={3}>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      mb={2}
                      color={
                        simulation.financials.estimatedGrossMargin >= 0
                          ? "success"
                          : "error"
                      }
                    >
                      Rentabilidad Estimada
                    </MDTypography>

                    <MDBox display="flex" justifyContent="space-between" mb={1}>
                      <MDTypography variant="button" color="text">
                        Venta Potencial Total:
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="bold">
                        {formatCurrency(
                          simulation.financials.totalPotentialSales
                        )}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" justifyContent="space-between" mb={1}>
                      <MDTypography variant="button" color="text">
                        Costo Insumos Total:
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        fontWeight="bold"
                        color="error"
                      >
                        -{formatCurrency(simulation.financials.totalInputCost)}
                      </MDTypography>
                    </MDBox>
                    <Divider />
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <MDTypography variant="h6">Margen:</MDTypography>
                      <MDBox textAlign="right">
                        <MDTypography
                          variant="h6"
                          color={
                            simulation.financials.estimatedGrossMargin >= 0
                              ? "success"
                              : "error"
                          }
                        >
                          {formatCurrency(
                            simulation.financials.estimatedGrossMargin
                          )}
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color={
                            simulation.financials.estimatedGrossMargin >= 0
                              ? "success"
                              : "error"
                          }
                        >
                          {simulation.financials.estimatedGrossMarginPercent.toFixed(
                            2
                          )}
                          %
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>
              )}
            </MDBox>
          </Grid>

          {/* RIGHT COLUMN: Results Details */}
          <Grid item xs={12} lg={8}>
            {!simulation ? (
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                }}
              >
                <MDTypography variant="h6" color="secondary">
                  Seleccione una receta para calcular
                </MDTypography>
              </Card>
            ) : (
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* ALERTS */}
                {simulation.alerts.map((alert, idx) => (
                  <Alert key={idx} severity={alert.type}>
                    {alert.message}
                  </Alert>
                ))}

                {/* OUTPUTS TABLE */}
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="bold" mb={2}>
                      Productos Resultantes (Salidas)
                    </MDTypography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right">Cant. Est.</TableCell>
                            <TableCell align="right">Precio Venta</TableCell>
                            <TableCell align="right">Total Venta</TableCell>
                            <TableCell align="right">Distrib. Costo</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {simulation.outputs.map((out) => (
                            <TableRow key={out.productId}>
                              <TableCell>
                                <MDTypography
                                  variant="button"
                                  fontWeight="medium"
                                >
                                  {out.productName}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right" style={{ width: 140 }}>
                                <MDInput
                                  type="number"
                                  size="small"
                                  value={out.expectedQuantity}
                                  onChange={(e) =>
                                    handleOutputChange(
                                      out.productId,
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <MDTypography
                                        variant="caption"
                                        color="text"
                                      >
                                        {out.unit}
                                      </MDTypography>
                                    ),
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography variant="button">
                                  {formatCurrency(out.sellingPrice)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography
                                  variant="button"
                                  fontWeight="bold"
                                  color="success"
                                >
                                  {formatCurrency(out.potentialSales)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography variant="button" display="block">
                                  {out.costPercent}%
                                </MDTypography>
                                <MDTypography variant="caption" color="text">
                                  ({formatCurrency(out.allocatedCost)})
                                </MDTypography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MDBox>
                </Card>

                {/* INPUTS TABLE */}
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="bold" mb={2}>
                      Insumos Requeridos
                    </MDTypography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Insumo</TableCell>
                            <TableCell align="right">Requerido</TableCell>
                            <TableCell align="right">Disponible</TableCell>
                            <TableCell align="right">Faltante</TableCell>
                            <TableCell align="right">Costo Est.</TableCell>
                            <TableCell align="center">Estado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {simulation.inputs.map((input) => (
                            <TableRow key={input.productId}>
                              <TableCell>
                                <MDTypography
                                  variant="button"
                                  fontWeight="medium"
                                >
                                  {input.productName}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography variant="button">
                                  {input.requiredQuantity.toFixed(2)}{" "}
                                  {input.unit}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography variant="button">
                                  {input.availableStock.toFixed(2)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                {input.shortage > 0 ? (
                                  <MDTypography
                                    variant="button"
                                    color="error"
                                    fontWeight="bold"
                                  >
                                    {input.shortage.toFixed(2)}
                                  </MDTypography>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <MDTypography variant="button">
                                  {formatCurrency(input.totalCost)}
                                </MDTypography>
                              </TableCell>
                              <TableCell align="center">
                                {getStatusBadge(input.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MDBox>
                </Card>

                <MDBox display="flex" justifyContent="flex-end">
                  <Tooltip
                    title={
                      !simulation.canProduce
                        ? "Resuelva las faltas de stock primero"
                        : ""
                    }
                  >
                    <span>
                      <MDButton
                        variant="gradient"
                        color="info"
                        disabled={!simulation.canProduce}
                        onClick={handleCreateOrder}
                        size="large"
                      >
                        <Icon sx={{ mr: 1 }}>check</Icon>
                        Proceder a Producción
                      </MDButton>
                    </span>
                  </Tooltip>
                </MDBox>
              </MDBox>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ProductionSimulation;
