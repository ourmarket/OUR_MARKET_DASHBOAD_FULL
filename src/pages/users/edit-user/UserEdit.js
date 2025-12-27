/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-underscore-dangle */

import { Alert, Box, Grid, MenuItem, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { editUserSchema } from "validations/users/editUserYup";


import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { usePutUserMutation } from "api/userApi";
import { useDispatch } from "react-redux";
import { showFeedback } from "reduxToolkit/uiSlice";

function UserEdit({ listRoles: roles, user: editUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [editUserMutation, { isLoading, isError, error }] =
    usePutUserMutation();

  const formik = useFormik({
    initialValues: {
      name: editUser?.name,
      lastName: editUser?.lastName,
      email: editUser?.email,
      phone: editUser?.phone,
      role: editUser?.role || "",
    },
    onSubmit: async ({ name, lastName, email, password, phone, role }) => {
      const editUserValues = {
        name,
        lastName,
        email,
        phone,
        password,
        role,
      };

      const { data } = await editUserMutation({
        id,
        ...editUserValues,
      }).unwrap();
      if (data) {
        dispatch(
          showFeedback({
            title: "Usuario Editado",
            content:
              "El usuario ha sido editado correctamente.",
            color: "success",
            dateTime: null,
          })
        );
        navigate("/usuarios/lista");
      }
    },
    validationSchema: editUserSchema,
    enableReinitialize: true,
  });

  return (
    <MDBox
      component="form"
      onSubmit={formik.handleSubmit}
      autoComplete="off"
      sx={{ p: 3 }}
    >
      <Grid container spacing={3}>
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Grid item xs={12} md={8}>
          {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
          <Box sx={{ p: 3, mb: 3, borderRadius: "12px" }}>
            <MDBox display="flex" alignItems="center" mb={3}>
              <Icon fontSize="medium" color="info" sx={{ mr: 1 }}>
                person
              </Icon>
              <MDTypography variant="h6" fontWeight="bold">
                Información General
              </MDTypography>
            </MDBox>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Nombre/s"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && !!formik.errors.name}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Apellido"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && !!formik.errors.lastName}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  fullWidth
                  label="Email (Google, Facebook o Apple)"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={
                    (formik.touched.email && !!formik.errors.email) ||
                    !!error?.data?.email
                  }
                  helperText={
                    (formik.touched.email && formik.errors.email) ||
                    error?.data?.email?.msg
                  }
                />
                <Alert
                  severity="info"
                  sx={{ borderRadius: "12px", mt: 2, fontSize: "12px" }}
                >
                  Al cambiar el email, el usuario deberá iniciar sesión
                  nuevamente por Google, Facebook o Apple para validarse en el
                  sistema.
                </Alert>
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 2: CONTACTO Y ROL */}
          <Box sx={{ p: 3, borderRadius: "12px" }}>
            <MDBox display="flex" alignItems="center" mb={3}>
              <Icon fontSize="medium" color="info" sx={{ mr: 1 }}>
                settings
              </Icon>
              <MDTypography variant="h6" fontWeight="bold">
                Configuración de Cuenta
              </MDTypography>
            </MDBox>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={
                    (formik.touched.phone && !!formik.errors.phone) ||
                    !!error?.data?.phone
                  }
                  helperText={
                    (formik.touched.phone && formik.errors.phone) ||
                    error?.data?.phone?.msg
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  select
                  fullWidth
                  label="Rol asignado"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && !!formik.errors.role}
                  helperText={formik.touched.role && formik.errors.role}
                >
                  {roles.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.es}
                    </MenuItem>
                  ))}
                </MDInput>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* COLUMNA DERECHA: ESTADO Y ACCIONES */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #e0e0e0",
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Vista Previa
            </MDTypography>
            <MDBox
              sx={{
                bgcolor: "#f0f2f5",
                borderRadius: "10px",
                py: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px dashed #ced4da",
              }}
            >
              <Icon sx={{ fontSize: "60px !important", color: "#adb5bd" }}>
                account_circle
              </Icon>
              <MDTypography
                variant="button"
                fontWeight="medium"
                color="text"
                mt={1}
              >
                {formik.values.name || "Nombre"}{" "}
                {formik.values.lastName || "Usuario"}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {formik.values.email || "email@ejemplo.com"}
              </MDTypography>
            </MDBox>
          </Box>

          {/* ACCIONES */}
          <MDBox display="flex" flexDirection="column" gap={2}>
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "PROCESANDO..." : "EDITAR USUARIO"}
            </MDButton>

            <MDButton
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate(-1)}
            >
              CANCELAR
            </MDButton>
          </MDBox>

          {isError && (
            <MDBox mt={2}>
              <Alert severity="error" sx={{ fontSize: "12px" }}>
                Error: {error?.data?.msg || "No se pudo editar el usuario"}
              </Alert>
            </MDBox>
          )}
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default UserEdit;
