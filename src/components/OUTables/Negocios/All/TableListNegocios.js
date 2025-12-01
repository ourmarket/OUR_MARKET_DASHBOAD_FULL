/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import { Box, Card, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import MenuListNegocios from "../Menu/MenuListNegocios";


function TableListNegocios({ negocios }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  
  const [open, setOpen] = useState(null);
  const [negocioId, setNegocioId] = useState(null);

  const handleOpenMenu = (negocioId, event) => {
    setOpen(event.currentTarget);
    setNegocioId(negocioId);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setNegocioId(null);
  };

  const columns = [
    {
      field: "nombreNegocio",
      headerName: "Negocio",
      flex: 1.5,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "nombreDueño",
      headerName: "Dueño",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "direccion",
      headerName: "Direccion",
      flex: 1.5,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "telefono",
      headerName: "Telefono",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "categoria",
      headerName: "Categoria",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "fueVisitado",
      headerName: "Visitado?",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.fueVisitado ? (
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CheckIcon />
          </div>
        ) : (
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CloseIcon />
          </div>
        ),
    },
    {
      field: "esCliente",
      headerName: "Es cliente?",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.esCliente ? (
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CheckIcon />
          </div>
        ) : (
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CloseIcon />
          </div>
        ),
    },
    {
      field: "vendeNuestrasCategorias",
      headerName: "Vende Nuestras Categorias?",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.vendeNuestrasCategorias ? (
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CheckIcon />
          </div>
        ) : (
          <div
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <CloseIcon />
          </div>
        ),
    },

    {
      field: "accessLevel",
      headerName: "Menu",
      headerClassName: "super-app-theme--header",

      renderCell: ({ row: {  _id } }) => (
        <IconButton
          size="large"
          color="inherit"
          onClick={(e) => handleOpenMenu( _id, e)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Card m="20px" sx={{ overflowX: "scroll", padding: "20px" }}>
       
        <Box height="75vh" width="auto">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={negocios.map((data) => ({
              ...data,
            }))}
            columns={columns}
            getRowId={(row) => row._id}
            sx={{
              "& .MuiDataGrid-cellContent": {
                color: `${darkMode ? "#fff" : "#222"} `,
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "rgba(0, 100, 255, 0.1)",
              },
              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: "rgba(0, 100, 255, 0.2)",
              },
              "& .super-app-theme--header": {
                color: `${darkMode ? "#fff" : "#222"} `,
              },
              "& .MuiTablePagination-root": {
                color: `${darkMode ? "#fff" : "#222"} `,
              },
              "& .MuiButtonBase-root": {
                color: `${darkMode ? "#fff" : "#222"} `,
              },
              "& .MuiDataGrid-selectedRowCount": {
                color: `${darkMode ? "#fff" : "#222"} `,
              },
            }}
            componentsProps={{
              basePopper: {
                sx: {
                  "& .MuiPaper-root": {
                    backgroundColor: `${darkMode && colors.background.default}`,
                  },
                },
              },
            }}
          />
        </Box>
      </Card>

      <MenuListNegocios
        open={open}
        handleCloseMenu={handleCloseMenu}
        negocioId={negocioId}
      />
    </>
  );
}

export default TableListNegocios;
