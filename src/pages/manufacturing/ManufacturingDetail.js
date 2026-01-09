import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Swal from "sweetalert2";

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
import { DataGrid } from "@mui/x-data-grid";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";

// API
import {
  useGetManufacturingOrderByIdQuery,
  useExecuteManufacturingOrderMutation,
} from "api/manufacturingOrderApi";

// Utils
import { formatPrice } from "utils/formaPrice";
import colors from "assets/theme/base/colors";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(date);
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const getStatusLabel = (status) => {
  switch (status) {
    case "DRAFT":
      return "Borrador";
    case "EXECUTED":
      return "Ejecutada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "EXECUTED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "info";
  }
};

const ManufacturingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // API Query
  const { data: order, isLoading } = useGetManufacturingOrderByIdQuery(id);
  const [executeOrder, { isLoading: isExecuting }] =
    useExecuteManufacturingOrderMutation();

  // Calculate costs if not provided directly (though backend sends totals usually)
  // Backend returns `totalInputCost` and `totalOutputCost` for Executed orders.
  // For Drafts, we might need to estimate based on current product cost or send it from backend.
  // Let's assume for DRAFT we calculate specific to this view for estimation.
  const estimatedCosts = useMemo(() => {
    if (!order) return { input: 0, output: 0 };
    if (order.status === "EXECUTED") {
      return {
        input: order.totalInputCost || 0,
        output: order.totalOutputCost || 0,
      };
    }
    // Draft estimation
    const input = order.inputs.reduce(
      (acc, item) =>
        acc + (item.product?.cost || item.product?.price || 0) * item.quantity,
      0
    );
    const output = order.outputs.reduce(
      (acc, item) =>
        acc + (item.product?.cost || item.product?.price || 0) * item.quantity,
      0
    );
    return { input, output };
  }, [order]);

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
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await executeOrder(id).unwrap();
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            `Fallo: ${error?.data?.message || "Error desconocido"}`
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("¡Éxito!", "Producción ejecutada correctamente", "success");
        // We assume the query will refetch or we can navigate/refresh
        // navigate("/manufactura/ordenes"); // Optional: stay or go back
      }
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <LinearProgress color="info" />
      </DashboardLayout>
    );
  }

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

  const isReadOnly =
    order.status === "EXECUTED" || order.status === "CANCELLED";
  const canExecute = order.status === "DRAFT";

  const inputColumns = [
    {
      field: "name",
      headerName: "Producto",
      flex: 2,
      valueGetter: (params) => params.row.product?.name || "Desconocido",
    },
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      valueGetter: (params) => params.row.product?.code || "-",
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="bold" color="error">
          -{row.quantity} {row.product?.unit || "u"}
        </MDTypography>
      ),
    },
    {
      field: "unitCost",
      headerName: isReadOnly ? "Costo Unit. Real" : "Costo Est.",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const val = isReadOnly
          ? row.unitCost
          : row.product?.cost || row.product?.price || 0;
        return formatPrice(val);
      },
    },
  ];

  const outputColumns = [
    {
      field: "name",
      headerName: "Producto",
      flex: 2,
      valueGetter: (params) => params.row.product?.name || "Desconocido",
    },
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      valueGetter: (params) => params.row.product?.code || "-",
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <MDTypography variant="button" fontWeight="bold" color="success">
          +{row.quantity} {row.product?.unit || "u"}
        </MDTypography>
      ),
    },
    {
      field: "unitCost",
      headerName: isReadOnly ? "Costo Unit. Real" : "Valor Est.",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const val = isReadOnly
          ? row.unitCost
          : row.product?.cost || row.product?.price || 0;
        return formatPrice(val);
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => {
        const cost = isReadOnly
          ? row.unitCost
          : row.product?.cost || row.product?.price || 0;
        return (
          <MDTypography variant="button" fontWeight="bold">
            {formatPrice(cost * row.quantity)}
          </MDTypography>
        );
      },
    },
  ];

  const creatorName = order.createdBy
    ? `${order.createdBy.name} ${order.createdBy.lastName}`
    : "Sistema";

  const productionDate =
    order.productionDate || order.producedAt || order.createdAt;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {isExecuting && <LinearProgress color="warning" sx={{ mb: 1 }} />}

        {/* Header de la Orden */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Orden {order.code}
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              {order.recipeName || "Producción"}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" gap={1}>
            {canExecute && (
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleExecute}
                disabled={isExecuting}
              >
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
                  {order.status === "EXECUTED" ? "completada" : "cancelada"} y
                  no puede ser modificada. Los movimientos de stock generados
                  son inmutables.
                </Alert>
              )}

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
                    getRowId={(r) => r.product?._id || Math.random()}
                    hideFooter
                    sx={{ border: "none" }}
                    disableSelectionOnClick
                  />
                </MDBox>
                <Divider sx={{ m: 0 }} />
                <MDBox p={2} display="flex" justifyContent="flex-end">
                  <MDBox textAlign="right">
                    <MDTypography variant="caption" color="text">
                      Costo Total Insumos
                    </MDTypography>
                    <MDTypography variant="h5" fontWeight="bold">
                      {formatPrice(estimatedCosts.input)}
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
                    getRowId={(r) => r.product?._id || Math.random()}
                    hideFooter
                    sx={{ border: "none" }}
                    disableSelectionOnClick
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
                      {formatPrice(estimatedCosts.output)}
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
                      Fecha Producción
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {formatDate(productionDate)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              {/* Resumen de Costos */}
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h6" mb={2}>
                    Resumen Financiero
                  </MDTypography>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Costo Insumos
                    </MDTypography>
                    <MDTypography variant="button" fontWeight="medium">
                      {formatPrice(estimatedCosts.input)}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mb={1}>
                    <MDTypography variant="button" color="text">
                      Valor Producción
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="medium"
                      color="success"
                    >
                      {formatPrice(estimatedCosts.output)}
                    </MDTypography>
                  </MDBox>
                  <Divider />
                  <MDBox display="flex" justifyContent="space-between" mt={1}>
                    <MDTypography variant="button" fontWeight="bold">
                      Margen Estimado
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      fontWeight="bold"
                      color={
                        estimatedCosts.output >= estimatedCosts.input
                          ? "success"
                          : "error"
                      }
                    >
                      {formatPrice(
                        estimatedCosts.output - estimatedCosts.input
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
                      {creatorName}
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
                </MDBox>
              </Card>

              {/* Observaciones */}
              {order.notes && (
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
                      {order.notes}
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
                      to="/stock/movimientos"
                      sx={{ justifyContent: "flex-start", gap: 1 }}
                    >
                      <Icon>inventory_2</Icon> Ver Movimientos de Stock
                    </MDButton>
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
