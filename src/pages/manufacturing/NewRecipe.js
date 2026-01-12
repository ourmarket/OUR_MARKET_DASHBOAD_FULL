import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import { DataGrid } from "@mui/x-data-grid";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

// API
import { useGetProductsQuery } from "api/productApi";
import {
  useCreateBomMutation,
  useUpdateBomMutation,
  useGetBomByIdQuery,
} from "api/bomApi";

// Utils
import { formatPrice } from "utils/formaPrice";

const NewRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditing = !!id;

  // Toggle States
  const [advancedMode, setAdvancedMode] = useState(false);
  const [useEstimatedQuantities, setUseEstimatedQuantities] = useState(false);

  // API Hooks
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetProductsQuery({ includeCost: true });
  const products = productsData?.products || [];

  const { data: existingRecipe, isLoading: isLoadingRecipe } =
    useGetBomByIdQuery(id, { skip: !isEditing });

  const [createBom, { isLoading: isCreating }] = useCreateBomMutation();
  const [updateBom, { isLoading: isUpdating }] = useUpdateBomMutation();

  // Initial Values & State Initialization
  const initialValues = useMemo(() => {
    if (existingRecipe) {
      // Map existing outputs
      const mappedOutputs =
        existingRecipe.outputs?.map((o) => ({
          id: Math.random().toString(36).substr(2, 9),
          productId: o.product?._id || o.product,
          expectedQuantity: o.expectedQuantity || 1, // Default to 1 for UI, but toggle determines if sent
          costPercent: o.costPercent || 0,
        })) || [];

      // Legacy fallback
      if (existingRecipe.product && mappedOutputs.length === 0) {
        mappedOutputs.push({
          id: Math.random().toString(36).substr(2, 9),
          productId: existingRecipe.product?._id || existingRecipe.product,
          expectedQuantity: existingRecipe.yieldQuantity || 1,
          costPercent: 100, // Legacy implies 100% to main
        });
      }

      // Determine Switch States based on data
      // Check if ANY output has a relevant expectedQuantity (different from null/default if stored as such)
      // The backend returns null if not set. If we see numbers implies it was set.
      const hasQuantities =
        existingRecipe.outputs?.some(
          (o) => o.expectedQuantity !== null && o.expectedQuantity !== undefined
        ) ?? existingRecipe.yieldQuantity != null;
      if (hasQuantities) setUseEstimatedQuantities(true);

      // Check if ANY output has costPercent > 0
      const hasPercent = existingRecipe.outputs?.some((o) => o.costPercent > 0);
      if (hasPercent) setAdvancedMode(true);

      return {
        code: existingRecipe.code || "",
        name: existingRecipe.name || "",
        description: existingRecipe.notes || "",
        isActive: existingRecipe.isActive,
        outputs: mappedOutputs,
        inputs: existingRecipe.inputs.map((i) => ({
          id: Math.random().toString(36).substr(2, 9),
          productId: i.product?._id || i.product,
          quantity: i.quantity,
        })),
      };
    }

    // Default New
    return {
      code: "",
      name: "",
      description: "",
      isActive: true,
      outputs: [
        {
          id: Math.random().toString(36).substr(2, 9),
          productId: "",
          expectedQuantity: 1,
          costPercent: 0,
        },
      ],
      inputs: [
        {
          id: Math.random().toString(36).substr(2, 9),
          productId: "",
          quantity: 1,
        },
      ],
    };
  }, [existingRecipe]);

  const validationSchema = Yup.object({
    // code: Yup.string().required("El código es obligatorio"), // Removed
    name: Yup.string().required("El nombre es obligatorio"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Prepare payload
      const inputsPayload = values.inputs.map((i) => ({
        product: i.productId,
        quantity: i.quantity,
      }));

      // Outputs Logic: Respect Toggles
      const outputsPayload = values.outputs.map((o) => ({
        product: o.productId,
        // Send quantity only if enabled
        expectedQuantity: useEstimatedQuantities ? o.expectedQuantity : null,
        // Send percent only if enabled
        costPercent: advancedMode ? o.costPercent : null,
      }));

      const mainProductId = values.outputs[0]?.productId;

      if (!mainProductId) {
        Swal.fire(
          "Error",
          "Debe definir al menos un producto de salida.",
          "error"
        );
        return;
      }

      // Percent Validation (User friendly)
      if (advancedMode) {
        const totalPercent = values.outputs.reduce(
          (acc, curr) => acc + (parseFloat(curr.costPercent) || 0),
          0
        );
        if (Math.abs(totalPercent - 100) > 0.1) {
          const confirm = await Swal.fire({
            title: "Advertencia de Costos",
            text: `Los porcentajes suman ${totalPercent}%. ¿Desea guardar sin que sumen 100%?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Corregir",
          });
          if (!confirm.isConfirmed) return;
        }
      }

      const payload = {
        // code: values.code, // Backend generates it on create
        name: values.name,
        product: mainProductId,
        inputs: inputsPayload,
        outputs: outputsPayload,
        notes: values.description,
        isActive: values.isActive,
        yieldQuantity: useEstimatedQuantities
          ? values.outputs[0]?.expectedQuantity
          : null,
      };

      try {
        if (isEditing) {
          await updateBom({ id, ...payload }).unwrap();
        } else {
          await createBom(payload).unwrap();
        }
        Swal.fire("Éxito", "Receta guardada correctamente", "success");
        navigate("/manufactura/recetas");
      } catch (error) {
        Swal.fire("Error", error?.data?.message || "Error al guardar", "error");
      }
    },
  });

  const { values, setFieldValue, handleSubmit, handleChange, touched, errors } =
    formik;
  const productsList = products; // alias

  // Real-time Calculations
  const calculations = useMemo(() => {
    const totalInputCost = values.inputs.reduce((acc, item) => {
      const p = productsList.find((prod) => prod._id === item.productId);
      const cost = p ? p.cost || p.price || 0 : 0;
      return acc + cost * item.quantity;
    }, 0);

    // Estimate Output Value ONLY if quantities are enabled
    let estimatedOutputValue = 0;
    if (useEstimatedQuantities) {
      estimatedOutputValue = values.outputs.reduce((acc, item) => {
        const p = productsList.find((prod) => prod._id === item.productId);
        const val = p ? p.price || p.cost || 0 : 0;
        return acc + val * (item.expectedQuantity || 0);
      }, 0);
    }

    const margin = estimatedOutputValue - totalInputCost;
    // If no estimated value, margin makes little sense, maybe hide or show -100%
    const marginPercent =
      totalInputCost > 0 ? (margin / totalInputCost) * 100 : 0;

    return { totalInputCost, estimatedOutputValue, margin, marginPercent };
  }, [values.inputs, values.outputs, useEstimatedQuantities, productsList]);

  const inputColumns = [
    {
      field: "productId",
      headerName: "Insumo (Origen)",
      flex: 2,
      renderCell: ({ row }) => {
        const index = values.inputs.findIndex((i) => i.id === row.id);
        if (index === -1) return null;
        return (
          <Autocomplete
            options={productsList}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            value={productsList.find((p) => p._id === row.productId) || null}
            onChange={(e, newVal) =>
              setFieldValue(
                `inputs.${index}.productId`,
                newVal ? newVal._id : ""
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Buscar insumo..."
                fullWidth
              />
            )}
            fullWidth
            disableClearable
          />
        );
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad Req.",
      flex: 0.8,
      renderCell: ({ row }) => {
        const index = values.inputs.findIndex((i) => i.id === row.id);
        const p = productsList.find((prod) => prod._id === row.productId);
        return (
          <MDBox display="flex" alignItems="center" gap={1}>
            <MDInput
              type="number"
              value={row.quantity}
              onChange={(e) =>
                setFieldValue(
                  `inputs.${index}.quantity`,
                  parseFloat(e.target.value) || 0
                )
              }
              size="small"
            />
            <MDTypography variant="caption">{p?.unit || "u"}</MDTypography>
          </MDBox>
        );
      },
    },
    {
      field: "subtotal",
      renderHeader: () => (
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="caption" fontWeight="bold" color="secondary">
            COSTO EST.
          </MDTypography>
          <Tooltip
            title="Cálculo basado en el costo de la última compra (FIFO) o el costo base definido en el producto."
            placement="top"
            arrow
          >
            <Icon
              fontSize="small"
              sx={{ ml: 0.5, cursor: "help", opacity: 0.7 }}
            >
              help_outline
            </Icon>
          </Tooltip>
        </MDBox>
      ),
      flex: 1,
      renderCell: ({ row }) => {
        const p = productsList.find((prod) => prod._id === row.productId);

        return (
          <MDTypography variant="caption">
            {formatPrice((p?.cost || 0) * row.quantity)}
          </MDTypography>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: ({ row }) => (
        <MDButton
          iconOnly
          color="error"
          variant="text"
          onClick={() => {
            setFieldValue(
              "inputs",
              values.inputs.filter((i) => i.id !== row.id)
            );
          }}
        >
          <Icon>delete</Icon>
        </MDButton>
      ),
    },
  ];

  const outputColumns = [
    {
      field: "productId",
      headerName: "Producto (Destino)",
      flex: 2,
      renderCell: ({ row }) => {
        const index = values.outputs.findIndex((i) => i.id === row.id);
        if (index === -1) return null;
        return (
          <Autocomplete
            options={productsList}
            getOptionLabel={(option) => `${option.name}`}
            value={productsList.find((p) => p._id === row.productId) || null}
            onChange={(e, newVal) =>
              setFieldValue(
                `outputs.${index}.productId`,
                newVal ? newVal._id : ""
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Buscar producto..."
                fullWidth
              />
            )}
            fullWidth
            disableClearable
          />
        );
      },
    },
    {
      field: "expectedQuantity",
      headerName: "Cant. Estimada",
      flex: 1,
      renderCell: ({ row }) => {
        const index = values.outputs.findIndex((i) => i.id === row.id);
        const p = productsList.find((prod) => prod._id === row.productId);
        return (
          <MDBox display="flex" alignItems="center" gap={1}>
            <MDInput
              type="number"
              value={row.expectedQuantity}
              onChange={(e) =>
                setFieldValue(
                  `outputs.${index}.expectedQuantity`,
                  parseFloat(e.target.value) || 0
                )
              }
              size="small"
            />
            <MDTypography variant="caption">{p?.unit || "u"}</MDTypography>
          </MDBox>
        );
      },
    },
    {
      field: "costPercent",
      headerName: "% Costo",
      flex: 0.8,
      renderCell: ({ row }) => {
        const index = values.outputs.findIndex((i) => i.id === row.id);
        return (
          <MDInput
            type="number"
            value={row.costPercent}
            onChange={(e) =>
              setFieldValue(
                `outputs.${index}.costPercent`,
                parseFloat(e.target.value) || 0
              )
            }
            size="small"
            InputProps={{ endAdornment: "%" }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: ({ row }) => (
        <MDButton
          iconOnly
          color="error"
          variant="text"
          onClick={() => {
            setFieldValue(
              "outputs",
              values.outputs.filter((i) => i.id !== row.id)
            );
          }}
        >
          <Icon>delete</Icon>
        </MDButton>
      ),
    },
  ];

  if (isLoadingRecipe || (isEditing && !existingRecipe)) {
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
      <MDBox pt={4} pb={3}>
        <MDBox
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              {isEditing ? "Editar Receta" : "Nueva Receta"}
            </MDTypography>
            <MDTypography variant="button" color="text">
              Transformación, Destace y Producción
            </MDTypography>
          </MDBox>
          <MDButton
            variant="outlined"
            color="dark"
            onClick={() => navigate("/manufactura/recetas")}
          >
            VOLVER
          </MDButton>
        </MDBox>

        <FormikProvider value={formik}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* Information */}
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="bold" mb={2}>
                      Información General
                    </MDTypography>

                    <MDBox display="flex" gap={2} mb={2}>
                      {isEditing && (
                        <MDBox flex={1}>
                          <MDInput
                            label="Código"
                            fullWidth
                            value={values.code}
                            disabled
                          />
                        </MDBox>
                      )}
                      <MDBox flex={2}>
                        <MDInput
                          label="Nombre de Receta"
                          fullWidth
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </MDBox>
                    </MDBox>

                    <MDInput
                      label="Notas / Descripción"
                      multiline
                      rows={2}
                      fullWidth
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                    />
                    <MDBox mt={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.isActive}
                            onChange={(e) =>
                              setFieldValue("isActive", e.target.checked)
                            }
                          />
                        }
                        label={`Estado: ${
                          values.isActive ? "ACTIVA" : "INACTIVA"
                        }`}
                      />
                    </MDBox>
                  </MDBox>
                </Card>
                {/* Inputs Section */}
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
                      <MDTypography
                        variant="h6"
                        fontWeight="bold"
                        color="error"
                      >
                        Insumos Requeridos (Entrada)
                      </MDTypography>
                      <MDButton
                        size="small"
                        variant="gradient"
                        color="info"
                        onClick={() => {
                          setFieldValue("inputs", [
                            ...values.inputs,
                            { id: Math.random(), productId: "", quantity: 1 },
                          ]);
                        }}
                      >
                        <Icon>add</Icon>&nbsp;AGREGAR
                      </MDButton>
                    </MDBox>
                    <div style={{ height: "auto", width: "100%" }}>
                      <DataGrid
                        rows={values.inputs}
                        columns={inputColumns}
                        autoHeight
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </div>
                  </MDBox>
                </Card>

                {/* Outputs Section */}
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
                      mb={1}
                    >
                      <MDTypography
                        variant="h6"
                        fontWeight="bold"
                        color="success"
                      >
                        Productos Resultantes (Salida)
                      </MDTypography>
                      <MDButton
                        size="small"
                        variant="gradient"
                        color="success"
                        onClick={() => {
                          setFieldValue("outputs", [
                            ...values.outputs,
                            {
                              id: Math.random(),
                              productId: "",
                              expectedQuantity: 1,
                              costPercent: 0,
                            },
                          ]);
                        }}
                      >
                        <Icon>add</Icon>&nbsp;AGREGAR
                      </MDButton>
                    </MDBox>

                    <MDBox mb={3}>
                      <MDTypography
                        variant="caption"
                        color="text"
                        display="block"
                        mb={2}
                      >
                        <Icon
                          fontSize="inherit"
                          sx={{ verticalAlign: "text-bottom" }}
                        >
                          info
                        </Icon>
                        &nbsp; Los pesos finales pueden variar por merma,
                        humedad o descongelado. Podés cargar valores estimados o
                        definirlos al producir.
                      </MDTypography>

                      <MDBox display="flex" gap={3} flexWrap="wrap">
                        {/* Toggle 1: Cantidades Estimadas */}
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <Switch
                            checked={useEstimatedQuantities}
                            onChange={(e) =>
                              setUseEstimatedQuantities(e.target.checked)
                            }
                          />
                          <MDBox>
                            <MDBox display="flex" alignItems="center">
                              <MDTypography
                                variant="button"
                                fontWeight="regular"
                                display="block"
                              >
                                Usar cantidades estimadas
                              </MDTypography>
                              <Tooltip
                                title="Define la cantidad de producto que esperas obtener habitualmente. Se usa para calcular el rendimiento y pre-cargar las órdenes de producción."
                                placement="top"
                                arrow
                              >
                                <Icon
                                  fontSize="small"
                                  color="action"
                                  sx={{ ml: 0.5, cursor: "help" }}
                                >
                                  help_outline
                                </Icon>
                              </Tooltip>
                            </MDBox>
                            <MDBadge
                              color={
                                useEstimatedQuantities ? "info" : "secondary"
                              }
                              variant="gradient"
                              size="xs"
                              content={
                                useEstimatedQuantities
                                  ? "CON ESTIMACIONES"
                                  : "SIN ESTIMACIONES"
                              }
                            />
                          </MDBox>
                        </MDBox>

                        {/* Toggle 2: Costo Avanzado */}
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <Switch
                            checked={advancedMode}
                            onChange={(e) => setAdvancedMode(e.target.checked)}
                          />
                          <MDBox>
                            <MDBox display="flex" alignItems="center">
                              <MDTypography
                                variant="button"
                                fontWeight="regular"
                                display="block"
                              >
                                Opciones Avanzadas (% Costo)
                              </MDTypography>
                              <Tooltip
                                placement="right"
                                arrow
                                title={
                                  <MDBox p={1}>
                                    <MDTypography
                                      variant="subtitle2"
                                      fontWeight="bold"
                                      color="white"
                                      gutterBottom
                                    >
                                      ¿Cómo funciona el %?
                                    </MDTypography>

                                    <MDTypography
                                      variant="caption"
                                      color="white"
                                      display="block"
                                      gutterBottom
                                    >
                                      El porcentaje se calcula sobre el valor
                                      base actual del producto.
                                    </MDTypography>

                                    <MDTypography
                                      variant="caption"
                                      fontWeight="bold"
                                      color="white"
                                      display="block"
                                      gutterBottom
                                    >
                                      Tené en cuenta:
                                    </MDTypography>

                                    <ul
                                      style={{ margin: 0, paddingLeft: "16px" }}
                                    >
                                      <li>
                                        <MDTypography
                                          variant="caption"
                                          color="white"
                                        >
                                          Se aplica para prorratear el costo
                                          total de producción.
                                        </MDTypography>
                                      </li>
                                      <li>
                                        <MDTypography
                                          variant="caption"
                                          color="white"
                                        >
                                          La suma ideal debe ser 100%.
                                        </MDTypography>
                                      </li>
                                    </ul>

                                    <MDTypography
                                      variant="caption"
                                      color="white"
                                      display="block"
                                      sx={{ mt: 1 }}
                                    >
                                      <strong>Ejemplo:</strong>
                                      <br />
                                      Costo Total: $1.000
                                      <br />
                                      Producto A (80%): Asigna $800
                                      <br />
                                      Producto B (20%): Asigna $200
                                    </MDTypography>
                                  </MDBox>
                                }
                              >
                                <Icon
                                  fontSize="small"
                                  color="action"
                                  sx={{ ml: 0.5, cursor: "pointer" }}
                                >
                                  help_outline
                                </Icon>
                              </Tooltip>
                            </MDBox>
                            <MDBadge
                              color={advancedMode ? "warning" : "success"}
                              variant="gradient"
                              size="xs"
                              content={
                                advancedMode
                                  ? "COSTO MANUAL"
                                  : "COSTO AUTOMÁTICO"
                              }
                            />
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    </MDBox>

                    <div style={{ height: "auto", width: "100%" }}>
                      <DataGrid
                        rows={values.outputs}
                        columns={outputColumns}
                        autoHeight
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                        columnVisibilityModel={{
                          expectedQuantity: useEstimatedQuantities,
                          costPercent: advancedMode,
                        }}
                      />
                    </div>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>

            {/* Sidebar Summary */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ position: "sticky", top: 20 }}>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="bold" mb={3}>
                    Resumen
                  </MDTypography>

                  {useEstimatedQuantities && (
                    <>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="button">
                          Costo Insumos:
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="bold">
                          {formatPrice(calculations.totalInputCost)}
                        </MDTypography>
                      </MDBox>
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="button">
                          Valor Producción Est.:
                        </MDTypography>
                        <MDTypography
                          variant="button"
                          fontWeight="bold"
                          color="success"
                        >
                          {formatPrice(calculations.estimatedOutputValue)}
                        </MDTypography>
                      </MDBox>
                      <Divider />
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <MDTypography variant="button" fontWeight="bold">
                          Margen Est.:
                        </MDTypography>
                        <MDTypography
                          variant="h6"
                          fontWeight="bold"
                          color={calculations.margin >= 0 ? "success" : "error"}
                        >
                          {formatPrice(calculations.margin)}
                        </MDTypography>
                      </MDBox>
                    </>
                  )}

                  {!useEstimatedQuantities && (
                    <MDAlert color="info" sx={{ mt: 2, mb: 0 }}>
                      <MDTypography variant="caption" color="white">
                        Al no definir cantidades estimadas, no es posible
                        calcular márgenes proyectados.
                      </MDTypography>
                    </MDAlert>
                  )}

                  <MDBox mt={4}>
                    <MDButton
                      fullWidth
                      variant="gradient"
                      color="info"
                      onClick={handleSubmit}
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating
                        ? "GUARDANDO..."
                        : "GUARDAR RECETA"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </FormikProvider>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewRecipe;
