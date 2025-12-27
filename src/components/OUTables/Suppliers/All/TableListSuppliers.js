/* eslint-disable react/prop-types */
import { Box, IconButton, Stack, Typography, Chip, Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MDButton from "components/MDButton";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import MenuListSuppliers from "../Menu/MenuListSuppliers";

function TableListSuppliers({ suppliers }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [suppliersId, setSuppliersId] = useState(null);

  const handleOpenMenu = (id, event) => {
    setOpen(event.currentTarget);
    setSuppliersId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSuppliersId(null);
  };

  const columns = [
    {
      field: "businessName",
      headerName: "Proveedor",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography variant="button" fontWeight="medium" sx={{ color: darkMode ? "#fff" : "#344767" }}>
            {params.row.businessName}
          </Typography>
          <Typography variant="caption" color="secondary">
            CUIT: {params.row.cuit}
          </Typography>
        </Box>
      ),
    },
    {
      field: "contact",
      headerName: "Contacto",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PhoneIcon sx={{ fontSize: "14px", color: darkMode ? "#bbb" : "#7b809a" }} />
            <Typography variant="caption">{params.row.phone || "S/N"}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon sx={{ fontSize: "14px", color: darkMode ? "#bbb" : "#7b809a" }} />
            <Typography variant="caption" sx={{ textDecoration: "underline", cursor: "pointer" }}>
              {params.row.email}
            </Typography>
          </Stack>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Ubicación",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Typography variant="caption" fontWeight="medium" display="block">
            {params.row.province}
          </Typography>
          <Typography variant="caption" color="secondary">
            {params.row.city} ({params.row.zip})
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      renderCell: () => (
        <Chip 
          label="Activo" 
          size="small" 
          color="success" 
          variant="outlined" 
          sx={{ fontWeight: "bold", fontSize: "10px" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Opciones",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Más acciones">
          <IconButton
            size="medium"
            color="inherit"
            onClick={(e) => handleOpenMenu(params.row._id, e)}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Box m="20px">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold"> Proveedores </Typography>
            <Typography variant="button" color="text"> Gestión de contactos y razones sociales </Typography>
          </Box>
          
          <MDButton
            color="dark"
            variant="gradient"
            onClick={() => navigate("/productos/proveedores/nuevo")}
          >
            Nuevo Proveedor
          </MDButton>
        </Stack>

        <Box 
          height="75vh" 
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { 
                borderBottom: darkMode ? "1px solid #384158" : "1px solid #f0f2f5",
                display: "flex",
                alignItems: "center"
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
              borderBottom: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
          <DataGrid
            rows={suppliers.map((s) => ({ ...s, email: s?.email || "Sin email" }))}
            columns={columns}
            getRowId={(row) => row._id}
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>
      </Box>

      <MenuListSuppliers
        open={open}
        handleCloseMenu={handleCloseMenu}
        suppliersId={suppliersId}
      />
    </>
  );
}

export default TableListSuppliers;