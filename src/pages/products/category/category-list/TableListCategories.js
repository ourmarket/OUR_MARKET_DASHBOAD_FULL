/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CategoryIcon from "@mui/icons-material/Category";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import MenuListUsers from "./MenuListUsers"; // Asegúrate de que este menú sea el correcto para categorías
import { useDispatch } from "react-redux";
import { usePutCategoryMutation } from "api/categoryApi";
import DataGridProReusable from "components/DataGrid/DataGridProReusable";
import { showFeedback } from "reduxToolkit/uiSlice";
import UsersActions from "components/DataGrid/UsersActions";

function TableListCategories({ categories }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const handleOpenMenu = (id, event) => {
    setOpen(event.currentTarget);
    setCategoryId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setCategoryId(null);
  };

  const columns = [
    {
      field: "img",
      headerName: "Icono",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.row.img}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            boxShadow: 2,
            bgcolor: darkMode ? "#1f283e" : "#f8f9fa",
            p: 0.5,
          }}
        >
          <CategoryIcon />
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Nombre de Categoría",
      flex: 2,
      editable: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="button"
            fontWeight="bold"
            sx={{
              color: darkMode ? "#fff" : "#344767",
              textTransform: "capitalize",
            }}
          >
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text">
            ID: {params.row._id.slice(-6)} (Corto)
          </Typography>
        </Box>
      ),
    },
    {
      field: "_id",
      headerName: "ID Completo",
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="caption"
          sx={{ fontFamily: "monospace", color: "secondary.main" }}
        >
          {params.row._id}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 0.8,
      renderCell: () => (
        <Chip
          label="Activa"
          color="success"
          variant="outlined"
          size="small"
          sx={{ fontWeight: "bold", fontSize: "10px" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: ({ params, apiRef }) => (
        <UsersActions params={params} apiRef={apiRef} />
      ),
    },
    {
      field: "menu",
      headerName: "Menu",
      width: 80,
      sortable: false,
      align: "center",
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
  const [editCategory, error, isLoading] = usePutCategoryMutation();
  const dispatch = useDispatch();
  const processRowUpdate = async (newRow) => {
    try {
      const result = await editCategory({
        id: newRow._id,
        name: newRow.name,
      }).unwrap();
      console.log("result:", result);

      return { ...newRow, ...result };
    } catch (err) {
      dispatch(
        showFeedback({
          title: "Error al editar la categoria",
          content:
            err?.data?.message ||
            err?.data?.msg ||
            "Ha ocurrido un error inesperado.",
          color: "error",
          dateTime: null,
        })
      );
      console.log("Entra en catch");
      throw err;
    }
  };

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
            <Typography variant="h5" fontWeight="bold">
              Categorías de Productos
            </Typography>
            <Typography variant="button" color="text">
              Organización y jerarquía del catálogo
            </Typography>
          </Box>
          <MDButton
            color="dark"
            variant="gradient"
            onClick={() => navigate("/productos/categoria/nueva")}
          >
            Nueva Categoría
          </MDButton>
        </Stack>

        <Box
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": {
              borderBottom: darkMode
                ? "1px solid #384158"
                : "1px solid #f0f2f5",
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
          <DataGridProReusable
            processRowUpdate={processRowUpdate}
            rows={categories}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isLoading}
            storageKey="products"
            pageSize={100}
            onRowDoubleClick={(params) =>
              navigate(`/productos/categoria/editar/${params.row._id}`)
            }
            onBulkAction={(ids) => {
              //console.log("Seleccionados:", ids);
            }}
            error={error}
          />
        </Box>
      </Box>

      {/* Asegúrate de que MenuListUsers esté preparado para recibir categoryId */}
      <MenuListUsers
        open={open}
        handleCloseMenu={handleCloseMenu}
        categoryId={categoryId}
      />
    </>
  );
}

export default TableListCategories;
