/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import Swal from "sweetalert2";
import { creteProductLotsSchema } from "validations/productsLots/creteProductsLotsYup";
import MDTypography from "components/MDTypography";
import { formatPrice } from "utils/formaPrice";
import { usePostStockMutation } from "api/stockApi";

function AddStockById({ product, setPage }) {
  const navigate = useNavigate();

  const [addStockById, { isLoading, isError }] = usePostStockMutation();

  const formik = useFormik({
    initialValues: {
      product: product?.name,
      quantity: undefined,
      unityCost: undefined,
    },
    onSubmit: async (values) => {
      const newStock = {
        product: product?.id,
        buy: null,
        quantity: values.quantity,
        cost: values.unityCost * values.quantity,
        unityCost: values.unityCost,
        stock: values.quantity,
        createdStock: new Date(),
        updateStock: new Date(),
      };

      const res = await addStockById(newStock).unwrap();

      if (res) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Stock cargado con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
      }
      setPage(0);
    },
    validationSchema: creteProductLotsSchema,
  });

  return (
    <MDBox pt={5} pb={3}>
      <Box
        sx={{
          display: "flex",
          gap: 5,
          justifyContent: "center",
        }}
      >
        <Box sx={{ mx: 2, display: "flex", width: "100%", gap: 3 }}>
          <Box
            component="form"
            autoComplete="off"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              required
              disabled={true}
              type="text"
              name="product"
              label="Producto"
              value={formik.values.product}
              error={!!formik.errors.product}
              helperText={formik.errors.product}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              name="quantity"
              label="Cantidad"
              error={!!formik.errors.quantity}
              helperText={formik.errors.quantity}
              onChange={formik.handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              name="unityCost"
              label="Costo Unidad"
              error={!!formik.errors.unityCost}
              helperText={formik.errors.unityCost}
              onChange={formik.handleChange}
            />
            {formik.values.unityCost && formik.values.quantity && (
              <MDTypography variant="h6">
                Costo total:{" "}
                {formatPrice(
                  +formik.values.unityCost * +formik.values.quantity
                )}
              </MDTypography>
            )}

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
              Agregar
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
                Ha ocurrido un error, stock no cargado.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default AddStockById;
