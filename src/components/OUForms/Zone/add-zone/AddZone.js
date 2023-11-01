/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { createDeliveryZoneSchema } from "validations/deliveryZone/createDeliveryZoneYup";
import Swal from "sweetalert2";
import { usePostDeliveryZoneMutation } from "api/deliveryZoneApi";
import MDTypography from "components/MDTypography";

import { useState } from "react";
import { provinces } from "data/province";
import DrawingMap from "components/OUMaps/DrawingMap/DrawingMap";

function AddZones({ zones }) {
  const navigate = useNavigate();
  const [createDeliveryZone, { isLoading, isError }] =
    usePostDeliveryZoneMutation();

  const [color, setColor] = useState("#f10909");
  const [mapLimits, setMapLimits] = useState([]);
  const [mapError, setMapError] = useState(false);

  const onColorChange = (e) => {
    setColor(e.target.value);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      cost: 0,
      province: "",
      city: "",
      zip: undefined,
    },
    onSubmit: async ({ name, cost, province, city, zip }) => {
      const newDeliveryZone = {
        name,
        cost,
        province,
        city,
        zip,
        fillColor: color,
        mapLimits: mapLimits[0]?.latlngs,
      };
      if (!mapLimits[0]?.latlngs) {
        return setMapError(true);
      }

      const res = await createDeliveryZone(newDeliveryZone).unwrap();
      if (res.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Zona de reparto creada con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate(-1);
      }
    },
    validationSchema: createDeliveryZoneSchema,
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
              required
              fullWidth
              autoFocus
              label="Nombre de zona"
              name="name"
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
              <Alert severity="error">Error — Proveedor no creado</Alert>
            )}
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

export default AddZones;
