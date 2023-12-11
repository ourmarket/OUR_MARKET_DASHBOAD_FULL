import MDBox from "components/MDBox";
import {
  Alert,
  Box,
  Checkbox,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "api/authApi";
import { setCredentials } from "reduxToolkit/authSlice";
import { useDispatch } from "react-redux";
import BasicLayout from "./BasicLayout";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email("Formato incorrecto").required("Requerido"),
  password: yup.string().min(6, "6 caracteres mínimo").required("Requerido"),
});

function Login() {
  const matches = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail_dashboard");
    const storedClientId = localStorage.getItem("rememberedClientId_dashboard");

    if (storedEmail && storedClientId) {
      setRememberMe(true);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: rememberMe
        ? localStorage.getItem("rememberedEmail_dashboard") || ""
        : "",
      clientId: rememberMe
        ? localStorage.getItem("rememberedClientId_dashboard") || ""
        : "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const userData = await login({
          email: values.email,
          clientId: values.clientId,
          password: values.password,
        }).unwrap();
        if (userData) {
          dispatch(setCredentials({ ...userData }));
          navigate("/");

          if (rememberMe) {
            localStorage.setItem("rememberedEmail_dashboard", values.email);
            localStorage.setItem(
              "rememberedClientId_dashboard",
              values.clientId
            );
          } else {
            localStorage.removeItem("rememberedEmail_dashboard");
            localStorage.removeItem("rememberedClientId_dashboard");
          }
        }
        dispatch(setCredentials({ ...userData }));
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    },
    validationSchema: schema,
  });

  return (
    <BasicLayout>
      <Box
        sx={{
          boxShadow: "3px 3px 30px #ccc, -3px -3px 30px #ccc",
          borderRadius: "10px",
          backgroundColor: "#f1f1f1",
          width: `${matches ? "100%" : "95%"}`,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            marginTop: "40px",
            letterSpacing: "4px",
            fontSize: "22px",
          }}
        >
          INGRESAR
        </Typography>

        <MDBox pt={4} pb={3} px={3}>
          {/* form */}
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img
                src="https://ik.imagekit.io/mrprwema7/OurMarket/user_OkKLt0tst%20(1)__K2sUFDZJ.png?updatedAt=1695681678392"
                alt="icono usuario"
                style={{ width: "30px", height: "30px" }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                autoFocus
                value={formik.values.email}
                error={!!formik.errors.email}
                helperText={formik.errors.email}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img
                src="https://ik.imagekit.io/mrprwema7/OurMarket/user_OkKLt0tst%20(1)__K2sUFDZJ.png?updatedAt=1695681678392"
                alt="icono usuario"
                style={{ width: "30px", height: "30px" }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Id del cliente"
                name="clientId"
                value={formik.values.clientId}
                error={!!formik.errors.clientId}
                helperText={formik.errors.clientId}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <img
                src="https://ik.imagekit.io/mrprwema7/OurMarket/password_sMXDhy2rr%20(1)_Z8pTPQmhK.png?updatedAt=1695681678685"
                alt="icono password"
                style={{ width: "30px", height: "30px" }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={!!formik.errors.password}
                helperText={formik.errors.password}
                onChange={formik.handleChange}
              />
            </Box>
            <Box sx={{ marginLeft: "-3px", marginTop: "10px" }}>
              <Checkbox
                value={rememberMe}
                name="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span
                style={{
                  fontSize: "13.5px",
                  color: "#888",
                  marginLeft: "3px",
                }}
              >
                Recordar
              </span>
            </Box>

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                color: "#fff",
              }}
            >
              Enviar
            </LoadingButton>
            {isError && (
              <Alert severity="warning">
                {error.data?.msg || "Ha ocurrido un error"}
              </Alert>
            )}
          </Box>
          {/* form */}
        </MDBox>
      </Box>
    </BasicLayout>
  );
}

export default Login;
