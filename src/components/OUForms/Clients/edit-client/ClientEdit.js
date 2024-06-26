/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { createClientSchema } from "validations/client/createClientSchemaYup";
import Swal from "sweetalert2";
import { useState } from "react";
import { usePutClientMutation } from "api/clientsApi";

function ClientEdit({ types, categories, users, client }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editClient, { isLoading, isError }] = usePutClientMutation();

  const filterUser = users.filter((user) => user.role.role === "CLIENT_ROLE");

  const autoCompleteUsers = filterUser.map((user) => ({
    id: user._id,
    phone: user.phone,
    name: user.name,
    lastName: user.lastName,
  }));

  const [inputValue, setInputValue] = useState({
    id: client.user._id,
    phone: client.user.phone,
    name: client.user.name,
    lastName: client.user.lastName,
  });

  const formik = useFormik({
    initialValues: {
      user: "",
      clientType: client.clientType._id,
      clientCategory: client.clientCategory._id,
      cuit: client.cuit,
      contactMeans: client.contactMeans,
      campaignName: client.campaignName,
    },
    onSubmit: async (values) => {
      const editClientValues = {
        ...values,
        user: inputValue.id,
      };
      const res = await editClient({ id, ...editClientValues }).unwrap();
      if (res) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cliente editado con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate("/clientes/lista");
      }
    },
    validationSchema: createClientSchema,
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
          <Box sx={{ width: "50%", marginTop: "13px" }}>
            <Autocomplete
              margin="normal"
              options={autoCompleteUsers}
              getOptionLabel={(options) =>
                `${options.phone} - ${options.name} ${options.lastName}`
              }
              multiple={false}
              id="controlled-demo"
              value={inputValue}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, newValue) => {
                setInputValue(newValue);
              }}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Usuario" variant="outlined" />
              )}
            />

            <TextField
              margin="normal"
              required
              select
              name="clientType"
              fullWidth
              label="Tipo de cliente"
              value={formik.values.clientType}
              error={!!formik.errors.clientType}
              helperText={formik.errors.clientType}
              onChange={formik.handleChange}
            >
              {types.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.clientType}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              select
              name="clientCategory"
              fullWidth
              label="Categoría de cliente"
              value={formik.values.clientCategory}
              error={!!formik.errors.clientCategory}
              helperText={formik.errors.clientCategory}
              onChange={formik.handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.clientCategory}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              name="cuit"
              label="CUIT"
              value={formik.values.cuit}
              error={!!formik.errors.cuit}
              helperText={formik.errors.cuit}
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
              Editar
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
              <Alert severity="error">Error — Cliente no creado</Alert>
            )}
          </Box>

          <Box sx={{ width: "50%" }}>
            <TextField
              margin="normal"
              required
              select
              name="contactMeans"
              fullWidth
              label="Ingresa por"
              value={formik.values.contactMeans}
              error={!!formik.errors.contactMeans}
              helperText={formik.errors.contactMeans}
              onChange={formik.handleChange}
            >
              <MenuItem value="h2h">H2H</MenuItem>
              <MenuItem value="folleteria">Folleteria</MenuItem>
              <MenuItem value="recomendacion">Recomendación</MenuItem>
              <MenuItem value="google">Google</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="telegram">Telegram</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              required
              name="campaignName"
              label="Campaña de marketing"
              value={formik.values.campaignName}
              error={!!formik.errors.campaignName}
              helperText={formik.errors.campaignName}
              onChange={formik.handleChange}
            />
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default ClientEdit;
