/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Card, Divider, Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { formatPrice } from "utils/formaPrice";

function Details({ order }) {
  const { orderItems, shippingAddress, deliveryZone, deliveryTruck } = order.data.order;
  const { order: orderDetail } = order.data;

  // Formateador de precios seguro
  const safeFormatPrice = (price) => {
    return typeof price === "number" ? formatPrice(price) : `$${price}`;
  };

  // Renderizar badge de estado de orden con estilos premium
  const renderStatusBadge = (status) => {
    const isDelivered = status?.toLowerCase() === "entregado";
    const isPending = status?.toLowerCase() === "pendiente";
    
    let bgColor = "rgba(189, 189, 189, 0.15)";
    let textColor = "#757575";
    
    if (isDelivered) {
      bgColor = "rgba(76, 175, 80, 0.15)";
      textColor = "#2e7d32";
    } else if (isPending) {
      bgColor = "rgba(255, 179, 0, 0.15)";
      textColor = "#e65100";
    }

    return (
      <span
        style={{
          backgroundColor: bgColor,
          color: textColor,
          padding: "5px 12px",
          borderRadius: "20px",
          fontWeight: "bold",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: "24px",
        width: "100%",
        pb: 4,
      }}
    >
      {/* Columna Izquierda: Productos */}
      <Box sx={{ width: { xs: "100%", lg: "66%" }, display: "flex", flexDirection: "column", gap: "24px" }}>
        <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <MDBox display="flex" alignItems="center" gap="10px" mb={2}>
            <Icon fontSize="medium" color="info">shopping_basket</Icon>
            <MDTypography variant="h6" fontWeight="bold">
              Productos de la Orden
            </MDTypography>
          </MDBox>
          
          <Divider sx={{ mb: 2 }} />

          {/* Tabla simulada de productos */}
          <Box display="flex" flexDirection="column" gap="15px">
            {orderItems.map((product) => (
              <Box 
                key={product._id} 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "20px",
                  p: 1.5,
                  borderRadius: "10px",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.015)"
                  }
                }}
              >
                {/* Imagen del producto */}
                <Box
                  sx={{
                    width: 75,
                    height: 75,
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <img
                    src={product.img || "https://ik.imagekit.io/mrprwema7/user_default_nUfUA9Fxa.png"}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Detalles del producto */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexGrow: 1,
                    gap: "10px",
                  }}
                >
                  <Box>
                    <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                      {product.name}
                    </MDTypography>
                    <MDTypography variant="caption" color="text">
                      Precio Unitario: {safeFormatPrice(product.unitPrice)}
                    </MDTypography>
                  </Box>

                  <Box display="flex" alignItems="center" gap="15px" sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
                    <MDBox 
                      sx={{ 
                        backgroundColor: "rgba(0, 187, 212, 0.08)", 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: "6px",
                      }}
                    >
                      <MDTypography variant="caption" fontWeight="bold" color="info">
                        {product.totalQuantity} {product.unit}
                      </MDTypography>
                    </MDBox>
                    <MDTypography variant="subtitle1" fontWeight="bold" color="dark" sx={{ minWidth: "80px", textAlign: "right" }}>
                      {safeFormatPrice(product.totalPrice)}
                    </MDTypography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* Columna Derecha: Totales y Metadatos */}
      <Box sx={{ width: { xs: "100%", lg: "34%" }, display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Card 1: Resumen Financiero */}
        <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <MDBox display="flex" alignItems="center" gap="10px" mb={2}>
            <Icon fontSize="medium" color="info">receipt</Icon>
            <MDTypography variant="h6" fontWeight="bold">Resumen de Totales</MDTypography>
          </MDBox>
          <Divider />
          
          <Box display="flex" flexDirection="column" gap="12px" my={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="body2" color="text">Subtotal de Compra</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                {safeFormatPrice(orderDetail.subTotal)}
              </MDTypography>
            </Box>

            {/* Línea del Descuento por Puntos */}
            {orderDetail.pointsDiscount > 0 && (
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                sx={{ 
                  backgroundColor: "rgba(76, 175, 80, 0.08)", 
                  p: 1.5, 
                  borderRadius: "8px",
                  border: "1px dashed rgba(76, 175, 80, 0.3)"
                }}
              >
                <MDTypography variant="body2" color="success" fontWeight="bold" display="flex" alignItems="center" gap="5px">
                  <Icon fontSize="small">loyalty</Icon>
                  Descuento Puntos ({orderDetail.pointsUsed} pts)
                </MDTypography>
                <MDTypography variant="subtitle1" color="success" fontWeight="bold">
                  -{safeFormatPrice(orderDetail.pointsDiscount)}
                </MDTypography>
              </Box>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="body2" color="text">Envío / Delivery</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                {safeFormatPrice(orderDetail.tax)}
              </MDTypography>
            </Box>
          </Box>
          
          <Divider />
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={1}>
            <MDTypography variant="h6" fontWeight="bold" color="dark">Total Neto</MDTypography>
            <MDTypography variant="h4" fontWeight="bold" color="info">
              {safeFormatPrice(orderDetail.total)}
            </MDTypography>
          </Box>
        </Card>

        {/* Card 2: Desglose de Métodos de Pago */}
        <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <MDBox display="flex" alignItems="center" gap="10px" mb={2}>
            <Icon fontSize="medium" color="info">account_balance_wallet</Icon>
            <MDTypography variant="h6" fontWeight="bold">Métodos de Cobro</MDTypography>
          </MDBox>
          <Divider />
          
          <Box display="flex" flexDirection="column" gap="10px" my={2}>
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2" color="text">Efectivo ($)</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="medium" color="dark">
                {safeFormatPrice(orderDetail?.payment?.cash || 0)}
              </MDTypography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2" color="text">Transferencia ($)</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="medium" color="dark">
                {safeFormatPrice(orderDetail?.payment?.transfer || 0)}
              </MDTypography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ color: (orderDetail?.payment?.debt || 0) > 0 ? "error.main" : "inherit" }}>
              <MDTypography variant="body2" color={(orderDetail?.payment?.debt || 0) > 0 ? "error" : "text"}>Saldo Pendiente (Deuda)</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="bold" color={(orderDetail?.payment?.debt || 0) > 0 ? "error" : "dark"}>
                {safeFormatPrice(orderDetail?.payment?.debt || 0)}
              </MDTypography>
            </Box>
          </Box>
        </Card>

        {/* Card 3: Datos del Cliente e Información de Envío */}
        <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <MDBox display="flex" alignItems="center" gap="10px" mb={2}>
            <Icon fontSize="medium" color="info">person</Icon>
            <MDTypography variant="h6" fontWeight="bold">Información del Cliente</MDTypography>
          </MDBox>
          <Divider />
          
          <Box display="flex" flexDirection="column" gap="10px" my={2}>
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2" color="text">Nombre</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                {`${shippingAddress.name} ${shippingAddress.lastName}`}
              </MDTypography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2" color="text">Teléfono</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                {shippingAddress.phone || "No cargado"}
              </MDTypography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <MDTypography variant="body2" color="text">Zona de Reparto</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="medium" color="dark">
                {deliveryZone?.name || "Sin zona"}
              </MDTypography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box display="flex" flexDirection="column" gap="4px">
              <MDTypography variant="caption" fontWeight="bold" color="text" uppercase>
                Dirección de Entrega:
              </MDTypography>
              <MDTypography variant="body2" color="dark" fontWeight="medium">
                {shippingAddress.address}
                {shippingAddress.flor && `, Piso ${shippingAddress.flor}`}
                {shippingAddress.department && `, Depto ${shippingAddress.department}`}
              </MDTypography>
              <MDTypography variant="caption" color="text">
                {shippingAddress.city && `${shippingAddress.city}, `}{shippingAddress.province}
              </MDTypography>
            </Box>
          </Box>
        </Card>

        {/* Card 4: Logística y Log */}
        <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <MDBox display="flex" alignItems="center" gap="10px" mb={2}>
            <Icon fontSize="medium" color="info">local_shipping</Icon>
            <MDTypography variant="h6" fontWeight="bold">Logística y Entrega</MDTypography>
          </MDBox>
          <Divider />
          
          <Box display="flex" flexDirection="column" gap="12px" my={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="body2" color="text">Estado del Pedido</MDTypography>
              {renderStatusBadge(orderDetail.status)}
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="body2" color="text">Repartidor (Camión)</MDTypography>
              <MDTypography variant="subtitle2" fontWeight="bold" color="dark">
                {deliveryTruck?.truckId || "No asignado"}
              </MDTypography>
            </Box>
          </Box>
        </Card>

      </Box>
    </Box>
  );
}

export default Details;
