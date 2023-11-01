/* eslint-disable react/prop-types */
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import { formatPrice } from "utils/formaPrice";
import MenuClients from "../Menu/MenuClients";
import MDTypography from "components/MDTypography";
import { formatQuantity } from "utils/quantityFormat";

function TableDebtor({ clients }) {
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
      flex: 1.1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "totalUnpaidOrders",
      headerName: "Ordenes impagas",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { totalUnpaidOrders } }) => (
        <div
          style={{
            color: "white",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: "red",
            borderRadius: "5px",
          }}
        >
          {totalUnpaidOrders}
        </div>
      ),
    },
    {
      field: "total",
      headerName: "Monto ordenes",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { total } }) => (
        <div
          style={{
            color: "blue",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {total}
        </div>
      ),
    },

    {
      field: "totalCash",
      headerName: "P. efectivo",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { totalCash } }) => (
        <div
          style={{
            color: "green",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {totalCash}
        </div>
      ),
    },
    {
      field: "totalTransfer",
      headerName: "P. transferencias",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { totalTransfer } }) => (
        <div
          style={{
            color: "green",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {totalTransfer}
        </div>
      ),
    },

    {
      field: "totalDebt",
      headerName: "Monto impago",
      flex: 1,
      cellClassName: "totalDebt-column--cell",
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { totalDebt } }) => (
        <div
          style={{
            color: "red",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {totalDebt}
        </div>
      ),
    },
    {
      field: "debtPercentage",
      headerName: "% Impago",
      flex: 0.6,
      cellClassName: "totalDebt-column--cell",
      headerClassName: "super-app-theme--header",
      valueFormatter: ({ value }) => `${value}%`,
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
      <MDTypography variant="h5" p={2} sx={{ textAlign: "center" }}>
        Resumen de ordenes impagas por cliente
      </MDTypography>
      <Box m="0 20px" sx={{ overflowX: "scroll" }}>
        <Box height="75vh" width="1500px">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={clients.map((client) => ({
              ...client,
              name: `${client.name} ${client.lastName}`,
              totalDebt: formatPrice(client.totalDebt),
              totalCash: formatPrice(client.totalCash),
              totalTransfer: formatPrice(client.totalTransfer),
              total: formatPrice(
                client.totalDebt + client.totalCash + client.totalCash
              ),
              debtPercentage: formatQuantity(
                (client.totalDebt * 100) /
                  (client.totalDebt + client.totalCash + client.totalCash)
              ),
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

export default TableDebtor;
