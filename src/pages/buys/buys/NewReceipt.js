import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

// API & Utils
import { useGetBuyByIdQuery } from "api/buyApi";
import { useCreateGoodsReceiptMutation } from "api/goodsReceiptApi";
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";

const NewReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: buy, isLoading, error } = useGetBuyByIdQuery(id);
  const [createGoodsReceipt, { isLoading: isCreating }] =
    useCreateGoodsReceiptMutation();

  const [items, setItems] = useState([]);
  const [generalObservations, setGeneralObservations] = useState("");

  console.log(buy);

  useEffect(() => {
    if (buy && buy.items) {
      setItems(
        buy.items.map((item) => ({
          product: item.product?._id || item.product || item._id, // Capturamos el ID del producto
          description: item.nameSnapshot || item.description || "N/A",
          quantityOrdered: item.quantity,
          quantityReceived: item.quantity,
          observations: "",
        }))
      );
    }
  }, [buy]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (error || !buy) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <MDTypography variant="h4" gutterBottom>
            Compra no encontrada
          </MDTypography>
          <MDTypography variant="body2" color="text" gutterBottom>
            Hubo un error al cargar la información de la compra.
          </MDTypography>
          <MDButton
            variant="contained"
            color="info"
            onClick={() => navigate("/compras")}
            sx={{ mt: 2 }}
          >
            Volver a Compras
          </MDButton>
        </MDBox>
      </DashboardLayout>
    );
  }

  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value) || 0;
    const newItems = [...items];
    const ordered = newItems[index].quantityOrdered;
    newItems[index].quantityReceived = Math.max(0, Math.min(quantity, ordered));
    setItems(newItems);
  };

  const handleObservationChange = (index, value) => {
    const newItems = [...items];
    newItems[index].observations = value;
    setItems(newItems);
  };

  const hasDifferences = items.some(
    (item) =>
      item.quantityReceived !== item.quantityOrdered ||
      item.observations.trim() !== ""
  );

  const handleConfirmReceipt = async () => {
    const result = await Swal.fire({
      title: "¿Confirmar recepción?",
      text: "Esta acción no se puede deshacer. La recepción quedará registrada como documento histórico y afectará el stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fb8c00",
      cancelButtonColor: "#7b809a",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          buyId: buy._id,
          supplier: buy.supplier?._id || buy.supplier,
          generalObservations,
          items: items.map((item) => ({
            product: item.product,
            quantityReceived: item.quantityReceived,
            observations: item.observations,
          })),
          receivedAt: new Date().toISOString(),
        };

        await createGoodsReceipt(payload).unwrap();

        Swal.fire({
          title: "¡Éxito!",
          text: "Recepción registrada correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/compras/detalle1/${id}`);
      } catch (err) {
        console.error("Error creating goods receipt:", err);
        Swal.fire({
          title: "Error",
          text: err.data?.message || "No se pudo registrar la recepción.",
          icon: "error",
          confirmButtonColor: "#d41f1a",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              Registrar Recepción
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <MDButton
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate(`/compras/detalle1/${id}`)}
                sx={{ pl: 0, textTransform: "none" }}
              >
                <Icon>arrow_back</Icon>&nbsp;Volver a la Compra
              </MDButton>
              <MDTypography variant="button" color="text" ml={1}>
                / {buy.code || id}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Warning Notice */}
        <MDBox
          bgColor="warning"
          variant="gradient"
          borderRadius="lg"
          p={2}
          mb={3}
          display="flex"
          alignItems="center"
          sx={{ color: ({ palette: { white } }) => white.main }}
        >
          <Icon fontSize="medium" sx={{ mr: 2 }}>
            warning
          </Icon>
          <MDTypography variant="button" color="white" fontWeight="medium">
            Al confirmar esta recepción no podrás editarla. Verificá las
            cantidades antes de continuar.
          </MDTypography>
        </MDBox>

        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} lg={8}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              {/* Items Card */}
              <Card>
                <MDBox p={3} display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>inventory_2</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    Ítems a Recibir
                  </MDTypography>
                </MDBox>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell sx={{ width: "35%" }}>Descripción</TableCell>
                        <TableCell align="center" sx={{ width: "15%" }}>
                          Comprado
                        </TableCell>
                        <TableCell align="center" sx={{ width: "15%" }}>
                          Recibido
                        </TableCell>
                        <TableCell sx={{ width: "35%" }}>
                          Observaciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <MDTypography variant="button" fontWeight="medium">
                              {item.description}
                            </MDTypography>
                          </TableCell>
                          <TableCell align="center">
                            <MDTypography variant="button">
                              {item.quantityOrdered}
                            </MDTypography>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantityReceived}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              inputProps={{
                                min: 0,
                                max: item.quantityOrdered,
                                style: { textAlign: "center", width: "60px" },
                              }}
                              error={
                                item.quantityReceived < item.quantityOrdered
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <MDInput
                              placeholder="Ej: Daño de empaque..."
                              value={item.observations}
                              onChange={(e) =>
                                handleObservationChange(index, e.target.value)
                              }
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {hasDifferences && (
                  <MDBox
                    p={2}
                    m={2}
                    borderRadius="lg"
                    sx={{
                      backgroundColor: "#fff4e5",
                      border: "1px solid #ff9800",
                    }}
                  >
                    <MDBox display="flex" alignItems="center">
                      <Icon color="warning" sx={{ mr: 1 }}>
                        priority_high
                      </Icon>
                      <MDTypography
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                      >
                        Hay diferencias entre lo comprado y lo recibido. Estas
                        quedarán documentadas.
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                )}
              </Card>

              {/* General Observations */}
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    Observaciones Generales
                  </MDTypography>
                  <MDInput
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Notas adicionales sobre esta recepción..."
                    value={generalObservations}
                    onChange={(e) => setGeneralObservations(e.target.value)}
                  />
                </MDBox>
              </Card>

              {/* Actions */}
              <MDBox display="flex" justifyContent="flex-end" gap={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate(`/compras/detalle1/${id}`)}
                >
                  Cancelar
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={handleConfirmReceipt}
                  startIcon={
                    isCreating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Icon>check</Icon>
                    )
                  }
                  disabled={isCreating}
                >
                  {isCreating ? "Registrando..." : "Confirmar Recepción"}
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <MDBox display="flex" flexDirection="column" gap={3}>
              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    <Icon sx={{ verticalAlign: "middle", mr: 1 }}>
                      description
                    </Icon>
                    Datos de la Compra
                  </MDTypography>
                  <Divider />
                  <MDBox mb={2}>
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      Nº Compra
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="medium"
                      display="block"
                    >
                      {buy.code || buy.documentNumber || "N/A"}
                    </MDTypography>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      Fecha
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" mt={0.5}>
                      <Icon
                        fontSize="small"
                        sx={{ mr: 0.5, color: "text.secondary" }}
                      >
                        calendar_today
                      </Icon>
                      <MDTypography variant="button" fontWeight="medium">
                        {dateToLocalDate(buy.date)}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  <MDBox>
                    <MDTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      Total
                    </MDTypography>
                    <MDTypography variant="h6" color="info">
                      {formatPrice(buy.total)}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>

              <Card>
                <MDBox p={3}>
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    <Icon sx={{ verticalAlign: "middle", mr: 1 }}>
                      business
                    </Icon>
                    Proveedor
                  </MDTypography>
                  <Divider />
                  <MDTypography
                    variant="button"
                    fontWeight="bold"
                    display="block"
                  >
                    {buy.supplier?.businessName ||
                      buy.supplier?.name ||
                      "Sin Nombre"}
                  </MDTypography>
                  <MDTypography
                    variant="caption"
                    color="text"
                    display="block"
                    mt={1}
                  >
                    {buy.supplier?.address || "N/A"}
                  </MDTypography>
                </MDBox>
              </Card>

              <MDBox p={2} bgColor="grey-100" borderRadius="lg">
                <MDTypography variant="caption" color="text">
                  La recepción documenta lo recibido físicamente y no modifica
                  el monto de la compra ni los pagos.
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default NewReceipt;
