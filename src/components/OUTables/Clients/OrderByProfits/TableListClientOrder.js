/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { Box, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { formatPrice } from "utils/formaPrice";
import { formatQuantity } from "utils/quantityFormat";
import MenuClients from "../Menu/MenuClients";

function TableListClientsOrder({ clients }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [open, setOpen] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const handleOpenMenu = (id, event) => {
    setOpen(event.currentTarget);
    setMenuId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setMenuId(null);
  };

  const columns = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1.5,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "active",
      headerName: "Activo",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.active ? (
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
      field: "ordersCount",
      headerName: "Ord. totales",
      flex: 0.8,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalBuy",
      headerName: "Monto",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalCost",
      headerName: "Costo Total",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalProfits",
      headerName: "Ganancia",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalProfitsPercentage",
      headerName: "Ganancia(%)",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "average",
      headerName: "Prom. Compra",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "accessLevel",
      headerName: "Menu",
      headerClassName: "super-app-theme--header",

      renderCell: ({ row: { clientId } }) => (
        <IconButton
          size="large"
          color="inherit"
          onClick={(e) => handleOpenMenu(clientId, e)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box m="20px" sx={{ overflowX: "scroll" }}>
        <Box m="40px 0 0 0" height="75vh" width="1500px">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={clients.map((client) => ({
              ...client,
              name: `${client.name} ${client.lastName}`,
              totalBuy: formatPrice(client.totalBuy),
              totalCost: formatPrice(client.totalCost),
              totalProfits: formatPrice(client.totalProfits),
              totalProfitsPercentage: `${formatQuantity(
                (client.totalProfits * 100) / client.totalBuy
              )}%`,
              average: formatPrice(client.totalBuy / client.ordersCount),
            }))}
            columns={columns}
            getRowId={(row) => row.clientId}
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
      </Box>

      <MenuClients
        open={open}
        handleCloseMenu={handleCloseMenu}
        menuId={menuId}
      />
    </>
  );
}

export default TableListClientsOrder;
