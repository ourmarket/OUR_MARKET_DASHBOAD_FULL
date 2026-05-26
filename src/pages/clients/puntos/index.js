/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";

import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";

import { useGetConfigQuery, usePutConfigMutation } from "api/configApi";
import { usePostPointsResetMutation } from "api/pointsApi";

const validationSchema = yup.object().shape({
  pointsPerPesoSpent: yup
    .number()
    .required("Requerido")
    .min(0, "Debe ser mayor o igual a 0"),
  pointsPerReferral: yup
    .number()
    .required("Requerido")
    .min(0, "Debe ser mayor o igual a 0"),
  pointsExpirationDays: yup
    .number()
    .required("Requerido")
    .min(1, "Debe ser al menos 1 día"),
  pointsConversionRate: yup
    .number()
    .required("Requerido")
    .min(1, "Debe ser al menos 1 punto por peso de descuento"),
});

function LoyaltyPointsConfig() {
  const { data: dataConfig, isLoading: lConfig, isError: eConfig, refetch } = useGetConfigQuery();
  const [editConfig, { isLoading: lSave, isError: eSave }] = usePutConfigMutation();
  const [resetPoints, { isLoading: lReset }] = usePostPointsResetMutation();

  const handleResetPoints = async () => {
    Swal.fire({
      title: "¿Estás completamente seguro?",
      text: "Esta acción es irreversible. Se eliminará el historial de puntos acumulados y el saldo de puntos de TODOS los clientes se restablecerá a 0.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, restablecer a 0",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await resetPoints().unwrap();
          if (res.ok) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "¡Puntos restablecidos con éxito!",
              text: "Todos los saldos de clientes han vuelto a 0.",
              showConfirmButton: true,
            });
            refetch();
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error al restablecer puntos",
            text: error?.data?.msg || error?.message || "Ocurrió un error inesperado.",
          });
        }
      }
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pointsPerPesoSpent: dataConfig?.config?.pointsPerPesoSpent ?? 1,
      pointsPerReferral: dataConfig?.config?.pointsPerReferral ?? 500,
      pointsExpirationDays: dataConfig?.config?.pointsExpirationDays ?? 90,
      pointsConversionRate: dataConfig?.config?.pointsConversionRate ?? 10,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await editConfig({ ...values }).unwrap();
        if (res.ok) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Configuración guardada con éxito",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al guardar configuración",
          text: error?.data?.msg || error?.message || "Ocurrió un error.",
        });
      }
    },
  });

  if (lConfig) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} display="flex" justifyContent="center">
          <Loading />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              alignItems="center"
              gap="10px"
            >
              <Icon fontSize="medium" color="inherit">
                loyalty
              </Icon>
              <MDTypography variant="h6" color="white">
                Configuración del Sistema de Puntos de Fidelidad
              </MDTypography>
            </MDBox>
          </Grid>

          {eConfig && (
            <Grid item xs={12}>
              <Box mx={2}>
                <Alert severity="error">
                  No se pudo cargar la configuración del sistema. Por favor intente recargar la página.
                </Alert>
              </Box>
            </Grid>
          )}

          {!eConfig && dataConfig && (
            <>
              {/* Formulario de Configuración */}
              <Grid item xs={12} md={7}>
                <Card sx={{ mx: 2, p: 3 }}>
                  <MDTypography variant="h5" fontWeight="medium" mb={1}>
                    Reglas de Fidelización
                  </MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="regular" mb={3} display="block">
                    Modifica los parámetros para ajustar el cálculo y la expiración de los puntos otorgados a tus clientes.
                  </MDTypography>

                  <Divider />

                  <Box
                    component="form"
                    autoComplete="off"
                    noValidate
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={3}>
                      {/* Puntos por peso gastado */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          name="pointsPerPesoSpent"
                          label="Puntos por Peso Gastado"
                          value={formik.values.pointsPerPesoSpent}
                          error={!!formik.errors.pointsPerPesoSpent}
                          helperText={formik.errors.pointsPerPesoSpent}
                          onChange={formik.handleChange}
                          inputProps={{ min: 0, step: "any" }}
                        />
                        <MDTypography variant="caption" color="text" mt={0.5} display="block" px={1}>
                          Define cuántos puntos gana el cliente por cada $1 gastado en sus compras.
                        </MDTypography>
                      </Grid>

                      {/* Equivalencia de canje */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          name="pointsConversionRate"
                          label="Tasa de Canje (Puntos por $1)"
                          value={formik.values.pointsConversionRate}
                          error={!!formik.errors.pointsConversionRate}
                          helperText={formik.errors.pointsConversionRate}
                          onChange={formik.handleChange}
                          inputProps={{ min: 1 }}
                        />
                        <MDTypography variant="caption" color="text" mt={0.5} display="block" px={1}>
                          Cuántos puntos se necesitan para obtener $1 de descuento (Ej: 10 puntos = $1).
                        </MDTypography>
                      </Grid>

                      {/* Puntos por referido */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          name="pointsPerReferral"
                          label="Puntos por Referido"
                          value={formik.values.pointsPerReferral}
                          error={!!formik.errors.pointsPerReferral}
                          helperText={formik.errors.pointsPerReferral}
                          onChange={formik.handleChange}
                          inputProps={{ min: 0 }}
                        />
                        <MDTypography variant="caption" color="text" mt={0.5} display="block" px={1}>
                          Puntos otorgados al cliente que refiere cuando su recomendado hace su primer compra.
                        </MDTypography>
                      </Grid>

                      {/* Días válidos de los puntos */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          name="pointsExpirationDays"
                          label="Días de Validez"
                          value={formik.values.pointsExpirationDays}
                          error={!!formik.errors.pointsExpirationDays}
                          helperText={formik.errors.pointsExpirationDays}
                          onChange={formik.handleChange}
                          inputProps={{ min: 1 }}
                        />
                        <MDTypography variant="caption" color="text" mt={0.5} display="block" px={1}>
                          Días de vigencia que tienen los puntos antes de caducar.
                        </MDTypography>
                      </Grid>

                      {/* Botón de Guardado */}
                      <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                        <MDButton
                          type="submit"
                          variant="gradient"
                          color="info"
                          disabled={lSave}
                          sx={{
                            px: 4,
                          }}
                        >
                          {lSave ? "Guardando..." : "Guardar Configuración"}
                        </MDButton>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Grid>

              {/* Sección Peligrosa: Restablecimiento */}
              <Grid item xs={12} md={5}>
                <Card sx={{ mx: 2, p: 3, border: "1px solid rgba(244, 67, 54, 0.2)", height: "100%" }}>
                  <MDTypography variant="h5" fontWeight="medium" color="error" mb={1} display="flex" alignItems="center" gap="5px">
                    <Icon fontSize="medium" color="error">warning</Icon>
                    Zona de Peligro
                  </MDTypography>
                  <MDTypography variant="button" color="text" fontWeight="regular" mb={3} display="block">
                    Estas acciones son críticas y alteran directamente los saldos financieros en puntos de tus clientes de manera permanente.
                  </MDTypography>

                  <Divider />

                  <Box display="flex" flexDirection="column" gap="15px" mt={2}>
                    <MDTypography variant="body2" color="text">
                      Al presionar el botón inferior se iniciará un restablecimiento general de puntos. Esto pondrá a <strong style={{ color: "#f44336" }}>cero (0)</strong> la cantidad de puntos acumulada por cada uno de tus clientes registrados.
                    </MDTypography>

                    <Alert severity="warning" sx={{ border: "none", py: 1 }}>
                      Esta acción es permanente e irreversible. No se puede revertir desde el panel de control.
                    </Alert>

                    <Box display="flex" justifyContent="center" mt={2}>
                      <MDButton
                        variant="gradient"
                        color="error"
                        disabled={lReset}
                        onClick={handleResetPoints}
                        sx={{
                          px: 3,
                          py: 1.5,
                          fontWeight: "bold",
                        }}
                      >
                        {lReset ? "Restableciendo..." : "Restablecer todos los puntos a 0"}
                      </MDButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default LoyaltyPointsConfig;
