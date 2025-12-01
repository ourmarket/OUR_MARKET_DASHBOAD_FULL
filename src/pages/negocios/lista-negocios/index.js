/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loading from "components/DRLoading";
import { Alert, Autocomplete, Box, Tab, Tabs, TextField } from "@mui/material";
import { useGetNegociosQuery } from "api/apiNegocio";
import TableListNegocios from "components/OUTables/Negocios/All/TableListNegocios";
import {
  categoriasProductos,
  marcasPollos,
  proveedores,
} from "data/negociosOpciones";
import { useLoadScript } from "@react-google-maps/api";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";
import MapsNegocios from "components/OUMaps/NegocioMap/MapsNegocios";
import MapsNegociosHeat from "components/OUMaps/NegocioMap/MapsNegociosHeat";

function ListaNegocios() {
  const {
    data: dataNegocios,
    isLoading: l1,
    error: e1,
  } = useGetNegociosQuery();

  const {
      data: dataZones,
      isLoading: l2,
      isError: e2,
    } = useGetDeliveryZonesQuery();

  const [page, setPage] = useState(0);

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  const [filterCategorias, setFilterCategorias] = useState([]);
  const [filterMarcas, setFilterMarcas] = useState([]);
  const [filterProveedores, setFilterProveedores] = useState([]);

  const filteredNegocios = useMemo(() => {
    if (!dataNegocios?.negocios) return [];

    return dataNegocios.negocios.filter((negocio) => {
      // Normalizar arrays del negocio
      const categorias = negocio.productosQueLeInteresan || [];
      const compra = negocio.productosQueCompra || [];
      const proveedoresAct = negocio.distribuidorActual || [];

      // ---- FILTRO CATEGORÍAS ----
      if (filterCategorias.length > 0) {
        const values = filterCategorias.map((f) => f.value);
        const match = categorias.some((c) => values.includes(c));
        if (!match) return false;
      }

      // ---- FILTRO MARCAS (productosQueCompra) ----
      if (filterMarcas.length > 0) {
        const values = filterMarcas.map((f) => f.value);
        const match = compra.some((m) => values.includes(m));
        if (!match) return false;
      }

      // ---- FILTRO PROVEEDORES (distribuidorActual) ----
      if (filterProveedores.length > 0) {
        const values = filterProveedores.map((f) => f.value);
        const match = proveedoresAct.some((p) => values.includes(p));
        if (!match) return false;
      }

      return true;
    });
  }, [dataNegocios, filterCategorias, filterMarcas, filterProveedores]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_MAP_API_KEY,
    libraries: ["places", "visualization"],
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Negocios
              </MDTypography>
            </MDBox>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "column",
                px: 2,
                my: 2,
              }}
            >
              <Tabs value={page} onChange={handleChange} centered>
                <Tab label="Lista de negocios" />
                <Tab label="Mapa Negocios" />
                <Tab label="Mapa de calor" />
              </Tabs>
            </Box>

            <Card sx={{ margin: "20px", padding: "20px" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    multiple
                    options={categoriasProductos}
                    getOptionLabel={(option) => option.label}
                    value={filterCategorias}
                    onChange={(e, value) => setFilterCategorias(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categorías"
                        placeholder="Seleccionar..."
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Autocomplete
                    multiple
                    options={marcasPollos}
                    getOptionLabel={(option) => option.label}
                    value={filterMarcas}
                    onChange={(e, value) => setFilterMarcas(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Marcas de pollo"
                        placeholder="Seleccionar..."
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Autocomplete
                    multiple
                    options={proveedores}
                    getOptionLabel={(option) => option.label}
                    value={filterProveedores}
                    onChange={(e, value) => setFilterProveedores(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Proveedores"
                        placeholder="Seleccionar..."
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>
            {page === 0 && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                {l1 && <Loading />}
                {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}

                <Card sx={{ margin: "0 20px" }}>
                  {dataNegocios && (
                    <TableListNegocios negocios={filteredNegocios} />
                  )}
                </Card>
              </Box>
            )}
             {page === 1 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  {(l1 || l2 || !isLoaded) && <Loading />}
                  {(e1 || e2) && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataNegocios && dataZones && isLoaded && (
                    <Card>
                      <MapsNegocios
                        clientAddress={filteredNegocios}
                        zones={dataZones.data.deliveryZones}
                      />
                    </Card>
                  )}
                </Box>
              )}
             {page === 2 && (
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  {(l1 || l2 || !isLoaded) && <Loading />}
                  {(e1 || e2) && <Alert severity="error">Ha ocurrido un error</Alert>}
                  {dataNegocios && dataZones && isLoaded && (
                    <Card>
                      <MapsNegociosHeat
                        clientAddress={filteredNegocios}
                        zones={dataZones.data.deliveryZones}
                      />
                    </Card>
                  )}
                </Box>
              )}
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ListaNegocios;
