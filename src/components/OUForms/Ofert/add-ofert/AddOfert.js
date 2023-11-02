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
import { creteOfertSchema } from "validations/oferts/creteOfertYup";
import { usePostOfertMutation } from "api/ofertApi";
import { useGetProductsQuery } from "api/productApi";
import Loading from "components/DRLoading";
import { ProductCard } from "../component/ProductCard/ProductCard";

function AddOfertForm({ warning }) {
  const navigate = useNavigate();
  const {
    data: listProducts,
    isLoading: l1,
    error: e1,
  } = useGetProductsQuery();
  const [createOfert, { isLoading, isError }] = usePostOfertMutation();
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
      description: "",
      basePrice: undefined,
      retailPrice: undefined,
      price1: undefined,
      price2: undefined,
      price3: undefined,
      quantity1: undefined,
      quantity2: undefined,
      quantity3: undefined,
      visible: undefined,
      ofert: undefined,
    },
    onSubmit: async (values) => {
      const newOfert = {
        product: inputValue.id,
        description: values.description,
        visible: values.visible,
        ofert: values.ofert,
        basePrice: values.basePrice,
        retailPrice: values.retailPrice || 0,
        prices: [
          {
            price1: values.price1 || 0,
            price2: values.price2 || 0,
            price3: values.price3 || 0,
            price4: values.price4 || 0,
          },
        ],
        quantities: [
          {
            quantity1: values.quantity1 || 0,
            quantity2: values.quantity2 || 0,
            quantity3: values.quantity3 || 0,
            quantity4: values.quantity4 || 0,
          },
        ],
      };
      const res = await createOfert(newOfert).unwrap();

      if (res.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Oferta creada con éxito",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate(-1);
      }
    },
    validationSchema: creteOfertSchema,
    enableReinitialize: true,
  });
  if (l1) {
    return <Loading />;
  }
  if (e1) {
    return <Alert severity="error">Ha ocurrido un error</Alert>;
  }

  return (
    <>
      {warning && (
        <Alert severity="info">
          La oferta de este producto no ha sido creada, debe crearla antes de
          editarla.
        </Alert>
      )}
      <MDBox pt={4} pb={3}>
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
              {listProducts.products.length === 0 && (
                <Alert severity="warning" sx={{ marginBottom: "30px" }}>
                  No hay productos creados, agregue uno antes de crear una
                  oferta.
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
                autoComplete="product_description"
                name="description"
                label="Presentación (ej. Producto xxx X kilo)"
                id="product_description"
                error={!!formik.errors.description}
                helperText={formik.errors.description}
                onChange={formik.handleChange}
              />

              <TextField
                type="number"
                margin="normal"
                fullWidth
                required
                name="basePrice"
                label="Precio"
                error={!!formik.errors.basePrice}
                helperText={formik.errors.basePrice}
                onChange={formik.handleChange}
              />

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
            <ProductCard
              image={
                inputValue?.img ||
                "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
              }
              name={inputValue?.product || ""}
              presentation={formik.values.description}
              price={formik.values.basePrice}
            />
          </Box>
        </Box>
      </MDBox>
    </>
  );
}

export default AddOfertForm;
