/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-underscore-dangle */

import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { creteUserSchema } from "validations/users/createUserYup";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { useSelector } from "react-redux";
import { usePostUserMutation } from "api/userApi";
import Swal from "sweetalert2";

function UserCreate({ roles }) {
  const navigate = useNavigate();
  const { superUser } = useSelector((store) => store.auth);

  const [createUser, { isLoading, isError, error }] = usePostUserMutation();

  console.log(error);

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "",
    },
    onSubmit: async ({ name, lastName, email, password, phone, role }) => {
      const data = {
        name,
        lastName,
        email,
        phone,
        password,
        role,
        verified: true,
        superUser,
      };

      const res = await createUser(data).unwrap();
      if (res.ok) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Usuario creado",
          showConfirmButton: false,
          timer: 2000,
        });

        navigate("/usuarios/lista");
      }
    },
    validationSchema: creteUserSchema,
  });

  return (
    <MDBox pt={6} pb={3}>
      <Box
        sx={{
          display: "flex",
          gap: 5,
        }}
      >
        <Box
          component="form"
          autoComplete="off"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1, mx: 2, display: "flex", gap: 3, width: "100%" }}
        >
          <Box sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              autoFocus
              label="Nombre/s"
              name="name"
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Apellido"
              error={!!formik.errors.lastName}
              helperText={formik.errors.lastName}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              error={!!formik.errors.email || error?.data?.email?.msg}
              helperText={formik.errors.email || error?.data?.email?.msg}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Telefono"
              error={!!formik.errors.phone || error?.data?.phone?.msg}
              helperText={formik.errors.phone || error?.data?.phone?.msg}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              select
              name="role"
              fullWidth
              label="Rol"
              value={formik.values.role}
              error={!!formik.errors.role}
              helperText={formik.errors.role}
              onChange={formik.handleChange}
            >
              {roles.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.es}
                </MenuItem>
              ))}
            </TextField>
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

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                mr: 2,
                backgroundColor: `${colors.info.main}`,
                color: "white !important",
              }}
            >
              Crear
            </LoadingButton>
            <MDButton
              variant="outlined"
              color="info"
              onClick={() => navigate(-1)}
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Cancelar
            </MDButton>
            {isError && (
              <Alert severity="error">
                Ha ocurrido un error, usuario no creado
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default UserCreate;
