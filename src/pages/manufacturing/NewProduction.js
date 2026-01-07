import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik, FieldArray, FormikProvider } from "formik";
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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

// Data and Helpers
import {
  manufacturingProducts,
  recipes,
  getActiveRecipes,
  formatCurrency,
} from "./mockData";
import colors from "assets/theme/base/colors";

// Validation Schema
const validationSchema = Yup.object().shape({
  productionDate: Yup.string().required("La fecha es requerida"),
  inputs: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required("Requerido"),
        quantity: Yup.number()
          .positive("Debe ser mayor a 0")
          .required("Requerido"),
      })
    )
    .min(1, "Debe tener al menos un insumo"),
  outputs: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required("Requerido"),
        quantity: Yup.number()
          .positive("Debe ser mayor a 0")
          .required("Requerido"),
      })
    )
    .min(1, "Debe tener al menos un producto resultante"),
});

const NewProduction = () => {
  const navigate = useNavigate();
  const activeRecipes = getActiveRecipes();

  const formik = useFormik({
    initialValues: {
      productionDate: new Date().toISOString().split("T")[0],
      selectedRecipeId: "",
      observations: "",
      inputs: [{ id: "1", productId: "", quantity: 0 }],
      outputs: [{ id: "1", productId: "", quantity: 0 }],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handled by specific manual buttons to distinguish draft vs execution
    },
  });

  const { values, setFieldValue, errors, touched } = formik;

  // Load Recipe Logic
  const handleLoadRecipe = (recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    setFieldValue("selectedRecipeId", recipeId);
    setFieldValue(
      "inputs",
      recipe.inputs.map((input, idx) => ({
        id: (idx + 1).toString(),
        productId: input.productId,
        quantity: input.quantity,
      }))
    );

    setFieldValue("outputs", [
      {
        id: "1",
        productId: recipe.outputProduct.id,
        quantity: recipe.outputQuantity,
      },
    ]);

    Swal.fire({
      icon: "success",
      title: "Receta Cargada",
      text: `Parámetros de "${recipe.name}" aplicados`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Calculations
  const calculateTotalInputCost = () => {
    return values.inputs.reduce((sum, item) => {
      const product = manufacturingProducts.find(
        (p) => p.id === item.productId
      );
      return product ? sum + product.unitCost * item.quantity : sum;
    }, 0);
  };

  const calculateTotalOutputCost = () => {
    return values.outputs.reduce((sum, item) => {
      const product = manufacturingProducts.find(
        (p) => p.id === item.productId
      );
      return product ? sum + product.unitCost * item.quantity : sum;
    }, 0);
  };

  const totalInputCost = calculateTotalInputCost();
  const totalOutputCost = calculateTotalOutputCost();
  const estimatedMargin = totalOutputCost - totalInputCost;

  const handleExecute = () => {
    if (!formik.isValid || values.inputs.length === 0) {
      Swal.fire(
        "Error",
        "Por favor complete todos los campos obligatorios",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "¿Ejecutar Producción?",
      html: `
        <div style="text-align: left; font-size: 0.9rem;">
          <p>Esta acción generará los movimientos de stock correspondientes:</p>
          <p>• Egreso de Insumos: <b style="color:red">${formatCurrency(
            totalInputCost
          )}</b></p>
          <p>• Ingreso de Productos: <b style="color:green">${formatCurrency(
            totalOutputCost
          )}</b></p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.info.main,
      confirmButtonText: "EJECUTAR",
      cancelButtonText: "CANCELAR",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Éxito", "Producción realizada correctamente", "success");
        navigate("/manufactura/ordenes");
      }
    });
  };

  // Table Columns
  const inputColumns = [
    {
      field: "productId",
      headerName: "Insumo",
      flex: 2,
      renderCell: ({ row, id }) => {
        const index = values.inputs.findIndex((i) => i.id === id);
        return (
          <FormControl fullWidth size="small">
            <Select
              value={row.productId}
              onChange={(e) =>
                setFieldValue(`inputs[${index}].productId`, e.target.value)
              }
              sx={{ height: "40px" }}
            >
              {manufacturingProducts
                .filter((p) => p.category !== "Producto Terminado")
                .map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      renderCell: ({ row }) => {
        const product = manufacturingProducts.find(
          (p) => p.id === row.productId
        );
        if (!product) return "-";
        const hasWarning = row.quantity > product.stockAvailable;
        return (
          <MDBadge
            variant="gradient"
            color={hasWarning ? "error" : "success"}
            badgeContent={`${product.stockAvailable} ${product.unit}`}
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
        const index = values.inputs.findIndex((i) => i.id === id);
        return (
          <MDInput
            type="number"
            size="small"
            value={row.quantity}
            onChange={(e) =>
              setFieldValue(
                `inputs[${index}].quantity`,
                parseFloat(e.target.value) || 0
              )
            }
            sx={{ width: "100%" }}
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      width: 50,
      renderCell: ({ id }) => (
        <Icon
          sx={{ cursor: "pointer", color: "error.main" }}
          onClick={() => {
            const newInputs = values.inputs.filter((item) => item.id !== id);
            setFieldValue(
              "inputs",
              newInputs.length > 0
                ? newInputs
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
        const index = values.outputs.findIndex((o) => o.id === id);
        return (
          <FormControl fullWidth size="small">
            <Select
              value={row.productId}
              onChange={(e) =>
                setFieldValue(`outputs[${index}].productId`, e.target.value)
              }
              sx={{ height: "40px" }}
            >
              {manufacturingProducts.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      renderCell: ({ row, id }) => {
        const index = values.outputs.findIndex((o) => o.id === id);
        return (
          <MDInput
            type="number"
            size="small"
            value={row.quantity}
            onChange={(e) =>
              setFieldValue(
                `outputs[${index}].quantity`,
                parseFloat(e.target.value) || 0
              )
            }
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "",
      width: 50,
      renderCell: ({ id }) => (
        <Icon
          sx={{ cursor: "pointer", color: "error.main" }}
          onClick={() => {
            const newOutputs = values.outputs.filter((item) => item.id !== id);
            setFieldValue(
              "outputs",
              newOutputs.length > 0
                ? newOutputs
                : [{ id: Date.now().toString(), productId: "", quantity: 0 }]
            );
          }}
        >
          delete
        </Icon>
      ),
    },
  ];

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
              Nueva Producción
            </MDTypography>
            <MDTypography variant="button" color="text">
              Registro y transformación de materiales
            </MDTypography>
          </MDBox>
          <MDButton
            variant="outlined"
            color="dark"
            component={Link}
            to="/manufactura/ordenes"
          >
            VOLVER
          </MDButton>
        </MDBox>

        <FormikProvider value={formik}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* Cabecera */}
                <Card>
                  <MDBox p={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          label="Fecha de Producción"
                          type="date"
                          fullWidth
                          name="productionDate"
                          value={values.productionDate}
                          onChange={formik.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Receta (Opcional)</InputLabel>
                          <Select
                            value={values.selectedRecipeId}
                            onChange={(e) => handleLoadRecipe(e.target.value)}
                            label="Receta (Opcional)"
                            sx={{ height: "45px" }}
                          >
                            <MenuItem value="">
                              <em>Ninguna (Producción Manual)</em>
                            </MenuItem>
                            {activeRecipes.map((r) => (
                              <MenuItem key={r.id} value={r.id}>
                                {r.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <MDInput
                          label="Observaciones"
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

                {/* Tabla Insumos */}
                <Card>
                  <MDBox p={3}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <MDTypography
                        variant="h6"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Icon color="error">arrow_downward</Icon> Insumos
                        Consumidos
                      </MDTypography>
                      <MDButton
                        variant="text"
                        color="info"
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
                        <Icon>add</Icon>&nbsp;AGREGAR
                      </MDButton>
                    </MDBox>
                    <MDBox sx={{ height: 350, width: "100%" }}>
                      <DataGrid
                        rows={values.inputs}
                        columns={inputColumns}
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </MDBox>
                  </MDBox>
                </Card>

                {/* Tabla Resultados */}
                <Card>
                  <MDBox p={3}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <MDTypography
                        variant="h6"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Icon color="success">arrow_upward</Icon> Productos
                        Generados
                      </MDTypography>
                      <MDButton
                        variant="text"
                        color="info"
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
                        <Icon>add</Icon>&nbsp;AGREGAR
                      </MDButton>
                    </MDBox>
                    <MDBox sx={{ height: 250, width: "100%" }}>
                      <DataGrid
                        rows={values.outputs}
                        columns={outputColumns}
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </MDBox>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>

            {/* Sidebar Resumen */}
            <Grid item xs={12} lg={4}>
              <MDBox display="flex" flexDirection="column" gap={3}>
                <Card sx={{ p: 3 }}>
                  <MDTypography variant="h6" mb={2}>
                    Resumen Económico
                  </MDTypography>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Costo Insumos
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="medium"
                      color="error"
                    >
                      -{formatCurrency(totalInputCost)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Valor Producción
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="medium"
                      color="success"
                    >
                      +{formatCurrency(totalOutputCost)}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mb={3}>
                    <MDTypography variant="h6">Margen</MDTypography>
                    <MDTypography
                      variant="h6"
                      color={estimatedMargin >= 0 ? "success" : "error"}
                    >
                      {formatCurrency(estimatedMargin)}
                    </MDTypography>
                  </MDBox>

                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    size="large"
                    onClick={handleExecute}
                  >
                    <Icon sx={{ mr: 1 }}>play_circle</Icon> EJECUTAR
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="dark"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      Swal.fire("Éxito", "Borrador guardado", "info");
                      navigate("/manufactura/ordenes");
                    }}
                  >
                    <Icon sx={{ mr: 1 }}>save</Icon> GUARDAR BORRADOR
                  </MDButton>
                </Card>

                <Alert
                  severity="info"
                  sx={{
                    "& .MuiAlert-icon": { color: "white !important" },
                    bgcolor: "info.main",
                    color: "white",
                  }}
                >
                  <MDTypography
                    variant="caption"
                    color="white"
                    fontWeight="regular"
                  >
                    Al ejecutar esta orden, el stock de los productos se
                    actualizará automáticamente en el inventario.
                  </MDTypography>
                </Alert>
              </MDBox>
            </Grid>
          </Grid>
        </FormikProvider>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewProduction;
