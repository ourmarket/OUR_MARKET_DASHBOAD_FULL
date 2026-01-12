import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

// API and Helpers
import {
  useGetBomsQuery,
  useToggleBomActiveMutation,
  useDeleteBomMutation,
} from "api/bomApi";
import Swal from "sweetalert2";

// Temporary helper until a global one is used
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-AR");
};

const Recipes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const { data, isLoading, isError, refetch } = useGetBomsQuery({
    page,
    limit: 100,
    search,
    isActive: statusFilter,
  });

  const [toggleActive] = useToggleBomActiveMutation();
  const [deleteBom] = useDeleteBomMutation();

  const handleToggleActive = async (e, id) => {
    e.stopPropagation();
    try {
      await toggleActive(id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado de la receta",
      });
    }
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar la receta: ${name}? Esta acción solo será posible si nunca ha sido utilizada.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBom(id).unwrap();
          Swal.fire("¡Borrado!", "La receta ha sido eliminada.", "success");
        } catch (error) {
          Swal.fire(
            "Error",
            error.data?.message || "No se pudo eliminar la receta",
            "error"
          );
        }
      }
    });
  };

  const calculateRecipeCost = (recipe) => {
    if (!recipe.inputs) return 0;
    return recipe.inputs.reduce(
      (sum, input) => sum + (input.product?.unitCost || 0) * input.quantity,
      0
    );
  };

  const handleClose = () => setSelectedRecipe(null);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const columns = [
    {
      field: "code", // Changed from orderNumber
      headerName: "Código",
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => (
        <MDTypography
          variant="button"
          fontWeight="medium"
          sx={{ fontFamily: "monospace" }}
        >
          {value}
        </MDTypography>
      ),
    },
    {
      field: "name",
      headerName: "Nombre de Receta",
      flex: 1,
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="bold">
          {params.row.name}
        </MDTypography>
      ),
    },
    {
      field: "product",
      headerName: "Producto Principal",
      flex: 1,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon fontSize="small" sx={{ color: "text.secondary" }}>
            inventory_2
          </Icon>
          <MDTypography variant="button">
            {params.row.product?.name || "N/A"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "yieldQuantity",
      headerName: "Rendimiento",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {params.row.yieldQuantity || 1} {params.row.product?.unit || ""}
        </MDTypography>
      ),
    },
    {
      field: "inputs",
      headerName: "Insumos",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <MDTypography variant="button" color="text">
          {params.row.inputs?.length || 0} items
        </MDTypography>
      ),
    },
    {
      field: "isActive",
      headerName: "Estado",
      flex: 0.7,
      renderCell: (params) => (
        <Tooltip title="Click para cambiar estado" placement="top">
          <MDBox onClick={(e) => handleToggleActive(e, params.row._id)}>
            <MDBadge
              variant="gradient"
              color={params.row.isActive ? "success" : "secondary"}
              badgeContent={params.row.isActive ? "ACTIVA" : "INACTIVA"}
              size="xs"
              sx={{ cursor: "pointer" }}
            />
          </MDBox>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <MDBox display="flex" justifyContent="flex-end" gap={0.5}>
          <Tooltip title="Ver Detalle">
            <MDButton
              variant="text"
              color="info"
              size="small"
              iconOnly
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRecipe(params.row);
              }}
            >
              <Icon>visibility</Icon>
            </MDButton>
          </Tooltip>
          <Tooltip title="Eliminar Receta">
            <MDButton
              variant="text"
              color="error"
              size="small"
              iconOnly
              onClick={(e) => handleDelete(e, params.row._id, params.row.name)}
            >
              <Icon>delete</Icon>
            </MDButton>
          </Tooltip>
        </MDBox>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Header Section */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold">
              Gestión de Recetas (BOM)
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Fórmulas de producción y estándares de costos
            </MDTypography>
          </MDBox>
          <MDButton
            variant="gradient"
            color="dark"
            component={Link}
            to="/manufactura/recetas/nueva"
          >
            <Icon sx={{ mr: 1, fontWeight: "bold" }}>add</Icon> NUEVA RECETA
          </MDButton>
        </MDBox>

        {/* Filters Card */}
        <Card sx={{ mb: 3 }}>
          <MDBox p={3}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <MDInput
                  fullWidth
                  label="Buscar por nombre, código o producto..."
                  placeholder="Ej: Hamburguesa de pollo"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  InputProps={{
                    startAdornment: (
                      <MDBox mr={1} color="text">
                        <Icon>search</Icon>
                      </MDBox>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Estado</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    label="Estado"
                    onChange={handleStatusChange}
                    sx={{ height: "45px" }}
                  >
                    <MenuItem value="">Todos los estados</MenuItem>
                    <MenuItem value="true">Activas</MenuItem>
                    <MenuItem value="false">Inactivas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("");
                    setPage(1);
                  }}
                  startIcon={<Icon>filter_alt_off</Icon>}
                  sx={{ height: "45px" }}
                >
                  Limpiar
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </Card>

        {/* Main Table Card */}
        <Card>
          <MDBox p={2} sx={{ height: 600, width: "100%" }}>
            {isLoading ? (
              <MDBox textAlign="center" py={10}>
                <CircularProgress color="info" />
              </MDBox>
            ) : isError ? (
              <MDBox p={3} textAlign="center">
                <Alert severity="error">
                  Error al cargar las recetas. Por favor intente de nuevo.
                </Alert>
                <MDButton
                  variant="text"
                  color="info"
                  onClick={() => refetch()}
                  sx={{ mt: 2 }}
                >
                  <Icon>refresh</Icon>&nbsp; Reintentar
                </MDButton>
              </MDBox>
            ) : (
              <DataGrid
                rows={data?.data || []}
                columns={columns}
                getRowId={(row) => row._id}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                /*  slots={{ toolbar: GridToolbar }} */
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f2f5",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8f9fa",
                    borderBottom: "none",
                  },
                }}
              />
            )}
          </MDBox>
        </Card>
      </MDBox>

      {/* Info Alert */}
      <MDBox px={3} pb={3}>
        <Alert
          severity="info"
          variant="outlined"
          sx={{ borderStyle: "dashed" }}
        >
          Las recetas son plantillas que definen qué insumos se requieren para
          producir un producto. No generan movimientos de stock hasta que se
          ejecutan en una orden de producción.
        </Alert>
      </MDBox>

      {/* Recipe Detail Modal */}
      <Dialog
        open={!!selectedRecipe}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedRecipe && (
          <>
            <DialogTitle>
              <MDBox
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <MDBox display="flex" alignItems="center" gap={1}>
                  <Icon color="dark">menu_book</Icon>
                  <MDTypography variant="h6">
                    {selectedRecipe.name}
                  </MDTypography>
                </MDBox>
                <MDBadge
                  variant="gradient"
                  color={selectedRecipe.isActive ? "success" : "secondary"}
                  badgeContent={selectedRecipe.isActive ? "ACTIVA" : "INACTIVA"}
                  size="xs"
                />
              </MDBox>
              <MDTypography variant="caption" color="text" fontWeight="regular">
                {selectedRecipe.code} -{" "}
                {selectedRecipe.notes ||
                  "Detalle técnico de la receta de producción"}
              </MDTypography>
            </DialogTitle>
            <Divider sx={{ my: 0 }} />
            <DialogContent>
              <Grid container spacing={3}>
                {/* Left Column: Products (Outputs) */}
                <Grid item xs={12} md={7}>
                  <MDBox display="flex" flexDirection="column" gap={2}>
                    {/* Main Target Product */}
                    <MDTypography
                      variant="h6"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon color="success">stars</Icon> Producto Principal
                    </MDTypography>
                    <Card
                      sx={{
                        bgcolor: "grey-100",
                        boxShadow: "none",
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <MDBox>
                          <MDTypography variant="button" fontWeight="bold">
                            {selectedRecipe.product?.name}
                          </MDTypography>
                          <MDTypography
                            variant="caption"
                            color="text"
                            display="block"
                          >
                            {selectedRecipe.product?.code}
                          </MDTypography>
                        </MDBox>
                        <MDBox textAlign="right">
                          <MDTypography variant="h6" fontWeight="bold">
                            {selectedRecipe.yieldQuantity}{" "}
                            {selectedRecipe.product?.unit}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </Card>

                    {/* All Outputs List */}
                    {selectedRecipe.outputs?.length > 0 && (
                      <MDBox>
                        <MDTypography
                          variant="h6"
                          mb={1}
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Icon color="info">inventory_2</Icon> Productos
                          Resultantes (Salida)
                        </MDTypography>
                        <TableContainer
                          component={Paper}
                          sx={{ boxShadow: "none", border: "1px solid #eee" }}
                        >
                          <Table size="small">
                            <TableHead sx={{ display: "table-header-group" }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Producto
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  % Costo
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Cant. Esperada
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedRecipe.outputs.map((out) => (
                                <TableRow key={out._id}>
                                  <TableCell>
                                    <MDTypography
                                      variant="button"
                                      display="block"
                                    >
                                      {out.product?.name}
                                    </MDTypography>
                                    <MDTypography
                                      variant="caption"
                                      color="text"
                                    >
                                      {out.product?.code}
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <MDTypography variant="button">
                                      {out.costPercent}%
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <MDTypography variant="button">
                                      {out.expectedQuantity || "-"}{" "}
                                      {out.product?.unit}
                                    </MDTypography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>

                {/* Right Column: Inputs */}
                <Grid item xs={12} md={5}>
                  <MDTypography
                    variant="h6"
                    mb={1}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon color="error">arrow_downward</Icon> Insumos (Entrada)
                  </MDTypography>
                  <TableContainer
                    component={Paper}
                    sx={{ boxShadow: "none", border: "1px solid #eee" }}
                  >
                    <Table size="small">
                      <TableHead sx={{ display: "table-header-group" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Insumo
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Cant.
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRecipe.inputs?.map((input) => (
                          <TableRow key={input._id}>
                            <TableCell>
                              <MDTypography variant="button" display="block">
                                {input.product?.name}
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                {input.product?.code}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="right">
                              <MDTypography variant="button" fontWeight="bold">
                                {input.quantity} {input.product?.unit}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <MDBox
                    mt={2}
                    p={2}
                    sx={{ bgcolor: "grey-100", borderRadius: 1 }}
                  >
                    <MDTypography
                      variant="caption"
                      color="text"
                      display="block"
                      textAlign="right"
                    >
                      Costo Estimado de Insumos
                    </MDTypography>
                    <MDTypography
                      variant="h5"
                      fontWeight="bold"
                      textAlign="right"
                    >
                      {formatCurrency(calculateRecipeCost(selectedRecipe))}
                    </MDTypography>
                  </MDBox>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="caption" color="text">
                  Creada el {formatDate(selectedRecipe.createdAt)}
                </MDTypography>
              </MDBox>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <MDButton color="secondary" onClick={handleClose}>
                CERRAR
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => {
                  handleClose();
                  navigate("/manufactura/nueva-production", {
                    state: { recipeId: selectedRecipe._id },
                  });
                }}
              >
                USAR EN PRODUCCIÓN
              </MDButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Recipes;
