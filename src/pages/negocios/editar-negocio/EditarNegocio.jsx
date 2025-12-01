/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-underscore-dangle */
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  categoriasProductos,
  marcasPollos,
  proveedores,
} from "data/negociosOpciones";
import { Modal } from "components/modal/Modal";
import MobileMap from "./MobileMap";
import style from "./css.module.css";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import {
  usePutNegocioMutation, // Cambiado: para la edición (PUT)
} from "api/apiNegocio";
import {
  resetNegocioPosicion,
  setNegocioPosicion,
} from "reduxToolkit/mapSlice"; // setNegocioPosicion para precargar lat/lng
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  nombreNegocio: Yup.string().required("Requerido"),
  direccion: Yup.string().required("Requerido"),
  categoria: Yup.string().required("Selecciona una categoría"),
  potencial: Yup.string().required("Selecciona el potencial del negocio"),
});

function EditarNegocio({ negocioData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openMap, setOpenMap] = useState(false);

  const [updateNegocio, { isLoading: isMutating, isError: isMutationError }] =
    usePutNegocioMutation();

  useEffect(() => {
    dispatch(setNegocioPosicion({ lat: negocioData.lat, lng: negocioData.lng }));
  }, []);

  const { lat, lng } = useSelector((state) => state.map);

  const initialFormValues = {
    nombreNegocio: negocioData.nombreNegocio || "",
    nombreDueño: negocioData.nombreDueño || "",
    direccion: negocioData.direccion || "",
    telefono: negocioData.telefono || "",
    categoria: negocioData.categoria || "",
    horarioApertura: negocioData.horarioApertura || "",
    horarioCierre: negocioData.horarioCierre || "",
    potencial: String(negocioData.potencial) || "", // Convertir a string para el TextField
    fueVisitado: negocioData.fueVisitado,
    esCliente: negocioData.esCliente,
    vendeNuestrasCategorias: negocioData.vendeNuestrasCategorias,
    productosQueCompra: negocioData.productosQueCompra || [],
    productosQueLeInteresan: negocioData.productosQueLeInteresan || [],
    distribuidorActual: negocioData.distribuidorActual || [],
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true, // Importante: permite que el formulario se actualice cuando negocioData cambie
    onSubmit: async (values) => {
      // Verificar si la latitud y longitud están disponibles antes de enviar
      if (!lat || !lng) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "¡Atención!",
          text: "Debes seleccionar la ubicación en el mapa.",
          showConfirmButton: true,
        });
        return;
      }

      const dataToUpdate = {
        // Enviar el ID junto con los datos actualizados
        id: negocioData._id,
        ...values,
        potencial: Number(values.potencial),
        lat,
        lng,
      };

      try {
        const res = await updateNegocio(dataToUpdate).unwrap(); // Usar updateNegocio
        if (res) {
          dispatch(resetNegocioPosicion());
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Negocio actualizado con éxito",
            showConfirmButton: false,
            timer: 2500,
          });
          navigate("/negocios/lista");
        }
      } catch (error) {
        console.error("Error al actualizar negocio:", error);
      }
    },
    validationSchema: SignupSchema,
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
          <Box sx={{ width: "50%" }}>
            <TextField
              margin="normal"
              fullWidth
              required
              name="nombreNegocio"
              label="Nombre del negocio"
              error={!!formik.errors.nombreNegocio}
              helperText={formik.errors.nombreNegocio}
              value={formik.values.nombreNegocio} // Usar el valor de formik
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              name="nombreDueño"
              label="Nombre del dueño"
              error={!!formik.errors.nombreDueño}
              helperText={formik.errors.nombreDueño}
              value={formik.values.nombreDueño}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              name="direccion"
              label="Dirección"
              required
              error={!!formik.errors.direccion}
              helperText={formik.errors.direccion}
              value={formik.values.direccion}
              onChange={formik.handleChange}
            />
            {/* Ubicación */}
            <div className={style.input__container}>
              <div className={style.mapBtn_container}>
                <MDButton
                  variant="outlined"
                  color={lat && lng ? "success" : "error"}
                  sx={{
                    width: "95%",
                  }}
                  onClick={() => setOpenMap(true)}
                >
                  {lat && lng
                    ? "Ubicación seleccionada"
                    : "Seleccionar ubicación en el mapa"}
                </MDButton>
                {lat && (
                  <FaCheck color="green" size={25} className={style.icon} />
                )}
                {!lat && (
                  <IoClose color="red" size={30} className={style.icon} />
                )}
              </div>
            </div>
            <TextField
              margin="normal"
              fullWidth
              name="telefono"
              label="Teléfono"
              error={!!formik.errors.telefono}
              helperText={formik.errors.telefono}
              value={formik.values.telefono}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              select
              name="categoria"
              fullWidth
              label="Categoría"
              value={formik.values.categoria}
              error={!!formik.errors.categoria}
              helperText={formik.errors.categoria}
              onChange={formik.handleChange}
            >
              <MenuItem value="polleria">Pollería</MenuItem>
              <MenuItem value="carniceria">Carnicería</MenuItem>
              <MenuItem value="almacen">Almacén</MenuItem>
              <MenuItem value="kiosco">Kiosco</MenuItem>
              <MenuItem value="supermercado">Supermercado</MenuItem>
              <MenuItem value="rotiseria">Rotisería</MenuItem>
              <MenuItem value="parrilla">Parrilla</MenuItem>
              <MenuItem value="restaurant">Restaurante</MenuItem>
            </TextField>

            <TextField
              margin="normal"
              required
              select
              name="horarioApertura"
              fullWidth
              label="Horario de apertura"
              value={formik.values.horarioApertura}
              error={!!formik.errors.horarioApertura}
              helperText={formik.errors.horarioApertura}
              onChange={formik.handleChange}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")} hs
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              select
              name="horarioCierre"
              fullWidth
              label="Horario de cierre"
              value={formik.values.horarioCierre}
              error={!!formik.errors.horarioCierre}
              helperText={formik.errors.horarioCierre}
              onChange={formik.handleChange}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")} hs
                </MenuItem>
              ))}
            </TextField>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isMutating} // Usar isMutating para el botón de edición
              disabled={!lat || !lng }
              sx={{
                mt: 3,
                mb: 2,
                mr: 2,
                backgroundColor: `${colors.info.main}`,
                color: "white !important",
              }}
            >
              Guardar Cambios {/* Texto cambiado */}
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
            {isMutationError && (
              <Alert severity="error">
                Error — No se pudo actualizar el negocio.
              </Alert>
            )}
          </Box>

          <Box sx={{ width: "50%" }}>
            <TextField
              margin="normal"
              required
              select
              name="potencial"
              fullWidth
              label="Potencial del negocio"
              value={formik.values.potencial}
              error={!!formik.errors.potencial}
              helperText={formik.errors.potencial}
              onChange={formik.handleChange}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} {"★".repeat(n)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              select
              name="fueVisitado"
              fullWidth
              label="Fue Visitado?"
              value={formik.values.fueVisitado}
              error={!!formik.errors.fueVisitado}
              helperText={formik.errors.fueVisitado}
              onChange={formik.handleChange}
            >
              <MenuItem value={true}>Si</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              required
              select
              name="esCliente"
              fullWidth
              label="Es Cliente?"
              value={formik.values.esCliente}
              error={!!formik.errors.esCliente}
              helperText={formik.errors.esCliente}
              onChange={formik.handleChange}
            >
              <MenuItem value={true}>Si</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              required
              select
              name="vendeNuestrasCategorias"
              fullWidth
              label="Vende nuestras Categorias?"
              value={formik.values.vendeNuestrasCategorias}
              error={!!formik.errors.vendeNuestrasCategorias}
              helperText={formik.errors.vendeNuestrasCategorias}
              onChange={formik.handleChange}
            >
              <MenuItem value={true}>Si</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>

            <h5
              style={{
                color: "grey",
                textAlign: "center",
                padding: "10px 0px",
              }}
            >
              Información adicional
            </h5>
            <Autocomplete
              multiple
              options={marcasPollos}
              getOptionLabel={(option) => option.label}
              // Mostrar seleccionados según su value
              value={marcasPollos.filter((prov) =>
                formik.values.productosQueCompra.includes(prov.value)
              )}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "productosQueCompra",
                  newValue.map((opt) => opt.value)
                );
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  fullWidth
                  label="Productos que compra"
                />
              )}
            />
            <Autocomplete
              multiple
              options={categoriasProductos}
              getOptionLabel={(option) => option.label}
              // Mostrar seleccionados según su value
              value={categoriasProductos.filter((prov) =>
                formik.values.productosQueLeInteresan.includes(prov.value)
              )}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "productosQueLeInteresan",
                  newValue.map((opt) => opt.value)
                );
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  fullWidth
                  label="Categorias que le interesan"
                />
              )}
            />
            <Autocomplete
              multiple
              options={proveedores}
              getOptionLabel={(option) => option.label}
              // Mostrar seleccionados según su value
              value={proveedores.filter((prov) =>
                formik.values.distribuidorActual.includes(prov.value)
              )}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "distribuidorActual",
                  newValue.map((opt) => opt.value)
                );
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  fullWidth
                  label="Distribuidor Actual"
                />
              )}
            />
          </Box>
        </Box>
      </Box>
      {openMap && (
        <Modal onClose={() => setOpenMap(false)}>
          <MobileMap />
        </Modal>
      )}
    </MDBox>
  );
}

export default EditarNegocio;
