import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

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
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

// API Hooks
import { useGetProductsQuery } from "api/productApi";
import { useGetActiveBomsQuery } from "api/bomApi";
import {
  useCreateManufacturingOrderMutation,
  useExecuteManufacturingOrderMutation,
  useCloseManufacturingOrderMutation,
} from "api/manufacturingOrderApi";

// Helpers

import colors from "assets/theme/base/colors";
import { formatPrice } from "utils/formaPrice";

/**
 * HOOK DE SIMULACIÓN DE PRODUCCIÓN
 * Realiza cálculos visuales basados en precios actuales.
 */
const useProductionSimulation = (values, products = []) => {
  return useMemo(() => {
    const totalInsumos = values.inputs.reduce((sum, item) => {
      const p = products.find((prod) => prod._id === item.productId);
      const cost = p?.cost || p?.price || 0; // Fallback to price if cost is 0/undefined
      return sum + cost * (item.quantity || 0);
    }, 0);

    const valorProduccion = values.outputs.reduce((sum, item) => {
      const p = products.find((prod) => prod._id === item.productId);
      // For outputs, we usually estimate value based on sales price or cost?
      // Mockup used unitCost. Let's use cost.
      const cost = p?.cost || p?.price || 0;
      return sum + cost * (item.quantity || 0);
    }, 0);

    const totalQtyProduced = values.outputs.reduce(
      (sum, o) => sum + (o.quantity || 0),
      0
    );
    const costoPorUnidad =
      totalQtyProduced > 0 ? totalInsumos / totalQtyProduced : 0;
    const margenEstimado = valorProduccion - totalInsumos;

    return {
      totalInsumos,
      valorProduccion,
      margenEstimado,
      costoPorUnidad,
    };
  }, [values.inputs, values.outputs, products]);
};

const validationSchema = Yup.object().shape({
  productionDate: Yup.string().required("La fecha es requerida"),
  inputs: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required("Requerido"),
        quantity: Yup.number().positive("Mayor a 0").required("Requerido"),
      })
    )
    .min(1, "Al menos un insumo"),
  outputs: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required("Requerido"),
        quantity: Yup.number().positive("Mayor a 0").required("Requerido"),
      })
    )
    .min(1, "Al menos un producto"),
});

