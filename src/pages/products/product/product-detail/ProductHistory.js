import { dateToLocalDate } from "utils/dateFormat";
import Card from "@mui/material/Card";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDButton from "components/MDButton";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { DataGrid } from "@mui/x-data-grid";
import MDBadge from "components/MDBadge";
import Grid from "@mui/material/Grid";

function ProductHistory({ history = [] }) {
  const [selectedChange, setSelectedChange] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (row) => {
    setSelectedChange(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedChange(null);
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1.2,
      renderCell: ({ row }) => (
        <MDTypography variant="button" color="text" fontWeight="regular">
          {dateToLocalDate(row.createdAt)}
        </MDTypography>
      ),
    },
    {
      field: "action",
      headerName: "Acción",
      flex: 0.8,
      renderCell: ({ row }) => {
        let color = "info";
        let label = row.action || "Modificación";
        if (label === "CREATE" || label.toLowerCase().includes("crea"))
          color = "success";
        if (label === "DELETE" || label.toLowerCase().includes("borr"))
          color = "error";
        if (label === "UPDATE" || label.toLowerCase().includes("edit"))
          color = "info";

        return (
          <MDBadge
            variant="gradient"
            color={color}
            badgeContent={label}
            size="xs"
          />
        );
      },
    },
    {
      field: "reason",
      headerName: "Motivo",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Tooltip title={row.reason || "Sin motivo"}>
          <MDTypography
            variant="button"
            color="text"
            sx={{
              fontStyle: "italic",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.reason || "Sin motivo especificado"}
          </MDTypography>
        </Tooltip>
      ),
    },
    {
      field: "createdBy",
      headerName: "Realizado por",
      flex: 1.2,
      renderCell: ({ row }) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon fontSize="small" sx={{ color: "text.secondary" }}>
            person
          </Icon>
          <MDTypography variant="button" color="text" fontWeight="medium">
            {row.createdBy?.name
              ? `${row.createdBy.name} ${row.createdBy.lastName}`
              : "Sistema"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "actions",
      headerName: "Detalle",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <IconButton
          color="info"
          onClick={() => handleOpenModal(row)}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Card sx={{ height: "100%", mt: 2 }}>
      <MDBox p={3} display="flex" alignItems="center">
        <Icon sx={{ mr: 1, color: "info.main" }}>history</Icon>
        <MDTypography variant="h6" fontWeight="medium">
          Historial de Cambios y Auditoría
        </MDTypography>
      </MDBox>
      <MDBox
        sx={{
          height: 450,
          width: "100%",
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          rows={history}
          columns={columns}
          getRowId={(row) => row._id || row.id || Math.random()}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f0f2f5",
            },
          }}
        />
      </MDBox>

      {/* Modal de Detalles de Cambios */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MDBox display="flex" alignItems="center" gap={1}>
            <Icon color="info">info</Icon>
            <MDTypography variant="h6">Detalle de la Auditoría</MDTypography>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          {selectedChange && (
            <MDBox display="flex" flexDirection="column" gap={2}>
              {/* Info General */}
              <MDBox>
                <MDTypography
                  variant="caption"
                  fontWeight="bold"
                  color="text"
                  textTransform="uppercase"
                >
                  Información General
                </MDTypography>
                <MDBox mt={1} p={2} bgColor="grey-100" borderRadius="lg">
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <MDTypography variant="caption" display="block">
                        Fecha:
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="medium">
                        {dateToLocalDate(selectedChange.createdAt)}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="caption" display="block">
                        Usuario:
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="medium">
                        {selectedChange.createdBy?.name}{" "}
                        {selectedChange.createdBy?.lastName}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <MDTypography variant="caption" display="block">
                        Motivo:
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="regular">
                        {selectedChange.reason}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>

              {/* Cambios Específicos */}
              {selectedChange.changes &&
                Object.keys(selectedChange.changes).length > 0 && (
                  <MDBox>
                    <MDTypography
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      textTransform="uppercase"
                    >
                      Modificaciones Realizadas
                    </MDTypography>
                    <MDBox
                      mt={1}
                      sx={{
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <MDBox
                        bgColor="grey-200"
                        p={1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{ flex: 1 }}
                        >
                          Campo
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{ flex: 1, textAlign: "center" }}
                        >
                          Anterior
                        </MDTypography>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{ flex: 1, textAlign: "right" }}
                        >
                          Nuevo
                        </MDTypography>
                      </MDBox>
                      {Object.entries(selectedChange.changes).map(
                        ([field, values]) => (
                          <MDBox
                            key={field}
                            p={1}
                            display="flex"
                            justifyContent="space-between"
                            sx={{ borderTop: "1px solid #eee" }}
                          >
                            <MDTypography
                              variant="button"
                              sx={{ flex: 1, textTransform: "capitalize" }}
                            >
                              {field}
                            </MDTypography>
                            <MDTypography
                              variant="button"
                              color="secondary"
                              sx={{ flex: 1, textAlign: "center" }}
                            >
                              {String(values.from ?? "N/A")}
                            </MDTypography>
                            <MDTypography
                              variant="button"
                              color="success"
                              fontWeight="bold"
                              sx={{ flex: 1, textAlign: "right" }}
                            >
                              {String(values.to ?? "N/A")}
                            </MDTypography>
                          </MDBox>
                        )
                      )}
                    </MDBox>
                  </MDBox>
                )}

              {/* Snapshot de Precios */}
              {selectedChange.priceSnapshot && (
                <MDBox>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    color="text"
                    textTransform="uppercase"
                  >
                    Estado de Precios en ese momento
                  </MDTypography>
                  <MDBox
                    mt={1}
                    p={2}
                    sx={{ border: "1px dashed #ccc", borderRadius: "lg" }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <MDTypography variant="caption" display="block">
                          Precio Lista
                        </MDTypography>
                        <MDTypography variant="button" fontWeight="bold">
                          ${selectedChange.priceSnapshot.price}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={4}>
                        <MDTypography variant="caption" display="block">
                          ¿Con Oferta?
                        </MDTypography>
                        <MDTypography variant="button">
                          {selectedChange.priceSnapshot.hasOffer ? "Sí" : "No"}
                        </MDTypography>
                      </Grid>
                      <Grid item xs={4}>
                        <MDTypography variant="caption" display="block">
                          Precio Oferta
                        </MDTypography>
                        <MDTypography variant="button">
                          {selectedChange.priceSnapshot.offerPrice
                            ? `$${selectedChange.priceSnapshot.offerPrice}`
                            : "N/A"}
                        </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="info" variant="gradient">
            Cerrar
          </MDButton>
        </DialogActions>
      </Dialog>
      <MDBox p={2}>
        <MDTypography variant="caption" color="text">
          * Este historial registra cambios críticos como precios, visibilidad y
          creación/eliminación.
        </MDTypography>
      </MDBox>
    </Card>
  );
}

export default ProductHistory;
