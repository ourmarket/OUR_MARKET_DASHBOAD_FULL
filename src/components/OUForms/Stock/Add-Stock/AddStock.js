/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { creteProductLotsSchema } from "validations/productsLots/creteProductsLotsYup";
import MDTypography from "components/MDTypography";
import { formatPrice } from "utils/formaPrice";
import { usePostStockMutation } from "api/stockApi";
import { v4 as uuidv4 } from "uuid";

function AddStock({ listProducts, ListSuppliers }) {
  const navigate = useNavigate();

  const [addStock, { isLoading, isError }] = usePostStockMutation();
  const [inputValue, setInputValue] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (listProducts) {
      const autoCompleteProducts = listProducts.products
        .map((product) => {
          const firstLetter = product.name[0].toUpperCase();
          return {
            id: product._id,
            unit: product.unit,
            product: product.name,
            img: product.img,
            stock: product.stock,
            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
          };
        })
        .sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter));

      setInputValue(autoCompleteProducts[0]);
      setProducts(autoCompleteProducts);
    }
  }, [listProducts]);

  const formik = useFormik({
    initialValues: {
      product: "",
      supplier: "",
      quantity: undefined,
      unityCost: undefined,
    },
    onSubmit: async (values) => {
      const newStock = {
        stockId: uuidv4(),
        product: inputValue.id,
        buy: null,
        quantity: values.quantity,
        cost: values.unityCost * values.quantity,
        unityCost: values.unityCost,
        stock: values.quantity,
        createdStock: new Date(),
        updateStock: new Date(),
      };

      const res = await addStock(newStock).unwrap();

      if (res) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Stock cargado con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
      }
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
            {ListSuppliers.data.suppliers.length === 0 && (
              <Alert severity="warning" sx={{ marginBottom: "30px" }}>
                No hay proveedores en la lista, agregue uno antes de cargar el
                stock.
              </Alert>
            )}

            <Autocomplete
              options={products}
              getOptionLabel={(options) => options.product}
              groupBy={(option) => option.firstLetter}
              multiple={false}
              id="controlled-demo"
              value={inputValue}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, newValue) => {
                setInputValue(newValue);
              }}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Productos" variant="outlined" />
              )}
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
                Ha ocurrido un error, producto no creado
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </MDBox>
  );
}

export default AddStock;
