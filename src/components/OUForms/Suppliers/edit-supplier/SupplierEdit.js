/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-underscore-dangle */
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

import { useFormik } from "formik";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput"; // Usamos MDInput en lugar de TextField
import colors from "assets/theme/base/colors";
import { creteSupplierSchema } from "validations/suppliers/createSupplierYup";
import Swal from "sweetalert2";
import { usePutSuppliersMutation } from "api/supplierApi";
import { Alert, Grid, Divider, MenuItem, Icon } from "@mui/material";
import { provinces } from "data/province";

function SupplierEdit({ supplier }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editSupplier, { isLoading, isError }] = usePutSuppliersMutation();

  const formik = useFormik({
    initialValues: {
      businessName: supplier.businessName,
      cuit: supplier.cuit,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      province: supplier.province,
      city: supplier.city,
      zip: supplier.zip,
    },
    onSubmit: async (values) => {
      const res = await editSupplier({ id, ...values }).unwrap();
      if (res) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Proveedor editado con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate("/productos/proveedores/lista");
      }
    },
    validationSchema: creteSupplierSchema,
  });

  return (
    <MDBox py={3}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={10}>
          <MDBox p={4} component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* SECCIÓN: DATOS DE LA EMPRESA */}
              <Grid item xs={12} md={6}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Icon fontSize="medium" color="info" sx={{ mr: 1 }}>
                    business
                  </Icon>
                  <MDTypography variant="h6" fontWeight="bold">
                    Datos de la Empresa
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" flexDirection="column" gap={3}>
                  <MDInput
                    fullWidth
                    label="Razón Social / Nombre"
                    name="businessName"
                    value={formik.values.businessName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.businessName &&
                      !!formik.errors.businessName
                    }
                    helperText={
                      formik.touched.businessName && formik.errors.businessName
                    }
                  />
                  <MDInput
                    fullWidth
                    label="CUIT"
                    name="cuit"
                    placeholder="00-00000000-0"
                    value={formik.values.cuit}
                    onChange={formik.handleChange}
                    error={formik.touched.cuit && !!formik.errors.cuit}
                    helperText={formik.touched.cuit && formik.errors.cuit}
                  />
                  <MDInput
                    fullWidth
                    label="Email de contacto"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && !!formik.errors.email}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <MDInput
                    fullWidth
                    label="Teléfono / WhatsApp"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && !!formik.errors.phone}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </MDBox>
              </Grid>

              {/* SECCIÓN: UBICACIÓN */}
              <Grid item xs={12} md={6}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <Icon fontSize="medium" color="info" sx={{ mr: 1 }}>
                    location_on
                  </Icon>
                  <MDTypography variant="h6" fontWeight="bold">
                    Ubicación y Logística
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" flexDirection="column" gap={3}>
                  <MDInput
                    fullWidth
                    label="Dirección"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && !!formik.errors.address}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                  <MDInput
                    select
                    fullWidth
                    label="Provincia"
                    name="province"
                    value={formik.values.province}
                    onChange={formik.handleChange}
                    error={formik.touched.province && !!formik.errors.province}
                    helperText={
                      formik.touched.province && formik.errors.province
                    }
                  >
                    {provinces.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </MDInput>
                  <MDInput
                    fullWidth
                    label="Ciudad"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && !!formik.errors.city}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                  <MDInput
                    fullWidth
                    label="Código Postal"
                    name="zip"
                    type="number"
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                    error={formik.touched.zip && !!formik.errors.zip}
                    helperText={formik.touched.zip && formik.errors.zip}
                  />
                </MDBox>
              </Grid>

              {/* ACCIONES Y ALERTAS */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <MDBox display="flex" justifyContent="flex-end" gap={2}>
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </MDButton>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                    sx={{
                      backgroundColor: `${colors.info.main}`,
                      color: "white !important",
                      minWidth: "150px",
                    }}
                  >
                   Editar Proveedor
                  </LoadingButton>
                </MDBox>

                {isError && (
                  <MDBox mt={2}>
                    <Alert severity="error">
                      Ocurrió un error al intentar crear el proveedor. Por
                      favor, intente nuevamente.
                    </Alert>
                  </MDBox>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default SupplierEdit;
