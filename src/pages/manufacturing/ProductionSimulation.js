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
import {
  recipes,
  manufacturingProducts,
  formatCurrency,
  getActiveRecipes,
} from "./mockData";

const ProductionSimulation = () => {
  const navigate = useNavigate();
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [quantityToProduce, setQuantityToProduce] = useState(1);
  const [estimatedDate, setEstimatedDate] = useState("");

  const activeRecipes = getActiveRecipes();

  const simulation = useMemo(() => {
    if (!selectedRecipeId) return null;

    const recipe = recipes.find((r) => r.id === selectedRecipeId);
    if (!recipe) return null;

    const multiplier = quantityToProduce;
    const outputQuantity = recipe.outputQuantity * multiplier;

    const inputs = recipe.inputs.map((input) => {
      const requiredQuantity = input.quantity * multiplier;
      const product = manufacturingProducts.find(
        (p) => p.id === input.productId
      );
      const availableStock = product?.stockAvailable || 0;
      const shortage = Math.max(0, requiredQuantity - availableStock);
      const unitCost = product?.unitCost || 0;
      const totalCost = requiredQuantity * unitCost;

      let status;
      if (availableStock === 0) {
        status = "out_of_stock";
      } else if (shortage > 0) {
        status = "insufficient";
      } else {
        status = "available";
      }

      return {
        productId: input.productId,
        productName: input.product.name,
        requiredQuantity,
        availableStock,
        shortage,
        unit: input.product.unit,
        unitCost,
        totalCost,
        status,
      };
    });

    const totalInputs = inputs.length;
    const inputsWithShortage = inputs.filter(
      (i) => i.status !== "available"
    ).length;
    const viabilityPercent =
      totalInputs > 0
        ? Math.round(((totalInputs - inputsWithShortage) / totalInputs) * 100)
        : 0;

    const estimatedTotalCost = inputs.reduce((acc, i) => acc + i.totalCost, 0);
    const estimatedUnitCost =
      outputQuantity > 0 ? estimatedTotalCost / outputQuantity : 0;

    const canProduce = inputsWithShortage === 0;

    const alerts = [];

    const outOfStockInputs = inputs.filter((i) => i.status === "out_of_stock");
    const insufficientInputs = inputs.filter(
      (i) => i.status === "insufficient"
    );

    if (outOfStockInputs.length > 0) {
      alerts.push({
        type: "error",
        message: `Sin stock: ${outOfStockInputs
          .map((i) => i.productName)
          .join(", ")}`,
      });
    }

    if (insufficientInputs.length > 0) {
      alerts.push({
        type: "warning",
        message: `Stock insuficiente: ${insufficientInputs
          .map(
            (i) =>
              `${i.productName} (faltan ${i.shortage.toFixed(2)} ${i.unit})`
          )
          .join(", ")}`,
      });
    }

    const criticalInputs = inputs.filter((i) => {
      if (i.availableStock === 0) return false;
      const consumptionPercent = (i.requiredQuantity / i.availableStock) * 100;
      return consumptionPercent > 80 && i.status === "available";
    });

    if (criticalInputs.length > 0) {
      alerts.push({
        type: "warning",
        message: `Insumos críticos (consumo >80% del stock): ${criticalInputs
          .map((i) => i.productName)
          .join(", ")}`,
      });
    }

    if (canProduce && alerts.length === 0) {
      alerts.push({
        type: "info",
        message:
          "Todos los insumos están disponibles. La producción puede ejecutarse.",
      });
    }

    return {
      recipe,
      quantityToProduce,
      outputQuantity,
      inputs,
      totalInputs,
      inputsWithShortage,
      viabilityPercent,
      estimatedTotalCost,
      estimatedUnitCost,
      canProduce,
      alerts,
    };
  }, [selectedRecipeId, quantityToProduce]);

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
            badgeContent="Disponible"
            size="xs"
          />
        );
      case "insufficient":
        return (
          <MDBadge
            variant="gradient"
            color="warning"
            badgeContent="Insuficiente"
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
              Evalúe la viabilidad de producción antes de crear una orden
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

        <MDBox mb={3}>
          <Alert severity="info" variant="outlined">
            <MDTypography variant="button" color="info" fontWeight="bold">
              Herramienta de Planeamiento:
            </MDTypography>{" "}
            Esta simulación NO crea órdenes, NO mueve stock y NO impacta costos
            reales. Es exclusivamente para evaluar la viabilidad de producción.
          </Alert>
        </MDBox>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              <Card>
                <MDBox p={3}>
                  <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                    <Icon color="info">assignment</Icon>
                    <MDTypography variant="h6" fontWeight="bold">
                      Selección de Receta
                    </MDTypography>
                  </MDBox>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="recipe-label">Receta</InputLabel>
                    <Select
                      labelId="recipe-label"
                      label="Receta"
                      value={selectedRecipeId}
                      onChange={(e) => setSelectedRecipeId(e.target.value)}
                      sx={{ height: 45 }}
                    >
                      {activeRecipes.map((recipe) => (
                        <MenuItem key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {simulation && (
                    <MDBox p={2} bgColor="grey-100" borderRadius="lg">
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                        textTransform="uppercase"
                      >
                        Producto Resultante
                      </MDTypography>
                      <MDTypography
                        variant="h6"
                        fontWeight="bold"
                        display="block"
                      >
                        {simulation.recipe.outputProduct.name}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Cantidad base: {simulation.recipe.outputQuantity}{" "}
                        {simulation.recipe.outputProduct.unit}
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
              </Card>

              <Card>
                <MDBox p={3}>
                  <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                    <Icon color="info">settings</Icon>
                    <MDTypography variant="h6" fontWeight="bold">
                      Parámetros
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Multiplicador de producción"
                      fullWidth
                      value={quantityToProduce}
                      onChange={(e) =>
                        setQuantityToProduce(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                    />
                  </MDBox>
                  {simulation && (
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="medium"
                    >
                      Producción total estimada: {simulation.outputQuantity}{" "}
                      {simulation.recipe.outputProduct.unit}
                    </MDTypography>
                  )}
                  <MDBox mt={2}>
                    <MDInput
                      type="date"
                      label="Fecha Estimada"
                      fullWidth
                      value={estimatedDate}
                      onChange={(e) => setEstimatedDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </MDBox>
                </MDBox>
              </Card>

              {simulation && (
                <Card>
                  <MDBox p={3}>
                    <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                      <Icon color="info">trending_up</Icon>
                      <MDTypography variant="h6" fontWeight="bold">
                        Costos Estimados
                      </MDTypography>
                    </MDBox>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <MDTypography variant="button" color="text">
                        Total Estimado
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {formatCurrency(simulation.estimatedTotalCost)}
                      </MDTypography>
                    </MDBox>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                    >
                      <MDTypography variant="button" color="text">
                        Costo Unitario
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="bold">
                        {formatCurrency(simulation.estimatedUnitCost)}
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={2}>
                      <Alert
                        severity="warning"
                        variant="outlined"
                        sx={{
                          border: "none",
                          bgcolor: "rgba(255, 152, 0, 0.1)",
                        }}
                      >
                        <MDTypography
                          variant="caption"
                          color="warning"
                          fontWeight="medium"
                        >
                          Costo estimado basado en últimos precios. No
                          representa costo contable real.
                        </MDTypography>
                      </Alert>
                    </MDBox>
                  </MDBox>
                </Card>
              )}
            </MDBox>
          </Grid>

          <Grid item xs={12} lg={8}>
            {!simulation ? (
              <Card
                sx={{
                  height: "100%",
                  minHeight: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MDBox textAlign="center">
                  <Icon
                    sx={{
                      fontSize: "64px !important",
                      color: "grey-300",
                      mb: 2,
                    }}
                  >
                    calculate
                  </Icon>
                  <MDTypography variant="h6" color="secondary">
                    Seleccione una receta para comenzar la simulación
                  </MDTypography>
                </MDBox>
              </Card>
            ) : (
              <MDBox display="flex" flexDirection="column" gap={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 2, textAlign: "center" }}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                      >
                        A PRODUCIR
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {simulation.outputQuantity}{" "}
                        {simulation.recipe.outputProduct.unit}
                      </MDTypography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 2, textAlign: "center" }}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                      >
                        INSUMOS
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="bold">
                        {simulation.totalInputs}
                      </MDTypography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 2, textAlign: "center" }}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                      >
                        FALTANTES
                      </MDTypography>
                      <MDTypography
                        variant="h6"
                        fontWeight="bold"
                        color={
                          simulation.inputsWithShortage > 0
                            ? "error"
                            : "success"
                        }
                      >
                        {simulation.inputsWithShortage}
                      </MDTypography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Card sx={{ p: 2, textAlign: "center" }}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="bold"
                      >
                        % VIABLE
                      </MDTypography>
                      <MDTypography
                        variant="h6"
                        fontWeight="bold"
                        color={
                          simulation.viabilityPercent < 100
                            ? "warning"
                            : "success"
                        }
                      >
                        {simulation.viabilityPercent}%
                      </MDTypography>
                    </Card>
                  </Grid>
                </Grid>

                {simulation.alerts.map((alert, idx) => (
                  <Alert
                    key={idx}
                    severity={alert.type}
                    variant="filled"
                    sx={{ color: "white" }}
                  >
                    {alert.message}
                  </Alert>
                ))}

                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="bold" mb={2}>
                      Detalle de Insumos Requeridos
                    </MDTypography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead sx={{ display: "table-header-group" }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Insumo
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Requerido
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Disponible
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Faltante
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: "bold" }}
                            >
                              Costo Est.
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Estado
                            </TableCell>
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
                                <MDTypography
                                  variant="button"
                                  color={
                                    input.availableStock <
                                    input.requiredQuantity
                                      ? "warning"
                                      : "success"
                                  }
                                >
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
                                  <MDTypography variant="button" color="text">
                                    —
                                  </MDTypography>
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
                    <MDBox
                      mt={3}
                      p={2}
                      bgColor="grey-100"
                      borderRadius="lg"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <MDTypography variant="h6" fontWeight="bold">
                        Total Costo Insumos
                      </MDTypography>
                      <MDTypography variant="h5" fontWeight="bold">
                        {formatCurrency(simulation.estimatedTotalCost)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>

                <MDBox display="flex" justifyContent="flex-end" gap={2}>
                  <MDButton
                    variant="outlined"
                    color="dark"
                    onClick={() => navigate("/manufactura/ordenes")}
                  >
                    CANCELAR
                  </MDButton>
                  <Tooltip
                    title={
                      !simulation.canProduce
                        ? "No se puede crear: hay insumos faltantes"
                        : ""
                    }
                  >
                    <span>
                      <MDButton
                        variant="gradient"
                        color="info"
                        disabled={!simulation.canProduce}
                        onClick={handleCreateOrder}
                      >
                        <Icon sx={{ mr: 1 }}>add_circle</Icon> CREAR ORDEN
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
