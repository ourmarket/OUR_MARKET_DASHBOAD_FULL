/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { usePutCategoryMutation } from "api/categoryApi";
import { useState } from "react";
import Swal from "sweetalert2";
import * as yup from "yup";
import ImageUpload from "components/OUImageUpload/ImageUpload";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const validationSchema = yup.object().shape({
  name: yup.string().required("Requerido"),
});

function EditCategoryForm({ categoryData }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editCategory, { isLoading, isError }] = usePutCategoryMutation();
  const [urlImage, setUrlImage] = useState(categoryData.img);

  const formik = useFormik({
    initialValues: {
      name: categoryData.name,
      img: categoryData.img,
    },
    onSubmit: async (values) => {
      const editData = {
        ...values,
        img: urlImage,
      };
      const res = await editCategory({ id, ...editData }).unwrap();
      if (res.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Categoria editada con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    },
    validationSchema,
  });

  return (
    <MDBox py={3}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={10}>
          <MDBox p={4}>
            <Grid container spacing={5}>
              <Grid item xs={12} md={9}>
                <MDBox component="form" onSubmit={formik.handleSubmit}>
                  <MDBox mb={4}>
                    <MDTypography variant="h6" fontWeight="bold" mb={1}>
                      Información General
                    </MDTypography>
                    <MDInput
                      fullWidth
                      label="Nombre de la categoría"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && !!formik.errors.name}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </MDBox>

                  <MDBox mb={4}>
                    <MDTypography variant="h6" fontWeight="bold" mb={1}>
                      URL de Imagen (Opcional)
                    </MDTypography>
                    <MDInput
                      fullWidth
                      placeholder="La URL se genera automáticamente al subir"
                      name="img"
                      value={urlImage}
                      disabled
                    />
                    <MDTypography variant="caption" color="text">
                      Puedes subir un archivo a la derecha o pegar un enlace
                      aquí si lo prefieres.
                    </MDTypography>
                  </MDBox>

                  <Divider sx={{ my: 3 }} />

                  <MDBox display="flex" justifyContent="space-between" gap={2}>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(-1)}
                      sx={{ flex: 1 }}
                    >
                      Cancelar
                    </MDButton>
                    <LoadingButton
                      type="primary"
                      variant="contained"
                      loading={isLoading}
                      color="info"
                      sx={{
                        flex: 1,
                        backgroundColor: `${colors.info.main}`,
                        color: "white !important",
                      }}
                    >
                      Editar Categoría
                    </LoadingButton>
                  </MDBox>

                  {isError && (
                    <MDBox mt={2}>
                      <Alert severity="error">
                        No se pudo crear la categoría. Revisa los datos.
                      </Alert>
                    </MDBox>
                  )}
                </MDBox>
              </Grid>

              {/* COLUMNA DERECHA: PREVIEW DE IMAGEN */}
              <Grid item xs={12} md={3}>
                <MDTypography variant="h6" fontWeight="bold" mb={2}>
                  Imagen de Portada
                </MDTypography>
                <Card
                  sx={{
                    border: "1px dashed #ced4da",
                    boxShadow: "none",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Box p={1}>
                    <Box
                      component="img"
                      src={
                        urlImage ||
                        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                      }
                      alt="Preview"
                      sx={{
                        width: "100%",
                        borderRadius: "8px",
                        maxHeight: "250px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <MDBox p={2}>
                    <ImageUpload setUrlImage={setUrlImage} />
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default EditCategoryForm;
