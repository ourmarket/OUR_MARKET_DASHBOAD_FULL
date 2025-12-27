import { useNavigate } from "react-router-dom";
import { Alert, Grid, Card, MenuItem, Icon, Box } from "@mui/material";
import { useFormik } from "formik";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput"; // Usamos MDInput para consistencia de tema

// Data & Logic
import { creteUserSchema } from "validations/users/createUserYup";
import { usePostUserMutation } from "api/userApi";
import { showFeedback } from "reduxToolkit/uiSlice";
import { useDispatch } from "react-redux";

function UserCreate({ roles }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createUser, { isLoading, isError, error }] = usePostUserMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
    },
    validationSchema: creteUserSchema,
    onSubmit: async (values) => {
      try {
        const res = await createUser(values).unwrap();
        if (res.ok) {
          dispatch(
            showFeedback({
              title: "Usuario Creado",
              content: "El usuario ha sido creado correctamente.",
              color: "success",
              dateTime: null,
            })
          );
          navigate("/usuarios/lista");
        }
      } catch (err) {
        console.error(err);
      }
    },
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
                  La cuenta se validará cuando el usuario inicie sesión por
                  primera vez utilizando Google, Facebook o Apple.
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
              {isLoading ? "PROCESANDO..." : "CREAR USUARIO"}
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
                Error: {error?.data?.msg || "No se pudo crear el usuario"}
              </Alert>
            </MDBox>
          )}
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default UserCreate;
