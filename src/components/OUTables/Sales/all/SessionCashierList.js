/* eslint-disable react/prop-types */
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";

import MenuTableStocks from "../menu/MenuTable";
import { dateToLocalDate } from "utils/dateFormat";
import { formatPrice } from "utils/formaPrice";

function SessionCashierList({ sessions = [] }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [open, setOpen] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleOpenMenu = (id, event) => {
    setOpen(event.currentTarget);
    setSessionId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSessionId(null);
  };

  const columns = [
    {
      field: "cashier",
      headerName: "Cajero",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "initialCash",
      headerName: "Efectivo inicial",
      flex: 0.7,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "initDate",
      headerName: "Apertura",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "finishDate",
      headerName: "Cierre",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "orderQuantity",
      headerName: "Cant. Ordenes",
      flex: 0.7,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "total",
      headerName: "Total",
      // flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "blue" }}>
          {params.row.total}
        </div>
      ),
    },
    {
      field: "cash",
      headerName: "P. Efectivo",
      // flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "green" }}>
          {params.row.cash}
        </div>
      ),
    },
    {
      field: "transfer",
      headerName: "P. Transferencia",
      // flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "green" }}>
          {params.row.transfer}
        </div>
      ),
    },
    {
      field: "debt",
      headerName: "Debe",
      // flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div style={{ fontWeight: "bold", color: "red" }}>
          {params.row.debt}
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
      <Box m="20px" sx={{ overflowX: "scroll" }}>
        <Box height="75vh" width="auto">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={sessions.map((session) => ({
              ...session,
              cashier: `${session.user.name} ${session.user.lastName}`,
              initDate: `${dateToLocalDate(session.initDate)}hs`,
              finishDate: session.finishDate
                ? `${dateToLocalDate(session.finishDate)}hs`
                : "No cerrada",
              orderQuantity: session.localOrder.length,
              initialCash: formatPrice(session.initialCash),
              cash: session.finishDate
                ? formatPrice(session.payment.cash)
                : "No cerrada",
              transfer: session.finishDate
                ? formatPrice(session.payment.transfer)
                : "No cerrada",
              debt: session.finishDate
                ? formatPrice(session.payment.debt)
                : "No cerrada",
              total: session.finishDate
                ? formatPrice(
                    session.payment.debt +
                      session.payment.cash +
                      session.payment.transfer
                  )
                : "No cerrada",
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

      <MenuTableStocks
        open={open}
        handleCloseMenu={handleCloseMenu}
        sessionId={sessionId}
      />
    </>
  );
}

export default SessionCashierList;