const NewProduction = () => {
  const navigate = useNavigate();

  // API Queries
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery({ includeCost: true, limit: 10000 });
  const { data: activeRecipes, isLoading: isLoadingRecipes } =
    useGetActiveBomsQuery();

  // Mutations
  const [createOrder, { isLoading: isCreating }] =
    useCreateManufacturingOrderMutation();
  const [executeOrder, { isLoading: isExecuting }] =
    useExecuteManufacturingOrderMutation();

  const [closeOrder, { isLoading: isClosing }] =
    useCloseManufacturingOrderMutation();

  const products = productsData?.products || [];
  const recipes = activeRecipes || [];

  const formik = useFormik({
    initialValues: {
      code: "AUTOGENERADO",
      productionDate: new Date().toISOString().split("T")[0],
      selectedRecipeId: "",
      observations: "",
      // inputs/outputs structure: { id, productId, quantity }
      inputs: [{ id: "1", productId: "", quantity: 0 }],
      outputs: [{ id: "1", productId: "", quantity: 0 }],
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handled by specific buttons
    },
  });

  const { values, setFieldValue, isValid } = formik;

  // Simulation Hook
  const simulation = useProductionSimulation(values, products);

  const handleLoadRecipe = () => {
    const recipe = recipes.find((r) => r._id === values.selectedRecipeId);
    console.log(recipe);
    if (!recipe) {
      Swal.fire("Aviso", "Seleccione una receta primero", "info");
      return;
    }

    setFieldValue(
      "inputs",
      recipe.inputs.map((input, idx) => ({
        id: (idx + 1).toString(),
        productId: input.product, // Backend returns populated product object
        quantity: input?.quantity || 1,
      }))
    );

    setFieldValue(
      "outputs",
      recipe.outputs.map((output, idx) => ({
        id: (idx + 1).toString(),
        productId: output.product?._id || output.product, // Ensure we get the ID if populated
        quantity: output.expectedQuantity || output.quantity || 1, // Fallback to expectedQuantity from standard BOM
        costPercent: output.costPercent || 0, // Capture cost percentage
      }))
    );

    Swal.fire({
      icon: "success",
      title: "Receta Cargada",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const buildPayload = (status) => ({
    bomId: values.selectedRecipeId || undefined,
    productionDate: values.productionDate,
    notes: values.observations,
    status: "DRAFT", // Backend Create always makes DRAFT
    inputs: values.inputs.map(({ productId, quantity }) => ({
      product: productId,
      quantity,
    })),
    outputs: values.outputs.map(({ productId, quantity, costPercent }) => ({
      product: productId, // Note: Backend createOrder handles outputs only if NO bomId is passed OR if we override?
      // Backend logic: if (bomId) { calculate from BOM } else { use inputs/outputs }
      // If we want to allow modification of BOM derived values, we should probably NOT send bomId if we changed them, OR backend should support overrides.
      // For now, let's send manual inputs/outputs and NO bomId if it's a custom/modified run, OR just send inputs/outputs always and backend uses them if provided?
      // Checking backend service: "if (bomId) { ... } else { if (data.inputs) ... }"
      // So valid strategy: If user modifies loaded recipe, we treat it as manual order (don't send bomId) or we need backend adjustment.
      // Let's assume for this version we send inputs/outputs and omit bomId if we want to enforce WYSIWYG.
      // However, linking to BOM is good for analytics.
      // Let's send NO bomId to ensure exact quantities from form are used, creating a "Manual/Custom" order based on a recipe.
      // TODO: Backend improvement to allow BOM reference + overrides.
      quantity,
      costPercent,
    })),
    // We force using the form values by NOT sending bomId, or we assume backend prefers manual data if present?
    // Backend service says: if (bomId) { ignore manual } else { use manual }.
    // So currently to use form values we MUST NOT send bomId.
    // But we want to track recipe usage.
    // Workaround: We will send null bomId to ensure Form Data is respected.
  });

  /**
   * EJECUCIÓN REAL DE PRODUCCIÓN
   */
  const handleExecute = async () => {
    if (!isValid) {
      Swal.fire(
        "Error",
        "Por favor complete los campos obligatorios y corrija errores",
        "error"
      );
      return;
    }

    // Check negatives or zeros
    if (
      values.inputs.some((i) => i.quantity <= 0) ||
      values.outputs.some((o) => o.quantity <= 0)
    ) {
      Swal.fire("Error", "Las cantidades deben ser mayores a 0", "error");
      return;
    }

    Swal.fire({
      title: "¿EJECUTAR PRODUCCIÓN?",
      html: `
        <div style="text-align: left;">
          <p>Esta acción:</p>
          <ul>
            <li>Descontará insumos del inventario.</li>
            <li>Ingresará los productos resultantes.</li>
            <li><b>Congelará</b> los costos vigentes en este momento.</li>
          </ul>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.success.main,
      confirmButtonText: "SÍ, EJECUTAR AHORA",
      cancelButtonText: "CANCELAR",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 1. Create DRAFT
          // We strip bomId to ensure the exact form values are used (Backen logic limitation workaround)
          const payload = {
            ...buildPayload(),
            bomId: undefined, // Force manual inputs
          };

          const order = await createOrder(payload).unwrap();

          // 2. Execute (Consume insumos)
          await executeOrder(order._id).unwrap();

          // 3. Close (Calcular costos e ingresar productos)
          await closeOrder(order._id).unwrap();

          Swal.fire("Éxito", "Producción finalizada correctamente", "success");
          navigate("/manufactura/ordenes");
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            error?.data?.message || "Ocurrió un error al procesar",
            "error"
          );
        }
      }
    });
  };

  const handleSaveDraft = async () => {
    if (!isValid) return;

    try {
      const payload = {
        ...buildPayload(),
        bomId: undefined, // Force manual inputs
      };
      await createOrder(payload).unwrap();
      Swal.fire("Borrador", "Orden guardada como borrador", "info");
      navigate("/manufactura/ordenes");
    } catch (error) {
      Swal.fire("Error", error?.data?.message || "Error al guardar", "error");
    }
  };

  const inputColumns = [
    {
      field: "productId",
      headerName: "Insumo",
      flex: 2,
      renderCell: ({ row, id }) => {
        const idx = values.inputs.findIndex((i) => i.id === id);
        const selectedProduct =
          products.find((p) => p._id === row.productId) || null;

        return (
          <Autocomplete
            options={products.filter(
              (p) => p.category?.name !== "Producto Terminado"
            )}
            getOptionLabel={(option) => option.name || ""}
            value={selectedProduct}
            onChange={(event, newValue) => {
              setFieldValue(
                `inputs[${idx}].productId`,
                newValue ? newValue._id : ""
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Insumo"
                variant="standard"
              />
            )}
            fullWidth
            size="small"
            isOptionEqualToValue={(option, value) => option._id === value._id}
          />
        );
      },
    },
    {
      field: "stock",
      headerName: "Stock Disp.",
      flex: 1.2,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        const p = products.find((p) => p._id === row.productId);
        if (!p) return "-";
        return (
          <MDBadge
            variant="gradient"
            color={row.quantity > p.stockAvailable ? "error" : "success"}
            badgeContent={`${p.stockAvailable} ${p.unit || "u"}`}
            size="xs"
          />
        );
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      renderCell: ({ row, id }) => {
        const idx = values.inputs.findIndex((i) => i.id === id);
        return (
          <MDInput
            type="number"
            size="small"
            value={row.quantity}
            onChange={(e) =>
              setFieldValue(
                `inputs[${idx}].quantity`,
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      field: "estimatedCost",
      headerName: "Costo Est.",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const p = products.find((p) => p._id === row.productId);
        const cost = p?.cost || p?.price || 0;
        return (
          <MDTypography variant="button" fontWeight="regular">
            {p ? formatPrice(cost * row.quantity) : "-"}
          </MDTypography>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: ({ id }) => (
        <Icon
          sx={{ cursor: "pointer", color: "error.main" }}
          onClick={() => {
            const list = values.inputs.filter((i) => i.id !== id);
            setFieldValue(
              "inputs",
              list.length
                ? list
                : [{ id: Date.now().toString(), productId: "", quantity: 0 }]
            );
          }}
        >
          delete
        </Icon>
      ),
    },
  ];

  const outputColumns = [
    {
      field: "productId",
      headerName: "Producto Final",
      flex: 2,
      renderCell: ({ row, id }) => {
        const idx = values.outputs.findIndex((o) => o.id === id);
        const selectedProduct =
          products.find((p) => p._id === row.productId) || null;

        return (
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name || ""}
            value={selectedProduct}
            onChange={(event, newValue) => {
              setFieldValue(
                `outputs[${idx}].productId`,
                newValue ? newValue._id : ""
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Producto"
                variant="standard"
              />
            )}
            fullWidth
            size="small"
            isOptionEqualToValue={(option, value) => option._id === value._id}
          />
        );
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      renderCell: ({ row, id }) => {
        const idx = values.outputs.findIndex((o) => o.id === id);
        return (
          <MDInput
            type="number"
            size="small"
            value={row.quantity}
            onChange={(e) =>
              setFieldValue(
                `outputs[${idx}].quantity`,
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      field: "unitPrice",
      headerName: "Precio Venta Unit.",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const p = products.find((p) => p._id === row.productId);
        // Use price (selling price) if available, otherwise 0
        const price = p?.price || 0;
        return (
          <MDTypography variant="button" fontWeight="regular" color="text">
            {formatPrice(price)}
          </MDTypography>
        );
      },
    },
    {
      field: "estimatedValue",
      headerName: "Valor Est.",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderHeader: () => (
        <Tooltip
          title="Valor proyectado = Cantidad * (Costo o Precio actual del Producto en el sistema)"
          placement="top"
          arrow
        >
          <MDBox display="flex" alignItems="center" gap={0.5}>
            Valor Est. <Icon fontSize="small">info</Icon>
          </MDBox>
        </Tooltip>
      ),
      renderCell: ({ row }) => {
        const p = products.find((p) => p._id === row.productId);
        const cost = p?.cost || p?.price || 0;
        return (
          <MDTypography variant="button" fontWeight="regular">
            {p ? formatPrice(cost * row.quantity) : "-"}
          </MDTypography>
        );
      },
    },
    {
      field: "unitCost",
      headerName: "Costo Unit. Est.",
      flex: 1.2,
      align: "right",
      headerAlign: "right",
      renderHeader: () => (
        <Tooltip
          title="Costo de producción estimado. Si la receta tiene % asignado: (Insumos * %) / Cantidad. Si no: Prorrateo simple (Insumos / Total Unidades)."
          placement="top"
          arrow
        >
          <MDBox display="flex" alignItems="center" gap={0.5}>
            Costo Unit. Est. <Icon fontSize="small">info</Icon>
          </MDBox>
        </Tooltip>
      ),
      renderCell: ({ row }) => {
        const totalInputCost = simulation.totalInsumos || 0;
        let unitCost = 0;

        if (row.quantity > 0) {
          if (row.costPercent && row.costPercent > 0) {
            // Escenario 1: Receta con Distribución Porcentual
            unitCost =
              (totalInputCost * (row.costPercent / 100)) / row.quantity;
          } else {
            // Escenario 2: Sin Porcentaje (Cálculo Directo / Promedio Ponderado)
            const totalOutputQty = values.outputs.reduce(
              (sum, o) => sum + (o.quantity || 0),
              0
            );
            if (totalOutputQty > 0) {
              unitCost = totalInputCost / totalOutputQty;
            }
          }
        }

        return (
          <MDTypography variant="button" fontWeight="bold" color="info">
            {formatPrice(unitCost)}
            {row.costPercent && row.costPercent > 0 && (
              <span style={{ fontSize: "0.8em", opacity: 0.8, marginLeft: 4 }}>
                ({row.costPercent}%)
              </span>
            )}
          </MDTypography>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: ({ row, id }) => {
        // Disable delete if row has costPercent defined (to maintain cost integrity)
        const isLocked = row.costPercent && row.costPercent > 0;

        return (
          <Tooltip
            title={
              isLocked
                ? "No se puede eliminar porque tiene asignación de costo porcentual"
                : "Eliminar"
            }
          >
            <span>
              <Icon
                sx={{
                  cursor: isLocked ? "not-allowed" : "pointer",
                  color: isLocked ? "text.disabled" : "error.main",
                }}
                onClick={() => {
                  if (isLocked) return;
                  const list = values.outputs.filter((o) => o.id !== id);
                  setFieldValue(
                    "outputs",
                    list.length
                      ? list
                      : [
                          {
                            id: Date.now().toString(),
                            productId: "",
                            quantity: 0,
                          },
                        ]
                  );
                }}
              >
                delete
              </Icon>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  const isLoading =
    isLoadingProducts || isLoadingRecipes || isCreating || isExecuting;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        {isLoading && <LinearProgress color="info" />}
        <MDBox
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Nueva Orden de Producción
            </MDTypography>
            <MDTypography variant="button" color="text">
              Registro de transformación de materiales
            </MDTypography>
          </MDBox>
        </MDBox>

        <FormikProvider value={formik}>
          <Grid container spacing={3}>
            {/* IZQUIERDA: Configuración y Tablas */}
            <Grid item xs={12} lg={8}>
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* 1. Información General */}
                <Card>
                  <MDBox p={3}>
                    <MDBox display="flex" alignItems="center" mb={3} gap={1}>
                      <Icon color="dark">assignment</Icon>
                      <MDTypography variant="h6" fontWeight="bold">
                        Información de la Orden
                      </MDTypography>
                    </MDBox>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          label="Código Interno"
                          fullWidth
                          value={values.code}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          label="Fecha Programada"
                          type="date"
                          fullWidth
                          name="productionDate"
                          value={values.productionDate}
                          onChange={formik.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MDInput
                          label="Observaciones de Producción"
                          multiline
                          rows={2}
                          fullWidth
                          name="observations"
                          value={values.observations}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>

                {/* 2. Selección de Receta */}
                <Card>
                  <MDBox p={3}>
                    <MDBox display="flex" alignItems="center" mb={3} gap={1}>
                      <Icon color="dark">menu_book</Icon>
                      <MDTypography variant="h6" fontWeight="bold">
                        Plantilla / Receta (BOM)
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" gap={2} alignItems="flex-end">
                      <FormControl fullWidth size="small">
                        {/* Autocomplete para Buscar Receta Vigente */}
                        <Autocomplete
                          options={recipes}
                          getOptionLabel={(option) => {
                            // Handle cases where option might be undefined while loading
                            if (!option) return "";
                            return `${option?.name || "Unknown"} (${
                              option?.code || "-"
                            })`;
                          }}
                          value={
                            recipes.find(
                              (r) => r._id === values.selectedRecipeId
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setFieldValue(
                              "selectedRecipeId",
                              newValue ? newValue._id : ""
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Buscar Receta Vigente"
                              variant="standard"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          fullWidth
                        />
                      </FormControl>
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={handleLoadRecipe}
                        sx={{ height: "45px", minWidth: 160 }}
                        disabled={!values.selectedRecipeId}
                      >
                        CARGAR DATOS
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Card>

                {/* 3. Insumos */}
                <Card
                  sx={{
                    borderLeft: "6px solid",
                    borderLeftColor: "error.main",
                  }}
                >
                  <MDBox p={3}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Icon color="error">inventory</Icon>
                        <MDTypography variant="h6" fontWeight="bold">
                          Insumos Requeridos (Consumo)
                        </MDTypography>
                      </MDBox>
                      <MDButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        onClick={() =>
                          setFieldValue("inputs", [
                            ...values.inputs,
                            {
                              id: Date.now().toString(),
                              productId: "",
                              quantity: 0,
                            },
                          ])
                        }
                      >
                        <Icon>add</Icon>&nbsp;AÑADIR LÍNEA
                      </MDButton>
                    </MDBox>
                    <MDBox sx={{ height: "auto", width: "100%" }}>
                      <DataGrid
                        rows={values.inputs}
                        columns={inputColumns}
                        autoHeight
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </MDBox>
                    <Divider />
                    <MDBox display="flex" justifyContent="flex-end" pt={1}>
                      <MDTypography
                        variant="button"
                        color="text"
                        fontWeight="bold"
                      >
                        Subtotal Insumos (Est.):{" "}
                        {formatPrice(simulation.totalInsumos)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>

                {/* 4. Resultados */}
                <Card
                  sx={{
                    borderLeft: "6px solid",
                    borderLeftColor: "success.main",
                  }}
                >
                  <MDBox p={3}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Icon color="success">precision_manufacturing</Icon>
                        <MDTypography variant="h6" fontWeight="bold">
                          Producto Resultante (Ingreso)
                        </MDTypography>
                      </MDBox>
                      <MDButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        onClick={() =>
                          setFieldValue("outputs", [
                            ...values.outputs,
                            {
                              id: Date.now().toString(),
                              productId: "",
                              quantity: 0,
                            },
                          ])
                        }
                      >
                        <Icon>add</Icon>&nbsp;AÑADIR LÍNEA
                      </MDButton>
                    </MDBox>
                    <MDBox sx={{ height: "auto", width: "100%" }}>
                      <DataGrid
                        rows={values.outputs}
                        columns={outputColumns}
                        autoHeight
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </MDBox>
                    <Divider />
                    <MDBox display="flex" justifyContent="flex-end" pt={1}>
                      <MDTypography
                        variant="button"
                        color="success"
                        fontWeight="bold"
                      >
                        Valor Prod. Final (Est.):{" "}
                        {formatPrice(simulation.valorProduccion)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>

            {/* DERECHA: Simulación y Acciones */}
            <Grid item xs={12} lg={4}>
              <MDBox
                display="flex"
                flexDirection="column"
                gap={3}
                position="sticky"
                top={20}
              >
                <Card sx={{ p: 3 }}>
                  <MDBox display="flex" alignItems="center" gap={1} mb={3}>
                    <Icon color="info">analytics</Icon>
                    <MDTypography variant="h6" fontWeight="bold">
                      Simulación de Costos
                    </MDTypography>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Costo Insumos (Est.):
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="dark"
                    >
                      {formatPrice(simulation.totalInsumos)}
                    </MDTypography>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" mb={3}>
                    <MDTypography variant="button" color="text">
                      Valor de Salida (Est.):
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="success"
                    >
                      {formatPrice(simulation.valorProduccion)}
                    </MDTypography>
                  </MDBox>

                  <Divider sx={{ my: 2 }} />

                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="h6" fontWeight="bold">
                      Margen Estimado:
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      color={
                        simulation.margenEstimado >= 0 ? "success" : "error"
                      }
                    >
                      {formatPrice(simulation.margenEstimado) +
                        " (" +
                        (
                          (simulation.margenEstimado /
                            simulation.valorProduccion) *
                          100
                        ).toFixed(2) +
                        "%)"}
                    </MDTypography>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" mb={4}>
                    <MDTypography variant="button" color="text">
                      Costo Unitario Promedio:
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="dark"
                    >
                      {formatPrice(simulation.costoPorUnidad)}
                    </MDTypography>
                  </MDBox>

                  <MDButton
                    variant="gradient"
                    color="success"
                    fullWidth
                    size="large"
                    onClick={handleExecute}
                    sx={{ mb: 2 }}
                    disabled={isLoading || !isValid}
                  >
                    {isExecuting || isClosing || isCreating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <>
                        <Icon sx={{ mr: 1 }}>rocket_launch</Icon> EJECUTAR
                        PRODUCCIÓN
                      </>
                    )}
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="dark"
                    fullWidth
                    onClick={handleSaveDraft}
                    disabled={isLoading || !isValid}
                  >
                    {isCreating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <>
                        <Icon sx={{ mr: 1 }}>save</Icon> GUARDAR BORRADOR
                      </>
                    )}
                  </MDButton>
                </Card>

                <Card sx={{ p: 2, bgcolor: "grey-100", boxShadow: "none" }}>
                  <MDBox display="flex" gap={1}>
                    <Icon color="info">info</Icon>
                    <MDTypography variant="caption" color="text">
                      <b>Nota:</b> Los costos mostrados son promedios simulados.
                      El sistema financiero asignará el costo real basado en el
                      método de valuación (FIFO/LP) al momento del cierre.
                    </MDTypography>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>
          </Grid>
        </FormikProvider>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewProduction;
