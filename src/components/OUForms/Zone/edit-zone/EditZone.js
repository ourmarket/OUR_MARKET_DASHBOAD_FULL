/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { createDeliveryZoneSchema } from "validations/deliveryZone/createDeliveryZoneYup";
import Swal from "sweetalert2";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import { provinces } from "data/province";
import DrawingMap from "components/OUMaps/DrawingMap/DrawingMap";
import {
  usePutDeleteMapZoneMutation,
  usePutDeliveryZoneMutation,
} from "api/deliveryZoneApi";

function EditZone({ deliveryZone, zones }) {
  console.log(zones);
  const navigate = useNavigate();
  const { id } = useParams();
  const [editDeliveryZone, { isLoading: l1, isError: e1 }] =
    usePutDeliveryZoneMutation();
  const [deleteMapZone, { isLoading: l2, isError: e2, isSuccess }] =
    usePutDeleteMapZoneMutation();

  const [color, setColor] = useState(deliveryZone.fillColor);
  const [mapLimits, setMapLimits] = useState([]);
  const [mapError, setMapError] = useState(false);

  const onColorChange = (e) => {
    setColor(e.target.value);
  };

  const formik = useFormik({
    initialValues: {
      name: deliveryZone.name,
      cost: deliveryZone.cost,
      province: deliveryZone.province,
      city: deliveryZone.city,
      zip: deliveryZone.zip,
    },
    onSubmit: async ({ name, cost, province, city, zip }) => {
      const newDeliveryZone = {
        name,
        cost,
        province,
        city,
        zip,
        fillColor: color,
        mapLimits: mapLimits[0]?.latlngs || deliveryZone.mapLimits,
      };
      if (!mapLimits[0]?.latlngs) {
        return setMapError(true);
      }

      const res = await editDeliveryZone({ id, ...newDeliveryZone }).unwrap();
      if (res.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Zona editada con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate(-1);
      }
    },
    validationSchema: createDeliveryZoneSchema,
  });

  const deleteMapZoneHandler = async () => {
    Swal.fire({
      title: "Deseas borrar el dibujo de la zona?",
      text: "Solo se borrara el dibujo, luego tendrás que volver a dibujar la zona y guardar los cambios",

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteMapZone({ id }).unwrap();
      }
    });
  };

  useEffect(() => {
    if (e2)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, dibujo de zona no borrado.",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [e2]);
  useEffect(() => {
    if (isSuccess)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Dibujo borrado, ahora vuelve e dibujar la zona.",
        showConfirmButton: false,
        timer: 2500,
      });
  }, [isSuccess]);

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
              required
              fullWidth
              autoFocus
              label="Nombre de zona"
              name="name"
              value={formik.values.name}
              error={!!formik.errors.name}
              helperText={formik.errors.name}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              type="number"
              fullWidth
              autoFocus
              label="Costo (opcional si hay reparto)"
              name="cost"
              value={formik.values.cost}
              error={!!formik.errors.cost}
              helperText={formik.errors.cost}
              onChange={formik.handleChange}
            />

            <TextField
              margin="normal"
              required
              select
              fullWidth
              name="province"
              label="Provincia"
              value={formik.values.province}
              error={!!formik.errors.province}
              helperText={formik.errors.province}
              onChange={formik.handleChange}
            >
              {provinces.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              autoFocus
              label="Ciudad"
              name="city"
              value={formik.values.city}
              error={!!formik.errors.city}
              helperText={formik.errors.city}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              type="number"
              fullWidth
              autoFocus
              label="Código postal"
              name="zip"
              value={formik.values.zip}
              error={!!formik.errors.zip}
              helperText={formik.errors.zip}
              onChange={formik.handleChange}
            />
            <Box
              p={1}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <label>
                <MDTypography variant="body2">Color de zona </MDTypography>
              </label>
              <input
                type="color"
                style={{ width: "50px" }}
                value={color}
                onChange={(e) => onColorChange(e)}
              />
            </Box>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={l1}
              sx={{
                mt: 3,
                mb: 2,
                mr: 2,
                backgroundColor: `${colors.info.main}`,
                color: "white !important",
              }}
            >
              Editar Zona
            </LoadingButton>
            <LoadingButton
              onClick={deleteMapZoneHandler}
              variant="contained"
              loading={l2}
              sx={{
                mt: 3,
                mb: 2,
                mr: 2,
                backgroundColor: `${colors.error.main}`,
                color: "white !important",
                "&:hover": {
                  backgroundColor: `${colors.error.focus}`,
                },
              }}
            >
              Borrar dibujo de zona
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
              Volver
            </MDButton>
            {e1 && <Alert severity="error">Error — Zona no creada</Alert>}
            {mapError && (
              <Alert severity="warning">(*) Error — Zona no dibujada.</Alert>
            )}
          </Box>

          <Box sx={{ width: "50%", height: 630 }}>
            <DrawingMap
              color={color}
              setMapLimits={setMapLimits}
              zones={zones}
            />
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default EditZone;
