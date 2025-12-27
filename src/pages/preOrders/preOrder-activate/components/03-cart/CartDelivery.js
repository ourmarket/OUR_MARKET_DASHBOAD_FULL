/* eslint-disable no-underscore-dangle */
import { Alert, Box, Card, Divider } from "@mui/material";
import MDTypography from "components/MDTypography";
import { useDispatch, useSelector } from "react-redux";
import colors from "assets/theme/base/colors";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import { usePostOrderMutation } from "api/orderApi";
import { useNavigate } from "react-router-dom";
import { clearCart } from "reduxToolkit/cartSlice";
import ItemCart from "./ItemCart";

function CartDelivery() {
  const {
    products,
    shippingAddress,
    shippingCost,
    subTotal,
    client,
    validStockQuantity,
  } = useSelector((store) => store.cart);
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading: l1, isError: e1 }] = usePostOrderMutation();

  const deliveryTruckSlit = shippingAddress
    ? shippingAddress.deliveryTruck.split("-")
    : "";
  const deliveryZoneSplit = shippingAddress
    ? shippingAddress.deliveryZone.split("-")
    : "";

  const handlerCreate = async () => {
    const productsOrder = products.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      unit: item.product.unit,
      description: item.product.description,
      img: item.product.img,
      quantity: item.finalQuantity,
      price: item.finalPrice,
      totalQuantity: item.finalQuantity,
      totalPrice: item.finalPrice,
      unitPrice: item.basePrice,
      unitCost: 0,
      stockId: null,
      stockData: [],
    }));

    const newOrder = {
      userId: client.user._id,
      client: client.client._id,
      orderItems: productsOrder,
      shippingAddress,
      deliveryTruck: deliveryTruckSlit[0],
      employeeId: user,
      deliveryZone: deliveryZoneSplit[0],
      numberOfItems: products.length,
      tax: +shippingCost,
      subTotal,
      total: +shippingCost + subTotal,
      status: "Pendiente",
      active: shippingAddress.active,
    };

    console.log(newOrder);

    if (validStockQuantity === false) {
      return;
    }

    const res = await createOrder(newOrder).unwrap();

    if (res.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Orden creada con éxito",
        showConfirmButton: false,
        timer: 2500,
      });
      dispatch(clearCart());

      navigate("/ordenes/lista");
    }
  };

  if (!shippingAddress) {
    return (
      <Alert severity="warning">Debes cargar antes los datos de envío</Alert>
    );
  }

  return (
    <>
      {!shippingAddress.lat && (
        <Alert severity="warning">
          La dirección del cliente no tiene cargada las coordenadas
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          gap: "30px",
        }}
      >
        <Box
          sx={{
            width: "70%",
          }}
        >
          {products.map((product) => (
            <ItemCart product={product} key={product._id} />
          ))}
        </Box>
        <Card
          sx={{
            width: "30%",
            padding: "30px",
            alignSelf: "flex-start",
          }}
        >
          <MDTypography variant="h6">Resumen</MDTypography>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Subtotal</MDTypography>
            <MDTypography variant="h6">${subTotal}</MDTypography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Envío</MDTypography>
            <MDTypography variant="h6">${+shippingCost}</MDTypography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between" mb={3}>
            <MDTypography variant="body2">Total</MDTypography>
            <MDTypography variant="h6">
              ${subTotal + +shippingCost}
            </MDTypography>
          </Box>
          <MDTypography variant="h6">Datos de envío</MDTypography>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Nombre</MDTypography>
            <MDTypography variant="h6">{`${shippingAddress.name} ${shippingAddress.lastName}`}</MDTypography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Dirección</MDTypography>
            <MDTypography variant="h6">{shippingAddress.address}</MDTypography>
          </Box>
          {shippingAddress.flor && (
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2">Piso</MDTypography>
              <MDTypography variant="h6">{shippingAddress.flor}</MDTypography>
            </Box>
          )}
          {shippingAddress.department && (
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2">Departamento</MDTypography>
              <MDTypography variant="h6">
                {shippingAddress.department}
              </MDTypography>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Telefono</MDTypography>
            <MDTypography variant="h6">{shippingAddress.phone}</MDTypography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Provincia</MDTypography>
            <MDTypography variant="h6">{shippingAddress.province}</MDTypography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Ciudad</MDTypography>
            <MDTypography variant="h6">{shippingAddress.city}</MDTypography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Zona</MDTypography>
            <MDTypography variant="h6">{deliveryZoneSplit[1]}</MDTypography>
          </Box>

          <Divider />
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Repartidor</MDTypography>
            <MDTypography variant="h6">{deliveryTruckSlit[1]}</MDTypography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <MDTypography variant="body2">Enviar a repartidor</MDTypography>
            <MDTypography variant="h6">
              {shippingAddress.active === true ? "Si" : "No"}
            </MDTypography>
          </Box>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={l1}
            onClick={handlerCreate}
            disabled={!validStockQuantity}
            sx={{
              mt: 3,
              backgroundColor: `${colors.info.main}`,
              color: "white !important",
              width: "100%",
            }}
          >
            Confirmar orden
          </LoadingButton>
          {e1 && <Alert severity="error">Error: orden no creada!</Alert>}
          {!validStockQuantity && (
            <Alert severity="error">
              No hay suficiente stock para crear la orden
            </Alert>
          )}
        </Card>
      </Box>
    </>
  );
}

export default CartDelivery;
