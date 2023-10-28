/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  CardContent,
  CardMedia,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { usePostProductMutation } from "api/productApi";
import { creteProductSchema } from "validations/products/createProductYup";
import { useState } from "react";
import Swal from "sweetalert2";
import ImageUpload from "components/OUImageUpload/ImageUpload";

function AddProductForm({ listCategories }) {
  const navigate = useNavigate();

  const [createProduct, { isLoading, isError }] = usePostProductMutation();
  const [urlImage, setUrlImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      brand: "",
      unit: "",
      type: "",
      category: "",
      description: "",
      img: urlImage || "",
    },
    onSubmit: async (values) => {
      const newProduct = {
        ...values,
        img: urlImage,
      };
      await createProduct(newProduct).unwrap();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto creado con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
    },
    validationSchema: creteProductSchema,
  });

  return (
    <MDBox p={3}>
      <Box
        sx={{
          display: "flex",
          gap: 5,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
          <Box
            component="form"
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ flex: 1 }}
          >
            {listCategories.categories.length === 0 && (
              <Alert severity="warning" sx={{ marginBottom: "30px" }}>
                No hay proveedores en la lista, agregue uno antes de cargar el
                stock.
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              autoComplete="product_name"
              fullWidth
              autoFocus
              id="product_name"
              label="Nombre del producto"
              name="name"
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              autoComplete="product_brand"
              name="brand"
              label="Marca"
              id="product_brand"
              error={!!formik.errors.brand}
              helperText={formik.errors.brand}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              autoComplete="product_unit"
              id="product_unit"
              label="Unidad"
              name="unit"
              error={!!formik.errors.unit}
              helperText={formik.errors.unit}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              autoComplete="product_type"
              name="type"
              label="Tipo"
              id="product_type"
              error={!!formik.errors.type}
              helperText={formik.errors.type}
              onChange={formik.handleChange}
            />

            <TextField
              id="product_category"
              margin="normal"
              required
              select
              autoComplete="product_category"
              name="category"
              fullWidth
              label="Categoria"
              value={formik.values.category}
              error={!!formik.errors.category}
              helperText={formik.errors.category}
              onChange={formik.handleChange}
            >
              {listCategories.categories.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" alignItems="center">
              <TextField
                margin="normal"
                fullWidth
                name="img"
                label="Imagen del producto (sube la imagen primero)"
                id="user_flor"
                value={urlImage}
                error={!!formik.errors.img}
                helperText={formik.errors.img}
                onChange={formik.handleChange}
              />
            </Box>

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
                Ha ocurrido un error, producto no creado
              </Alert>
            )}
          </Box>

          <Box>
            <Box
              sx={{
                maxWidth: "600px",
              }}
            >
              <CardMedia
                component="img"
                image={
                  urlImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="image product"
              />
              <CardContent>
                <ImageUpload setUrlImage={setUrlImage} />
              </CardContent>
            </Box>
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default AddProductForm;
