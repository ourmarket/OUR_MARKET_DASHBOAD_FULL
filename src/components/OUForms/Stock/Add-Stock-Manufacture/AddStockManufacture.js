/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import colors from "assets/theme/base/colors";
import { useEffect, useState } from "react";

import { creteProductLotsSchema } from "validations/productsLots/creteProductsLotsYup";
import { usePutProductMutation, useGetProductsQuery } from "api/productApi";
import Loading from "components/DRLoading";
import MDTypography from "components/MDTypography";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatQuantity } from "utils/quantityFormat";

const Product = ({ product, mode }) => {
  return (
    <ListItem
      key={product.id}
      secondaryAction={
        <IconButton edge="end" aria-label="delete" sx={{ marginRight: 2 }}>
          <DeleteIcon sx={{ color: "red" }} />
        </IconButton>
      }
      sx={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "10px",
        marginBottom: "15px",
      }}
    >
      <ListItemAvatar>
        <Avatar alt="imagen producto" src={product.img}>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      {mode === "remove" && (
        <MDTypography variant="body2">
          {`${product.product} || Quitar: ${
            product.quantity
          } unid. || Quedan: ${+product.stockValue - +product.quantity} unid.`}
        </MDTypography>
      )}
      {mode === "add" && (
        <MDTypography variant="body2">
          {`${product.product} || Agregar: ${
            product.quantity
          } unid. || Quedan: ${+product.stockValue + +product.quantity} unid.`}
        </MDTypography>
      )}
    </ListItem>
  );
};

function AddStockManufacture({ ListSuppliers }) {
  const navigate = useNavigate();

  const {
    data: listProducts,
    isLoading: l1,
    error: e1,
  } = useGetProductsQuery();
  const [editProduct, { isLoading, isError }] = usePutProductMutation();
  const [products, setProducts] = useState([]);

  const [inputValue1, setInputValue1] = useState(null);
  const [inputValue2, setInputValue2] = useState(null);

  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);

  const [stock1, setStock1] = useState(null);
  const [stock2, setStock2] = useState(null);

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
            stockValue: formatQuantity(
              product.stock.reduce((acc, curr) => acc + curr.stock, 0)
            ),
            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
          };
        })
        .sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter));

      setInputValue1(autoCompleteProducts[0]);
      setStock1(autoCompleteProducts[0].stockValue);

      setInputValue2(autoCompleteProducts[0]);
      setStock2(autoCompleteProducts[0].stockValue);

      setProducts(autoCompleteProducts);
    }
  }, [listProducts]);

  const formik = useFormik({
    initialValues: {
      product1: "",
      stock1: 0,
      quantity1: 0,
      stock2: 0,
      quantity2: 0,
    },
    onSubmit: async () => {},
    validationSchema: creteProductLotsSchema,
  });

  const handleAdd1 = () => {
    setList1([...list1, { ...inputValue1, quantity: formik.values.quantity1 }]);
  };
  const handleAdd2 = () => {
    setList2([...list2, { ...inputValue2, quantity: formik.values.quantity2 }]);
  };

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
            <MDTypography variant="body2" sx={{ marginBottom: "30px" }}>
              Se realiza la manofactura de un producto propio, por ejemplo, con
              pechugas, pan rallado y huevo, se realizan Supremas de Pollo. Se
              quitar entonces los primeros del stock y agregar al stock la
              cantidad creada de Supremas.
            </MDTypography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box
                sx={{
                  width: "50%",
                  border: "1px solid #ccc",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <MDTypography variant="h6" sx={{ marginBottom: "30px" }}>
                  Materia Prima
                </MDTypography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    marginBottom: "30px",
                  }}
                >
                  <Autocomplete
                    options={products}
                    getOptionLabel={(options) =>
                      `${options.product} || Stock: ${options.stockValue}`
                    }
                    groupBy={(option) => option.firstLetter}
                    multiple={false}
                    id="controlled-demo"
                    value={inputValue1}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, newValue) => {
                      setInputValue1(newValue);
                      setStock1(newValue.stockValue);
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
                    sx={{ maxWidth: "80px" }}
                    type="number"
                    name="stock1"
                    label="Stock"
                    InputProps={{ sx: { height: 55 } }}
                    value={stock1}
                    error={!!formik.errors.stock1}
                    helperText={formik.errors.stock1}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    sx={{ maxWidth: "80px" }}
                    type="number"
                    name="quantity1"
                    label="Quitar"
                    InputProps={{ sx: { height: 55 } }}
                    value={formik.values.quantity1}
                    error={!!formik.errors.quantity1}
                    helperText={formik.errors.quantity1}
                    onChange={formik.handleChange}
                  />

                  <Button
                    variant="contained"
                    onClick={handleAdd1}
                    sx={{
                      height: 55,
                      backgroundColor: `${colors.error.main}`,
                      color: "white !important",
                      "&:hover": {
                        backgroundColor: `${colors.error.focus}`,
                      },
                    }}
                  >
                    Quitar
                  </Button>
                </Box>
                {list1.length === 0 && (
                  <Alert severity="info">Agregar producto</Alert>
                )}
                <List>
                  {list1.map((product) => (
                    <Product key={product.id} product={product} mode="remove" />
                  ))}
                </List>
              </Box>
              <Box
                sx={{
                  width: "50%",
                  border: "1px solid #ccc",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <MDTypography variant="h6" sx={{ marginBottom: "30px" }}>
                  Producto obtenido
                </MDTypography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    marginBottom: "30px",
                  }}
                >
                  <Autocomplete
                    options={products}
                    getOptionLabel={(options) => options.product}
                    groupBy={(option) => option.firstLetter}
                    multiple={false}
                    id="controlled-demo"
                    value={inputValue2}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, newValue) => {
                      setInputValue2(newValue);
                      setStock2(newValue.stockValue);
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
                    sx={{ maxWidth: "80px" }}
                    type="number"
                    name="stock2"
                    label="Stock"
                    InputProps={{ sx: { height: 55 } }}
                    value={stock2}
                    error={!!formik.errors.stock2}
                    helperText={formik.errors.stock2}
                    onChange={formik.handleChange}
                  />
                  <TextField
                    sx={{ maxWidth: "80px" }}
                    type="number"
                    name="quantity2"
                    label="Agregar"
                    InputProps={{ sx: { height: 55 } }}
                    value={formik.values.quantity2}
                    error={!!formik.errors.quantity2}
                    helperText={formik.errors.quantity2}
                    onChange={formik.handleChange}
                  />

                  <Button
                    variant="contained"
                    onClick={handleAdd2}
                    sx={{
                      height: 55,

                      backgroundColor: `${colors.info.main}`,
                      color: "white !important",
                    }}
                  >
                    Agregar
                  </Button>
                </Box>
                {list2.length === 0 && (
                  <Alert severity="info">Agregar producto</Alert>
                )}
                <List>
                  {list2.map((product) => (
                    <Product key={product.id} product={product} mode="add" />
                  ))}
                </List>
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
