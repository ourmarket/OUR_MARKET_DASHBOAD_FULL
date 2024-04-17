/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { creteProductLotsSchema } from "validations/productsLots/creteProductsLotsYup";
import Swal from "sweetalert2";
import MDTypography from "components/MDTypography";
import { formatPrice } from "utils/formaPrice";
import { formatQuantity } from "utils/quantityFormat";
import { usePutStockMutation } from "api/stockApi";

function EditStock({ dataStock }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [editStock, { isLoading, isError }] = usePutStockMutation();

  const formik = useFormik({
    initialValues: {
      product: dataStock.product.name,
      quantity: dataStock.quantity,
      unityCost: dataStock.unityCost,
      stock: formatQuantity(dataStock.stock),
    },
    onSubmit: async (values) => {
      const stock = {
        ...dataStock,
        product: dataStock.product._id,
        quantity: values.quantity,
        cost: values.unityCost * values.quantity,
        stock: values.stock,
        unityCost: values.unityCost,
        updateStock: new Date(),
      };

      const res = await editStock({ id, ...stock }).unwrap();
      console.log(res);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Stock de productos editado con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
      navigate("/productos/stock/lista");
    },
    validationSchema: creteProductLotsSchema,
  });

  return (
    <MDBox pt={6} pb={3}>
      <Box
        sx={{
          display: "flex",
          gap: 5,
          justifyContent: "center",
        }}
      >
        <Box sx={{ mt: 1, mx: 2, display: "flex", width: "100%", gap: 3 }}>
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
              disabled="true"
              required
              name="product"
              label="Producto a editar"
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
              label="Cantidad comprada"
              value={formik.values.quantity}
              error={!!formik.errors.quantity}
              helperText={formik.errors.quantity}
              onChange={formik.handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              name="stock"
              label="Stock actual"
              value={formik.values.stock}
              error={!!formik.errors.stock}
              helperText={formik.errors.stock}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              type="number"
              name="unityCost"
              label="Costo unidad"
              value={formik.values.unityCost}
              error={!!formik.errors.unityCost}
              helperText={formik.errors.unityCost}
              onChange={formik.handleChange}
            />

            {formik.values.unityCost && formik.values.quantity && (
              <MDTypography variant="h6" sx={{ display: "flex", gap: "10px" }}>
                Costo total:{" "}
                {formatPrice(
                  +formik.values.unityCost * +formik.values.quantity
                )}{" "}
                <MDTypography variant="body2">(costo x cantidad)</MDTypography>
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
              Editar
            </LoadingButton>

            <MDButton
              onClick={() => navigate(-1)}
              variant="outlined"
              color="info"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Cancelar
            </MDButton>
            {isError && (
              <Alert severity="error">
                Ha ocurrido un error, stock no editado.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default EditStock;
