/* eslint-disable react/prop-types */
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import { dateToLocalDate } from "utils/dateFormat";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { formatPrice } from "utils/formaPrice";
import MenuTableOrders from "../Menu/MenuTable";

function TableListBuys({ buys: listOrders }) {
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
      field: "createdAt",
      headerName: "Creada",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "supplier",
      headerName: "Proveedor",
      flex: 1.2,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "paid",
      headerName: "Pagada",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.paid ? (
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
      field: "quantityProducts",
      headerName: "Cant. Productos",
      headerClassName: "super-app-theme--header",
      flex: 1,
    },

    {
      field: "total",
      headerName: "Total",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "#503bb8" }}>
          {formatPrice(params.row.total)}
        </div>
      ),
    },
    {
      field: "cash",
      headerName: "P. Efectivo",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "green" }}>
          {formatPrice(params.row.cash)}
        </div>
      ),
    },
    {
      field: "transfer",
      headerName: "P. Transferencia",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "green" }}>
          {formatPrice(params.row.transfer)}
        </div>
      ),
    },
    {
      field: "debt",
      headerName: "Deuda",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "red" }}>
          {formatPrice(params.row.debt)}
        </div>
      ),
    },

    {
      field: "accessLevel",
      headerName: "Menu",
      headerClassName: "super-app-theme--header",

      renderCell: ({ row: { _id } }) => (
        <IconButton
          size="large"
          color="inherit"
          onClick={(e) => handleOpenMenu(_id, e)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ overflowX: "scroll" }}>
        <Box height="75vh" width="auto">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={listOrders.map((order) => ({
              ...order,
              createdAt: `${dateToLocalDate(order.createdAt)}hs`,
              supplier: order.supplier.businessName,
              cash: order?.payment?.cash || 0,
              transfer: order?.payment?.transfer || 0,
              debt: order?.payment?.debt || 0,
              paid: order.paid,
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
      </Box>

      <MenuTableOrders
        open={open}
        handleCloseMenu={handleCloseMenu}
        menuId={menuId}
      />
    </>
  );
}

export default TableListBuys;
