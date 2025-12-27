/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import {
  Box,
  TextField,
  MenuItem,
  Divider,
  Typography,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Componentes del tema
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Iconos
import AddIcon from "@mui/icons-material/Add";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SellIcon from "@mui/icons-material/Sell";
import SettingsIcon from "@mui/icons-material/Settings";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // Nuevo icono para imagen

import ImageUpload from "components/OUImageUpload/ImageUpload";
import { usePostProductMutation } from "api/productApi";
import { usePostCategoryMutation } from "api/categoryApi";
import { creteProductSchema } from "validations/products/createProductYup";
import colors from "assets/theme/base/colors";
import CloseIcon from "@mui/icons-material/Close";

function AddProductForm({ listCategories }) {
  const navigate = useNavigate();
  const [urlImage, setUrlImage] = useState(null);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [createProduct, { isLoading }] = usePostProductMutation();
  const [createCategory] = usePostCategoryMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      brand: "",
      unit: "",
      type: "",
      description: "",
      category: "",
      img: "",
      price: "",
      hasOffer: false,
      offerPrice: "",
      offerFrom: "",
      offerTo: "",
      available: true,
      isFeatured: false,
    },
    validationSchema: creteProductSchema,
    onSubmit: async (values) => {
      try {
        const newProduct = {
          ...values,
          img: urlImage,
          offerPrice: values.hasOffer ? values.offerPrice : null,
          offerFrom:
            values.hasOffer && values.offerFrom
              ? new Date(values.offerFrom)
              : null,
          offerTo:
            values.hasOffer && values.offerTo ? new Date(values.offerTo) : null,
        };
        await createProduct(newProduct).unwrap();
        Swal.fire({
          icon: "success",
          title: "Producto creado",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(-1);
      } catch (error) {
        Swal.fire("Error", "No se pudo crear el producto", "error");
      }
    },
  });

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const category = await createCategory({ name: newCategoryName }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Categoría creada",
        timer: 2000,
        showConfirmButton: false,
      });
      formik.setFieldValue("category", category._id);
      setNewCategoryName("");
      setOpenCategoryModal(false);
    } catch (error) {
      Swal.fire("Error", "No se pudo crear la categoría", "error");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  return (
    <MDBox p={3} component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* SECCIÓN 1: DATOS BÁSICOS */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: "1px solid #ebedef", borderRadius: "12px" }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <ShoppingBagIcon color="info" sx={{ mr: 1 }} />
                <MDTypography variant="h6" fontWeight="bold">
                  Información General
                </MDTypography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre del producto *"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={!!formik.errors.name}
                    helperText={formik.errors.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Marca"
                    name="brand"
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      select
                      label="Categoría *"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      error={!!formik.errors.category}
                    >
                      {listCategories?.categories?.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton
                      onClick={() => setOpenCategoryModal(true)}
                      sx={{
                        backgroundColor: "#f0f2f5",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#e0e2e5" },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    name="description"
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* SECCIÓN 2: PRECIOS */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: "1px solid #ebedef", borderRadius: "12px" }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <SellIcon color="info" sx={{ mr: 1 }} />
                <MDTypography variant="h6" fontWeight="bold">
                  Precios y Ofertas
                </MDTypography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Precio Normal *"
                    name="price"
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="¿Es una oferta?"
                    name="hasOffer"
                    value={formik.values.hasOffer}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "hasOffer",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Sí</MenuItem>
                  </TextField>
                </Grid>
                {formik.values.hasOffer && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Precio Oferta"
                        name="offerPrice"
                        onChange={formik.handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Desde"
                        name="offerFrom"
                        InputLabelProps={{ shrink: true }}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Hasta"
                        name="offerTo"
                        InputLabelProps={{ shrink: true }}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>

            {/* SECCIÓN 3: VISIBILIDAD */}
            <Paper
              elevation={0}
              sx={{ p: 3, border: "1px solid #ebedef", borderRadius: "12px" }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <SettingsIcon color="info" sx={{ mr: 1 }} />
                <MDTypography variant="h6" fontWeight="bold">
                  Visibilidad y TPv
                </MDTypography>
              </Box>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  select
                  label="Producto Destacado"
                  name="isFeatured"
                  value={formik.values.isFeatured}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "isFeatured",
                      e.target.value === "true"
                    )
                  }
                >
                  <MenuItem value="false">No (Estándar)</MenuItem>
                  <MenuItem value="true">Sí (Aparece en inicio)</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="Estado de Visibilidad"
                  name="available"
                  value={formik.values.available}
                  onChange={(e) =>
                    formik.setFieldValue("available", e.target.value === "true")
                  }
                >
                  <MenuItem value="true">Visible en la tienda</MenuItem>
                  <MenuItem value="false">Oculto / Borrador</MenuItem>
                </TextField>
              </Stack>
            </Paper>

            {/* BOTONES DE ACCIÓN */}
            <Box display="flex" gap={2} pt={3}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isLoading}
                sx={{
                  backgroundColor: `${colors.info.main}`,
                  color: "white !important",
                  height: "50px",
                }}
              >
                CREAR PRODUCTO
              </LoadingButton>
              <MDButton
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => navigate(-1)}
                sx={{ height: "50px" }}
              >
                CANCELAR
              </MDButton>
            </Box>
          </Stack>
        </Grid>

        {/* COLUMNA DERECHA: IMAGEN */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 0,
                border: "1px solid #ebedef",
                borderRadius: "12px",
                overflow: "hidden",
                height: "fit-content",
              }}
            >
              <Box
                p={3}
                pb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center">
                  <PhotoCameraIcon color="info" sx={{ mr: 1 }} />
                  <MDTypography variant="h6" fontWeight="bold">
                    Imagen del Producto
                  </MDTypography>
                </Box>
              </Box>

              <Divider sx={{ m: 0 }} />

              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    position: "relative",
                    pt: "100%",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: urlImage
                      ? "1px solid #ebedef"
                      : "2px dashed #dee2e6",
                    overflow: "hidden",
                    mb: 3,
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* BOTÓN "X" SOBRE LA IMAGEN */}
                  {urlImage && (
                    <IconButton
                      onClick={() => setUrlImage(null)}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        backgroundColor: "rgba(236, 233, 233, 0.8)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        "&:hover": {
                          backgroundColor: "#d6d5d5ff",
                          transform: "scale(1.1)",
                        },
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" color={colors.info.main} />
                    </IconButton>
                  )}

                  <Box
                    component="img"
                    src={
                      urlImage ||
                      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                    }
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      p: urlImage ? 0 : 4,
                      filter: urlImage ? "none" : "grayscale(1) opacity(0.5)",
                    }}
                  />
                </Box>

                <Box sx={{ "& .MuiButton-root": { width: "100%" } }}>
                  {/* Si ya hay imagen, podemos cambiar el texto del componente o mostrar un botón diferente */}
                  <ImageUpload setUrlImage={setUrlImage} />
                </Box>

                <Typography
                  variant="caption"
                  color="text"
                  display="block"
                  textAlign="center"
                  sx={{ mt: 2, fontStyle: "italic" }}
                >
                  {urlImage
                    ? "Puedes hacer clic en la X para eliminar la imagen actual."
                    : "Tamaño recomendado: 500x500px (JPG o PNG)."}
                </Typography>
              </Box>
            </Paper>

            <Alert severity="info" sx={{ borderRadius: "12px" }}>
              Asegúrate de que la imagen sea clara y tenga un fondo neutro...
            </Alert>
          </Stack>
        </Grid>
      </Grid>

      {/* MODAL CATEGORÍA */}
      <Dialog
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Nueva Categoría
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Nombre de la categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
          <MDButton
            color="dark"
            variant="outlined"
            onClick={() => setOpenCategoryModal(false)}
          >
            Cancelar
          </MDButton>
          <LoadingButton
            variant="contained"
            color="info"
            loading={isCreatingCategory}
            onClick={handleCreateCategory}
            sx={{
              color: "white !important",
              backgroundColor: `${colors.info.main}`,
            }}
          >
            Guardar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default AddProductForm;
