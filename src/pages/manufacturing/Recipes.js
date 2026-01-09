import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";

// Data and Helpers
import { recipes, formatCurrency, formatDate } from "./mockData";

const Recipes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filteredRecipes = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.code.toLowerCase().includes(search.toLowerCase()) ||
      recipe.outputProduct.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const calculateRecipeCost = (recipe) => {
    return recipe.inputs.reduce(
      (sum, input) => sum + input.product.unitCost * input.quantity,
      0
    );
  };

  const handleClose = () => setSelectedRecipe(null);

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
              Recetas (BOM)
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Plantillas de producción para transformación de materiales
            </MDTypography>
          </MDBox>
          <MDButton
            variant="gradient"
            color="info"
            component={Link}
            to="/manufactura/recetas/nueva"
          >
            <Icon sx={{ mr: 1 }}>add</Icon> NUEVA RECETA
          </MDButton>
        </MDBox>

        {/* Info Alert */}
        <MDBox mb={3}>
          <Alert severity="info" variant="outlined">
            Las recetas son plantillas que definen qué insumos se requieren para
            producir un producto. No generan movimientos de stock hasta que se
            ejecutan en una orden de producción.
          </Alert>
        </MDBox>

        {/* Search Bar */}
        <MDBox mb={3} display="flex" alignItems="center">
          <MDBox width="100%" maxWidth="400px">
            <MDInput
              fullWidth
              label="Buscar por nombre, código o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <MDBox mr={1} color="text">
                    <Icon>search</Icon>
                  </MDBox>
                ),
              }}
            />
          </MDBox>
        </MDBox>

        {/* Main Recipes Table */}
        <Card>
          <TableContainer>
            <Table>
              <MDBox component="thead">
                <TableRow>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    Código
                  </TableCell>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    Producto Final
                  </TableCell>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                    align="center"
                  >
                    Cantidad
                  </TableCell>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                    align="center"
                  >
                    Insumos
                  </TableCell>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    variant="head"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                    align="right"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </MDBox>
              <TableBody>
                {filteredRecipes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 8 }}>
                      <Icon
                        sx={{
                          fontSize: "40px !important",
                          color: "grey-300",
                          mb: 1,
                        }}
                      >
                        menu_book
                      </Icon>
                      <MDTypography
                        variant="button"
                        color="text"
                        display="block"
                      >
                        No se encontraron recetas
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <TableRow
                      key={recipe.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <TableCell>
                        <MDTypography
                          variant="caption"
                          fontWeight="medium"
                          color="text"
                        >
                          {recipe.code}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="button" fontWeight="bold">
                          {recipe.name}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <Icon
                            fontSize="small"
                            sx={{ color: "text.secondary" }}
                          >
                            inventory_2
                          </Icon>
                          <MDTypography variant="button">
                            {recipe.outputProduct.name}
                          </MDTypography>
                        </MDBox>
                      </TableCell>
                      <TableCell align="center">
                        <MDTypography variant="button" fontWeight="medium">
                          {recipe.outputQuantity} {recipe.outputProduct.unit}
                        </MDTypography>
                      </TableCell>
                      <TableCell align="center">
                        <MDTypography variant="button" color="text">
                          {recipe.inputs.length} items
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDBadge
                          variant="gradient"
                          color={recipe.isActive ? "success" : "secondary"}
                          badgeContent={recipe.isActive ? "ACTIVA" : "INACTIVA"}
                          size="xs"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <MDButton
                          variant="text"
                          color="info"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecipe(recipe);
                          }}
                        >
                          VER &nbsp;<Icon>chevron_right</Icon>
                        </MDButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </MDBox>

      {/* Recipe Detail Modal */}
      <Dialog
        open={!!selectedRecipe}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedRecipe && (
          <>
            <DialogTitle>
              <MDBox display="flex" alignItems="center" gap={1}>
                <Icon color="dark">menu_book</Icon>
                <MDTypography variant="h6">{selectedRecipe.name}</MDTypography>
              </MDBox>
              <MDTypography variant="caption" color="text" fontWeight="regular">
                {selectedRecipe.description ||
                  "Detalle técnico de la receta de producción"}
              </MDTypography>
            </DialogTitle>
            <Divider sx={{ my: 0 }} />
            <DialogContent>
              <MDBox display="flex" flexDirection="column" gap={3}>
                {/* Resulting Product */}
                <Card sx={{ bgcolor: "grey-100", boxShadow: "none", p: 2 }}>
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDBox>
                      <MDTypography
                        variant="caption"
                        color="success"
                        fontWeight="bold"
                        textTransform="uppercase"
                        display="block"
                      >
                        Producto Resultante
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="bold">
                        {selectedRecipe.outputProduct.name}
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        color="text"
                        display="block"
                      >
                        {selectedRecipe.outputProduct.code}
                      </MDTypography>
                    </MDBox>
                    <MDBox textAlign="right">
                      <MDTypography variant="h6" fontWeight="bold" color="dark">
                        {selectedRecipe.outputQuantity}{" "}
                        {selectedRecipe.outputProduct.unit}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        {formatCurrency(selectedRecipe.outputProduct.unitCost)}{" "}
                        /{selectedRecipe.outputProduct.unit}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>

                {/* Inputs List */}
                <MDBox>
                  <MDTypography
                    variant="h6"
                    mb={2}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon color="error">arrow_downward</Icon> Insumos Requeridos
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
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Cant.
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Costo Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRecipe.inputs.map((input) => (
                          <TableRow key={input.productId}>
                            <TableCell>
                              <MDTypography variant="button" display="block">
                                {input.product.name}
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                {input.product.code}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="right">
                              <MDTypography variant="button">
                                {input.quantity} {input.product.unit}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="right">
                              <MDTypography
                                variant="button"
                                fontWeight="medium"
                              >
                                {formatCurrency(
                                  input.product.unitCost * input.quantity
                                )}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MDBox>

                <MDBox display="flex" justifyContent="flex-end">
                  <MDBox textAlign="right">
                    <MDTypography variant="caption" color="text">
                      Costo Total de Insumos
                    </MDTypography>
                    <MDTypography variant="h5" fontWeight="bold">
                      {formatCurrency(calculateRecipeCost(selectedRecipe))}
                    </MDTypography>
                  </MDBox>
                </MDBox>

                <Divider sx={{ my: 1 }} />

                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="caption" color="text">
                    Creada por {selectedRecipe.createdBy} el{" "}
                    {formatDate(selectedRecipe.createdAt)}
                  </MDTypography>
                  <MDBadge
                    variant="gradient"
                    color={selectedRecipe.isActive ? "success" : "secondary"}
                    badgeContent={
                      selectedRecipe.isActive ? "ACTIVA" : "INACTIVA"
                    }
                    size="xs"
                  />
                </MDBox>
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
                  navigate("/manufactura/nueva");
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
