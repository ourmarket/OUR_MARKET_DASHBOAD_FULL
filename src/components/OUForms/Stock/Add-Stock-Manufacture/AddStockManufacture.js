/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { creteProductLotsSchema } from "validations/productsLots/creteProductsLotsYup";
import { usePutProductMutation, useGetProductsQuery } from "api/productApi";
import Loading from "components/DRLoading";

function AddStockManufacture({ ListSuppliers }) {
  const navigate = useNavigate();

  const {
    data: listProducts,
    isLoading: l1,
    error: e1,
  } = useGetProductsQuery();
  const [editProduct, { isLoading, isError }] = usePutProductMutation();
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
      location: "",
    },
    onSubmit: async (values) => {
      const newStock = {
        productId: inputValue.id,
        name: inputValue.product,
        img: inputValue.img,
        supplier: values.supplier,
        quantity: values.quantity,
        cost: values.unityCost * values.quantity,
        unityCost: values.unityCost,
        stock: values.quantity,
        location: values.location,
        moveDate: null,
        createdStock: new Date(),
        updateStock: new Date(),
      };

      const { id } = inputValue;
      const res = await editProduct({ id, newStock }).unwrap();

      if (res) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Lote de productos con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    },
    validationSchema: creteProductLotsSchema,
  });

  if (l1) {
    return <Loading />;
  }
  if (e1) {
    return <Alert severity="error">El proveedor no fue creado</Alert>;
  }

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
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <Autocomplete
                  options={products}
                  getOptionLabel={(options) => options.product}
                  groupBy={(option) => option.firstLetter}
                  multiple={false}
                  id="controlled-demo"
                  value={inputValue}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, newValue) => {
                    setInputValue(newValue);
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Productos"
                      variant="outlined"
                    />
                  )}
                />
                <TextField
                  sx={{ maxWidth: "100px" }}
                  type="number"
                  name="quantity"
                  label="Stock"
                  InputProps={{ sx: { height: 55 } }}
                  error={!!formik.errors.quantity}
                  helperText={formik.errors.quantity}
                  onChange={formik.handleChange}
                />
                <TextField
                  sx={{ maxWidth: "100px" }}
                  type="number"
                  name="quantity"
                  label="Quitar"
                  InputProps={{ sx: { height: 55 } }}
                  error={!!formik.errors.quantity}
                  helperText={formik.errors.quantity}
                  onChange={formik.handleChange}
                />

                <Button
                  variant="contained"
                  sx={{
                    height: 55,

                    backgroundColor: `${colors.info.main}`,
                    color: "white !important",
                  }}
                >
                  Quitar
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <Autocomplete
                  options={products}
                  getOptionLabel={(options) => options.product}
                  groupBy={(option) => option.firstLetter}
                  multiple={false}
                  id="controlled-demo"
                  value={inputValue}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, newValue) => {
                    setInputValue(newValue);
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Productos"
                      variant="outlined"
                    />
                  )}
                />
                <TextField
                  sx={{ maxWidth: "100px" }}
                  type="number"
                  name="quantity"
                  label="Stock"
                  InputProps={{ sx: { height: 55 } }}
                  error={!!formik.errors.quantity}
                  helperText={formik.errors.quantity}
                  onChange={formik.handleChange}
                />
                <TextField
                  sx={{ maxWidth: "100px" }}
                  type="number"
                  name="quantity"
                  label="Agregar"
                  InputProps={{ sx: { height: 55 } }}
                  error={!!formik.errors.quantity}
                  helperText={formik.errors.quantity}
                  onChange={formik.handleChange}
                />

                <Button
                  variant="contained"
                  sx={{
                    height: 55,

                    backgroundColor: `${colors.info.main}`,
                    color: "white !important",
                  }}
                >
                  Agregar
                </Button>
              </Box>
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
              Enviar
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

export default AddStockManufacture;
