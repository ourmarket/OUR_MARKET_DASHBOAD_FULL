import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DataGrid } from "@mui/x-data-grid";

// Data and Helpers
import {
  manufacturingProducts,
  recipes,
  getActiveRecipes,
  formatCurrency,
} from "./mockData";
import colors from "assets/theme/base/colors";

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
  const activeRecipes = getActiveRecipes();

  const formik = useFormik({
    initialValues: {
      code: "OP-2024-006",
      productionDate: new Date().toISOString().split("T")[0],
      selectedRecipeId: "",
      observations: "",
      inputs: [{ id: "1", productId: "", quantity: 0 }],
      outputs: [{ id: "1", productId: "", quantity: 0 }],
    },
    validationSchema,
    onSubmit: (values) => {},
  });

  const { values, setFieldValue } = formik;

  const handleLoadRecipe = () => {
    const recipe = recipes.find((r) => r.id === values.selectedRecipeId);
    if (!recipe) {
      Swal.fire("Aviso", "Seleccione una receta primero", "info");
      return;
    }

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
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const calculateTotalInputs = () => {
    return values.inputs.reduce((sum, item) => {
      const p = manufacturingProducts.find(
        (prod) => prod.id === item.productId
      );
      return p ? sum + p.unitCost * item.quantity : sum;
    }, 0);
  };

  const calculateTotalOutputs = () => {
    return values.outputs.reduce((sum, item) => {
      const p = manufacturingProducts.find(
        (prod) => prod.id === item.productId
      );
      return p ? sum + p.unitCost * item.quantity : sum;
    }, 0);
  };

  const totalInsumos = calculateTotalInputs();
  const valorProduccion = calculateTotalOutputs();
  const margenEstimado = valorProduccion - totalInsumos;

  // Costo por Unidad (Total Insumos / Total Cantidad Productos Resultantes)
  const totalQtyProduced = values.outputs.reduce(
    (sum, o) => sum + (o.quantity || 0),
    0
  );
  const costoPorUnidad =
    totalQtyProduced > 0 ? totalInsumos / totalQtyProduced : 0;

  const handleExecute = () => {
    Swal.fire({
      title: "¿Confirmar Producción?",
      text: "Se actualizará el stock inmediatamente",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.info.main,
      confirmButtonText: "SÍ, EJECUTAR",
      cancelButtonText: "CANCELAR",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Éxito", "Producción ejecutada", "success");
        navigate("/manufactura/ordenes");
      }
    });
  };

  const inputColumns = [
    {
      field: "productId",
      headerName: "Producto",
      flex: 2,
      renderCell: ({ row, id }) => {
        const idx = values.inputs.findIndex((i) => i.id === id);
        return (
          <FormControl fullWidth size="small">
            <Select
              value={row.productId}
              onChange={(e) =>
                setFieldValue(`inputs[${idx}].productId`, e.target.value)
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
      headerName: "Stock Disponible",
      flex: 1.2,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        const p = manufacturingProducts.find((p) => p.id === row.productId);
        if (!p) return "-";
        return (
          <MDBadge
            variant="gradient"
            color={row.quantity > p.stockAvailable ? "error" : "success"}
            badgeContent={`${p.stockAvailable} ${p.unit}`}
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
      field: "cost",
      headerName: "Costo",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const p = manufacturingProducts.find((p) => p.id === row.productId);
        return (
          <MDTypography variant="button" fontWeight="medium">
            {p ? formatCurrency(p.unitCost * row.quantity) : "-"}
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
      headerName: "Producto",
      flex: 2,
      renderCell: ({ row, id }) => {
        const idx = values.outputs.findIndex((o) => o.id === id);
        return (
          <FormControl fullWidth size="small">
            <Select
              value={row.productId}
              onChange={(e) =>
                setFieldValue(`outputs[${idx}].productId`, e.target.value)
              }
              sx={{ height: "40px" }}
            >
              {manufacturingProducts
                .filter(
                  (p) =>
                    p.category === "Producto Terminado" ||
                    p.category === "Sub-producto"
                )
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
      field: "cost",
      headerName: "Costo",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const p = manufacturingProducts.find((p) => p.id === row.productId);
        return (
          <MDTypography variant="button" fontWeight="medium">
            {p ? formatCurrency(p.unitCost * row.quantity) : "-"}
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
            const list = values.outputs.filter((o) => o.id !== id);
            setFieldValue(
              "outputs",
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Nueva Orden de Producción
          </MDTypography>
          <MDTypography variant="button" color="text">
            Registro de producción y transformación de materiales
          </MDTypography>
        </MDBox>

        <FormikProvider value={formik}>
          <Grid container spacing={3}>
            {/* IZQUIERDA: Formulario */}
            <Grid item xs={12} lg={8}>
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* 1. Información General */}
                <Card>
                  <MDBox p={3}>
                    <MDBox display="flex" alignItems="center" mb={3} gap={1}>
                      <Icon color="dark">assignment</Icon>
                      <MDTypography variant="h6" fontWeight="bold">
                        Información General
                      </MDTypography>
                    </MDBox>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          label="Código"
                          fullWidth
                          value={values.code}
                          disabled
                        />
                      </Grid>
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
                      <Grid item xs={12}>
                        <MDInput
                          label="Observaciones"
                          multiline
                          rows={3}
                          fullWidth
                          placeholder="Notas adicionales sobre esta producción..."
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
                        Selección de Receta (Opcional)
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" gap={2} alignItems="flex-end">
                      <Grid container spacing={3} sx={{ flex: 1 }}>
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Receta / BOM</InputLabel>
                            <Select
                              label="Receta / BOM"
                              value={values.selectedRecipeId}
                              onChange={(e) =>
                                setFieldValue(
                                  "selectedRecipeId",
                                  e.target.value
                                )
                              }
                              sx={{ height: "45px" }}
                            >
                              <MenuItem value="">
                                <em>Ninguna (Producción Manual)</em>
                              </MenuItem>
                              {activeRecipes.map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                  {r.name} - {r.outputProduct.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <MDButton
                        variant="outlined"
                        color="info"
                        onClick={handleLoadRecipe}
                        sx={{ height: "45px" }}
                      >
                        CARGAR RECETA
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Card>

                {/* 3. Insumos */}
                <Card>
                  <MDBox p={3}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Icon color="error">arrow_downward</Icon>
                        <MDTypography variant="h6" fontWeight="bold">
                          Insumos (Inputs)
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
                        <Icon>add</Icon>&nbsp;AGREGAR
                      </MDButton>
                    </MDBox>
                    <MDBox sx={{ height: "auto", width: "100%" }}>
                      <DataGrid
                        rows={values.inputs}
                        columns={inputColumns}
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </MDBox>
                    <Divider />
                    <MDBox display="flex" justifyContent="flex-end" px={2}>
                      <MDBox textAlign="right">
                        <MDTypography
                          variant="button"
                          color="text"
                          display="block"
                        >
                          Total Insumos
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="bold">
                          {formatCurrency(totalInsumos)}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>

                {/* 4. Resultados */}
                <Card>
                  <MDBox p={3}>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Icon color="success">arrow_upward</Icon>
                        <MDTypography variant="h6" fontWeight="bold">
                          Productos Resultantes (Outputs)
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
                        <Icon>add</Icon>&nbsp;AGREGAR
                      </MDButton>
                    </MDBox>
                    <MDBox sx={{ height: "auto", width: "100%" }}>
                      <DataGrid
                        rows={values.outputs}
                        columns={outputColumns}
                        hideFooter
                        disableSelectionOnClick
                        sx={{ border: "none" }}
                      />
                    </MDBox>
                    <Divider />
                    <MDBox display="flex" justifyContent="flex-end" px={2}>
                      <MDBox textAlign="right">
                        <MDTypography
                          variant="button"
                          color="text"
                          display="block"
                        >
                          Valor Producción
                        </MDTypography>
                        <MDTypography
                          variant="h6"
                          fontWeight="bold"
                          color="success"
                        >
                          {formatCurrency(valorProduccion)}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>

            {/* DERECHA: Resumen */}
            <Grid item xs={12} lg={4}>
              <MDBox display="flex" flexDirection="column" gap={3}>
                <Card sx={{ p: 3 }}>
                  <MDTypography variant="h6" fontWeight="bold" mb={3}>
                    Resumen de Costos
                  </MDTypography>

                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Total Insumos
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="dark"
                    >
                      {formatCurrency(totalInsumos)}
                    </MDTypography>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" mb={3}>
                    <MDTypography variant="button" color="text">
                      Valor Producción
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="success"
                    >
                      {formatCurrency(valorProduccion)}
                    </MDTypography>
                  </MDBox>

                  <Divider />

                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                    mt={1}
                  >
                    <MDTypography variant="h6" fontWeight="bold">
                      Margen Estimado
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      color={margenEstimado >= 0 ? "success" : "error"}
                    >
                      {formatCurrency(margenEstimado)}
                    </MDTypography>
                  </MDBox>

                  <MDBox display="flex" justifyContent="space-between" mb={3}>
                    <MDTypography variant="button" color="text">
                      Costo por Unidad
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="bold"
                      color="dark"
                    >
                      {formatCurrency(costoPorUnidad)}
                    </MDTypography>
                  </MDBox>

                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    size="large"
                    onClick={handleExecute}
                    sx={{ mb: 2 }}
                  >
                    <Icon sx={{ mr: 1 }}>play_circle</Icon> EJECUTAR PRODUCCIÓN
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="dark"
                    fullWidth
                    onClick={() => {
                      Swal.fire(
                        "Borrador",
                        "Orden guardada como borrador",
                        "info"
                      );
                      navigate("/manufactura/ordenes");
                    }}
                  >
                    <Icon sx={{ mr: 1 }}>save</Icon> GUARDAR COMO BORRADOR
                  </MDButton>
                </Card>

                <Card sx={{ p: 2, bgcolor: "grey-100", boxShadow: "none" }}>
                  <MDBox display="flex" gap={1}>
                    <Icon color="info">info</Icon>
                    <MDTypography variant="caption" color="text">
                      Puede guardar como borrador para revisar y ejecutar más
                      tarde, o ejecutar directamente si los datos son correctos.
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
