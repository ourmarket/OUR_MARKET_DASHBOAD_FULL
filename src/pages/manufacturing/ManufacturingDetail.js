import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";

// Data and Helpers
import {
  getProductionOrder,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "./mockData";
import Swal from "sweetalert2";
import colors from "assets/theme/base/colors";

const getStatusLabel = (status) => {
  switch (status) {
    case "draft":
      return "Borrador";
    case "in_progress":
      return "En Proceso";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "draft":
      return "secondary";
    case "in_progress":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "info";
  }
};

const ManufacturingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getProductionOrder(id || "");

  if (!order) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={10} textAlign="center">
          <Icon sx={{ fontSize: "100px !important", color: "grey-300", mb: 2 }}>
            precision_manufacturing
          </Icon>
          <MDTypography variant="h4" fontWeight="bold">
            Orden no encontrada
          </MDTypography>
          <MDTypography variant="button" color="text" mb={3} display="block">
            La orden de producción solicitada no existe o ha sido eliminada.
          </MDTypography>
          <MDButton
            variant="gradient"
            color="info"
            component={Link}
            to="/manufactura/ordenes"
          >
            VOLVER A PRODUCCIÓN
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  const handleExecute = () => {
    Swal.fire({
      title: "¿Confirmar Ejecución?",
      html: `
        <div style="text-align: left; font-size: 0.9rem;">
          <p>Al ejecutar esta producción:</p>
          <ul>
            <li>Se descontarán los insumos del stock</li>
            <li>Se ingresarán los productos terminados</li>
            <li>La orden no podrá editarse ni revertirse</li>
          </ul>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.info.main,
      cancelButtonColor: colors.secondary.main,
      confirmButtonText: "EJECUTAR",
      cancelButtonText: "CANCELAR",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("¡Éxito!", "Producción ejecutada correctamente", "success");
        navigate("/manufactura/ordenes");
      }
    });
  };

  const isReadOnly =
    order.status === "completed" || order.status === "cancelled";
  const canExecute = order.status === "draft" || order.status === "in_progress";

  const inputColumns = [
    {
      field: "name",
      headerName: "Producto",
      flex: 2,
      valueGetter: (p) => p.row.product.name,
    },
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      valueGetter: (p) => p.row.product.code,
    },
    {
      field: "quantityRequired",
      headerName: "Cantidad",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="bold" color="error">
          -{row.quantityRequired} {row.product.unit}
        </MDTypography>
      ),
    },
    {
      field: "stockBefore",
      headerName: "Stock Antes",
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "stockAfter",
      headerName: "Stock Después",
      flex: 1,
      align: "right",
      headerAlign: "right",
      valueGetter: (p) =>
        isReadOnly ? p.row.stockBefore - p.row.quantityRequired : "-",
    },
  ];

  const outputColumns = [
    {
      field: "name",
      headerName: "Producto",
      flex: 2,
      valueGetter: (p) => p.row.product.name,
    },
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      valueGetter: (p) => p.row.product.code,
    },
    {
      field: "quantityProduced",
      headerName: "Cantidad",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="bold" color="success">
          +{row.quantityProduced} {row.product.unit}
        </MDTypography>
      ),
    },
    {
      field: "unitCost",
      headerName: "Costo Unit.",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => formatCurrency(value),
    },
    {
      field: "totalCost",
      headerName: "Total",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <MDTypography variant="button" fontWeight="bold">
          {formatCurrency(value)}
        </MDTypography>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Header de la Orden */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Orden {order.orderNumber}
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              {order.recipeName || "Producción manual"}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" gap={1}>
            {canExecute && (
              <MDButton variant="gradient" color="info" onClick={handleExecute}>
                <Icon sx={{ mr: 1 }}>play_circle</Icon> EJECUTAR PRODUCCIÓN
              </MDButton>
            )}
            <MDButton
              variant="outlined"
              color="dark"
              component={Link}
              to="/manufactura/ordenes"
            >
              VOLVER
            </MDButton>
          </MDBox>
        </MDBox>

        <Grid container spacing={3}>
          {/* Contenido Principal (8 col) */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Aviso de Solo Lectura */}
              {isReadOnly && (
                <Alert severity="info" variant="outlined">
                  Esta orden está{" "}
                  {order.status === "completed" ? "completada" : "cancelada"} y
                  no puede ser modificada. Los movimientos de stock generados
                  son inmutables.
                </Alert>
              )}

              {/* Timeline de Eventos */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center" gap={1}>
                  <Icon color="dark">history</Icon>
                  <MDTypography variant="h6">Timeline de Eventos</MDTypography>
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox p={3}>
                  <MDBox position="relative">
                    {order.events.map((event, index) => (
                      <MDBox
                        key={index}
                        display="flex"
                        gap={2}
                        mb={index < order.events.length - 1 ? 3 : 0}
                      >
                        <MDBox
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="32px"
                            height="32px"
                            borderRadius="50%"
                            bgColor="info"
                            color="white"
                          >
                            <Icon fontSize="small">check</Icon>
                          </MDBox>
                          {index < order.events.length - 1 && (
                            <MDBox
                              width="2px"
                              flexGrow={1}
                              bgColor="grey-200"
                              my={0.5}
                            />
                          )}
                        </MDBox>
                        <MDBox pb={1}>
                          <MDTypography
                            variant="button"
                            fontWeight="bold"
                            display="block"
                          >
                            {event.action}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            {formatDateTime(event.date)} • {event.user}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    ))}
                  </MDBox>
                </MDBox>
              </Card>

              {/* Insumos Consumidos */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center" gap={1}>
                  <Icon color="error">arrow_downward</Icon>
                  <MDTypography variant="h6">Insumos Consumidos</MDTypography>
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox sx={{ width: "100%" }}>
                  <DataGrid
                    autoHeight
                    rows={order.inputs}
                    columns={inputColumns}
                    getRowId={(r) => r.productId}
                    hideFooter
                    sx={{ border: "none" }}
                  />
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox p={2} display="flex" justifyContent="flex-end">
                  <MDBox textAlign="right">
                    <MDTypography variant="caption" color="text">
                      Costo Total Insumos
                    </MDTypography>
                    <MDTypography variant="h5" fontWeight="bold">
                      {formatCurrency(order.totalInputCost)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Productos Generados */}
              <Card>
                <MDBox p={2} display="flex" alignItems="center" gap={1}>
                  <Icon color="success">arrow_upward</Icon>
                  <MDTypography variant="h6">Productos Generados</MDTypography>
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox sx={{ width: "100%" }}>
                  <DataGrid
                    autoHeight
                    rows={order.outputs}
                    columns={outputColumns}
                    getRowId={(r) => r.productId}
                    hideFooter
                    sx={{ border: "none" }}
                  />
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox p={2} display="flex" justifyContent="flex-end">
                  <MDBox textAlign="right">
                    <MDTypography variant="caption" color="text">
                      Valor Total Producido
                    </MDTypography>
                    <MDTypography
                      variant="h5"
                      fontWeight="bold"
                      color="success"
                    >
                      {formatCurrency(order.totalOutputCost)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </MDBox>
          </Grid>

          {/* Sidebar (4 col) */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Resumen de Estado */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" mb={2}>
                    Estado de la Orden
                  </MDTypography>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    mb={1.5}
                    alignItems="center"
                  >
                    <MDTypography variant="button" color="text">
                      Estado
                    </MDTypography>
                    <MDBadge
                      variant="gradient"
                      color={getStatusColor(order.status)}
                      badgeContent={getStatusLabel(order.status)}
                      size="xs"
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1.5}>
                    <MDTypography variant="button" color="text">
                      Fecha
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {formatDate(order.date)}
                    </MDTypography>
                  </MDBox>
                  {order.recipeName && (
                    <MDBox display="flex" justifyContent="space-between">
                      <MDTypography variant="button" color="text">
                        Receta
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="medium">
                        {order.recipeName}
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
              </Card>

              {/* Resumen de Costos */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" mb={2}>
                    Resumen de Costos
                  </MDTypography>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Insumos
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {formatCurrency(order.totalInputCost)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Producción
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="medium"
                      color="success"
                    >
                      {formatCurrency(order.totalOutputCost)}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mt={1}>
                    <MDTypography variant="button" fontWeight="bold">
                      Margen
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      color={
                        order.totalOutputCost >= order.totalInputCost
                          ? "success"
                          : "error"
                      }
                    >
                      {formatCurrency(
                        order.totalOutputCost - order.totalInputCost
                      )}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Información / Auditoría */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" mb={2}>
                    Información
                  </MDTypography>
                  <MDBox display="flex" alignItems="center" gap={1} mb={1.5}>
                    <Icon fontSize="small" sx={{ color: "text.secondary" }}>
                      person
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      Creado por:
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="bold">
                      {order.createdBy}
                    </MDTypography>
                  </MDBox>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={order.executedBy ? 1.5 : 0}
                  >
                    <Icon fontSize="small" sx={{ color: "text.secondary" }}>
                      calendar_today
                    </Icon>
                    <MDTypography variant="caption" color="text">
                      Creado:
                    </MDTypography>
                    <MDTypography variant="caption" fontWeight="bold">
                      {formatDateTime(order.createdAt)}
                    </MDTypography>
                  </MDBox>
                  {order.executedBy && (
                    <>
                      <MDBox
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mb={1.5}
                      >
                        <Icon fontSize="small" sx={{ color: "text.secondary" }}>
                          person_check
                        </Icon>
                        <MDTypography variant="caption" color="text">
                          Ejecutado por:
                        </MDTypography>
                        <MDTypography variant="caption" fontWeight="bold">
                          {order.executedBy}
                        </MDTypography>
                      </MDBox>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <Icon fontSize="small" sx={{ color: "text.secondary" }}>
                          event_available
                        </Icon>
                        <MDTypography variant="caption" color="text">
                          Ejecutado:
                        </MDTypography>
                        <MDTypography variant="caption" fontWeight="bold">
                          {order.executedAt && formatDateTime(order.executedAt)}
                        </MDTypography>
                      </MDBox>
                    </>
                  )}
                </MDBox>
              </Card>

              {/* Observaciones */}
              {order.observations && (
                <Card>
                  <MDBox p={2}>
                    <MDTypography
                      variant="h6"
                      mb={1}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon>article</Icon> Observaciones
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      color="text"
                      sx={{ fontStyle: "italic" }}
                    >
                      {order.observations}
                    </MDTypography>
                  </MDBox>
                </Card>
              )}

              {/* Accesos Rápidos */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" mb={2}>
                    Accesos Rápidos
                  </MDTypography>
                  <MDBox display="flex" flexDirection="column" gap={1}>
                    <MDButton
                      variant="outlined"
                      color="dark"
                      size="small"
                      fullWidth
                      component={Link}
                      to="/stock/movements"
                      sx={{ justifyContent: "flex-start", gap: 1 }}
                    >
                      <Icon>inventory_2</Icon> Ver Movimientos de Stock
                    </MDButton>
                    {order.recipeId && (
                      <MDButton
                        variant="outlined"
                        color="dark"
                        size="small"
                        fullWidth
                        component={Link}
                        to="/manufactura/recetas"
                        sx={{ justifyContent: "flex-start", gap: 1 }}
                      >
                        <Icon>menu_book</Icon> Ver Receta Utilizada
                      </MDButton>
                    )}
                  </MDBox>
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default ManufacturingDetail;
