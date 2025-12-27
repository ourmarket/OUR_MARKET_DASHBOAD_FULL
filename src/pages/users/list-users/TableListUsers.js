/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VerifiedIcon from "@mui/icons-material/Verified";
import BlockIcon from "@mui/icons-material/Block";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MenuListUsers from "./MenuListUsers";
import ExternalTableSearch from "components/ExternalTableSearch";

function Table({ users }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [pageSize, setPageSize] = useState(50);

  const [open, setOpen] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleOpenMenu = (id, event) => {
    setOpen(event.currentTarget);
    setUserId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setUserId(null);
  };

  const columns = [
    {
      field: "user",
      headerName: "Usuario",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
          <Avatar
            src={params.row.avatar}
            sx={{ width: 36, height: 36, mr: 2, boxShadow: 1 }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="button"
              fontWeight="medium"
              sx={{ color: darkMode ? "#fff" : "#344767", lineHeight: 1 }}
            >
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="caption" fontWeight="medium">
          {params.row.phone || "---"}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Rol",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.role || "Cliente"}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "10px",
            borderColor: darkMode ? "#555" : "#ddd",
          }}
        />
      ),
    },
    {
      field: "verified",
      headerName: "Estado",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row.verified ? (
          <Tooltip title="Usuario Verificado (Clerk)">
            <VerifiedIcon color="info" fontSize="small" />
          </Tooltip>
        ) : (
          <Tooltip title="No Verificado">
            <BlockIcon color="error" fontSize="small" />
          </Tooltip>
        ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      sortable: false,
      align: "right",
      renderCell: (params) => (
        <IconButton
          size="medium"
          color="inherit"
          onClick={(e) => handleOpenMenu(params.row._id, e)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": {
            borderBottom: darkMode ? "1px solid #384158" : "1px solid #f0f2f5",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
          },
        }}
      >
        <DataGrid
          rows={users.map((user) => ({
            _id: user._id,
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar?.includes("user_default")
              ? "https://ik.imagekit.io/mrprwema7/OurMarket/pngwing.com%20(3)%20(2)_HuAjhlJK-.png"
              : user.avatar,
            role: user.role?.es,
            verified: !!user.clerkId,
          }))}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[50, 100, 200]}
          pagination
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      <MenuListUsers
        open={open}
        handleCloseMenu={handleCloseMenu}
        userId={userId}
      />
    </>
  );
}

function TableListUsers({ users }) {
  const navigate = useNavigate();
  return (
    <Box p={4} pt={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Gestión de Usuarios
          </Typography>
          <Typography variant="button" color="text">
            Control de acceso y roles del sistema
          </Typography>
        </Box>
        <MDButton
          color="dark"
          variant="gradient"
          onClick={() => navigate("/usuarios/nuevo")}
        >
          Nuevo Usuario
        </MDButton>
      </Stack>
      <ExternalTableSearch
        data={users}
        fields={[
          { key: "name", label: "Nombre" },
          { key: "phone", label: "Teléfono" },
          { key: "email", label: "Email" },
        ]}
      >
        {(filteredUsers) => <Table users={filteredUsers} />}
      </ExternalTableSearch>
    </Box>
  );
}

export default TableListUsers;
