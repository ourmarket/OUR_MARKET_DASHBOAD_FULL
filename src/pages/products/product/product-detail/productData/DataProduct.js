/* eslint-disable react/prop-types */
import { Box, Divider, Grid, Chip, Avatar } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { formatPrice } from "utils/formaPrice";
import { formatQuantity } from "utils/quantityFormat";
// Iconos
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import UpdateIcon from "@mui/icons-material/Update";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icono para fechas
import ProductCharBar1 from "./ProductCharBar1";
import ProductCharBar2 from "./ProductCharBar2";

function DataProduct({
  productById,
  totalProductSell,
  totalProductSellLast30Days,
  totalProductSellByMonth,
}) {
  const currentPrice = productById?.price || 0;
  const hasOffer = productById?.hasOffer;
  const offerPrice = productById?.offerPrice;

  const totalSell = totalProductSell;
  const totalSell30days = totalProductSellLast30Days;

  console.log(productById)

  // Helpers para formatear nombres y fechas
  const createdBy = productById?.createdBy 
    ? `${productById.createdBy.name} ${productById.createdBy.lastName}` 
    : "Sistema";
  
  const lastUpdatedBy = productById?.lastUpdatedBy 
    ? `${productById.lastUpdatedBy.name} ${productById.lastUpdatedBy.lastName}` 
    : "N/A";

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <Box py={3}>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container>
          {/* SECCIÓN IZQUIERDA: IMAGEN Y ESTADO */}
          <Grid item xs={12} md={5} lg={4}>
            <MDBox p={3} display="flex" flexDirection="column" alignItems="center">
              <Box
                component="img"
                src={productById?.img}
                alt={productById?.name}
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                  maxHeight: "350px",
                  objectFit: "cover",
                }}
              />
              <MDBox mt={2} display="flex" gap={1}>
                {productById?.isFeatured && (
                  <Chip label="Destacado" color="warning" variant="gradient" size="small" />
                )}
                <Chip
                  label={productById?.available ? "Visible" : "Oculto"}
                  color={productById?.available ? "success" : "default"}
                  size="small"
                />
              </MDBox>
            </MDBox>
          </Grid>

          {/* SECCIÓN DERECHA: DETALLES */}
          <Grid item xs={12} md={7} lg={8}>
            <MDBox p={3}>
              <MDBox mb={1}>
                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
                  {productById?.brand || "Sin Marca"} • {productById?.category?.name}
                </MDTypography>
                <MDTypography variant="h3" fontWeight="medium" textTransform="capitalize">
                  {productById?.name}
                </MDTypography>
              </MDBox>

              <Divider />

              {/* ... Precios y Stock (Se mantiene igual) ... */}
              <Grid container spacing={2}>
                 <Grid item xs={12} sm={6}>
                  <MDBox>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Precio de Lista ({productById?.unit})
                    </MDTypography>
                    <MDTypography
                      variant="h4"
                      color={hasOffer ? "secondary" : "dark"}
                      sx={{ textDecoration: hasOffer ? "line-through" : "none" }}
                    >
                      {formatPrice(currentPrice)}
                    </MDTypography>
                  </MDBox>
                </Grid>

                {hasOffer && (
                  <Grid item xs={12} sm={6}>
                    <MDBox>
                      <MDTypography variant="button" color="error" fontWeight="bold">
                        Precio Oferta Activa
                      </MDTypography>
                      <MDTypography variant="h4" color="success">
                        {formatPrice(offerPrice)}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <MDBox p={2} bgColor="grey-100" borderRadius="lg" display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <InventoryIcon sx={{ mr: 1, color: "info.main" }} />
                      <MDTypography variant="h6">Stock Disponible:</MDTypography>
                    </Box>
                    <MDTypography variant="h5" color={productById?.stockAvailable <= 0 ? "error" : "dark"}>
                      {productById?.stockAvailable} 
                    </MDTypography>
                  </MDBox>
                </Grid>
              </Grid>

              {/* SECCIÓN AUDITORÍA CON FECHAS */}
              <MDBox mt={3} p={2} sx={{ border: "1px dashed #ddd", borderRadius: "10px", bgcolor: "#fafafa" }}>
                <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase" display="block" mb={2}>
                  Creación y edición
                </MDTypography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex">
                      <Avatar sx={{ bgcolor: "info.main", width: 38, height: 38, mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                       <MDTypography variant="caption" color="text" fontWeight="bold" display="block" sx={{mb: 0.5}}>
                          CREADO POR
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium" display="block" lineHeight={1.2}>
                          {createdBy}
                        </MDTypography>
                        <MDTypography variant="caption" fontWeight="small" display="block" lineHeight={1.2}>
                          {productById.createdBy._id}
                        </MDTypography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <AccessTimeIcon sx={{ fontSize: "14px", mr: 0.5, color: "text.secondary" }} />
                          <MDTypography variant="caption" color="secondary">
                            {formatDate(productById?.createdAt)}
                          </MDTypography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box display="flex">
                      <Avatar sx={{ bgcolor: "secondary.main", width: 38, height: 38, mr: 2 }}>
                        <UpdateIcon />
                      </Avatar>
                      <Box>
                        <MDTypography variant="caption" color="text" fontWeight="bold" display="block" sx={{mb: 0.5}}>
                          ÚLTIMA EDICIÓN
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="medium" display="block" lineHeight={1.2}>
                          {lastUpdatedBy}
                        </MDTypography>
                         <MDTypography variant="caption" fontWeight="small" display="block" lineHeight={1.2}>
                          {productById?.lastUpdatedBy?._id || 'N/A'}
                        </MDTypography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <AccessTimeIcon sx={{ fontSize: "14px", mr: 0.5, color: "text.secondary" }} />
                          <MDTypography variant="caption" color="secondary">
                            {formatDate(productById?.updatedAt)}
                          </MDTypography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </MDBox>

              {/* ... Resto del componente (Dashboard de Ventas) ... */}
              <MDBox mt={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <MDBox border="1px solid #eee" borderRadius="lg" p={2}>
                      <MDTypography variant="button" fontWeight="bold" color="info" textTransform="uppercase">
                        Últimos 30 días
                      </MDTypography>
                      <DataRow label="Cantidad" value={`${totalSell30days?.count || 0} unid.`} />
                      <DataRow label="Ingresos" value={formatPrice(totalSell30days?.total || 0)} />
                      <DataRow label="Ganancia" value={formatPrice(totalSell30days?.totalProfits || 0)} highlight />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MDBox border="1px solid #eee" borderRadius="lg" p={2}>
                      <MDTypography variant="button" fontWeight="bold" color="dark" textTransform="uppercase">
                        Histórico Total
                      </MDTypography>
                      <DataRow label="Cantidad" value={`${totalSell?.count || 0} unid.`} />
                      <DataRow label="Ingresos" value={formatPrice(totalSell?.total || 0)} />
                      <DataRow label="Margen Prom." value={`${totalSell ? formatQuantity((totalSell.totalProfits * 100) / totalSell.total) : 0}%`} />
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>

            </MDBox>
          </Grid>
        </Grid>
      </Box>

      {/* Gráficos */}
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ProductCharBar1 reports={totalProductSellByMonth} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProductCharBar2 reports={totalProductSellByMonth} />
          </Grid>
        </Grid>
      </MDBox>
    </Box>
  );
}

function DataRow({ label, value, highlight = false }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
      <MDTypography variant="button" color="text">{label}:</MDTypography>
      <MDTypography variant="button" fontWeight="bold" color={highlight ? "success" : "dark"}>
        {value}
      </MDTypography>
    </Box>
  );
}

export default DataProduct;