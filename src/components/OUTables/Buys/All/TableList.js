/* eslint-disable react/prop-types */
import { useState } from "react";
import { IconButton, Chip, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

// Iconos
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PersonIcon from "@mui/icons-material/Person";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

// Utils
import { dateToLocalDate } from "utils/dateFormat";
import { formatPrice } from "utils/formaPrice";
import MenuTableOrders from "../Menu/MenuTable";

const STATUS_MAP = {
  PAID: { label: "PAGADA", color: "success" },
  PARTIAL: { label: "PARCIAL", color: "warning" },
  PENDING: { label: "PENDIENTE", color: "error" },
};

function TableListBuys({ buys }) {
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
      flex: 1,
      renderCell: ({ value }) => (
        <MDTypography variant="caption" color="text" fontWeight="regular">
          {value}
        </MDTypography>
      ),
    },
    {
      field: "supplier",
      headerName: "Proveedor",
      flex: 1.8,
      renderCell: ({ row }) => (
        <MDBox display="flex" flexDirection="column" py={1.5}>
          <MDTypography variant="button" fontWeight="bold" color="dark" sx={{ lineHeight: 1 }}>
            {row.supplierName || "S/N"}
          </MDTypography>
          <MDTypography variant="caption" color="secondary" fontWeight="regular" sx={{ mt: 0.5 }}>
            CUIT: {row.supplierCuit || "000"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "contact",
      headerName: "Contacto",
      flex: 1.8,
      renderCell: ({ row }) => (
        <MDBox display="flex" flexDirection="column" py={1.5} justifyContent="center">
          {row.supplierPhone && (
            <MDBox display="flex" alignItems="center" gap={0.5} mb={0.3}>
              <PhoneEnabledIcon sx={{ fontSize: "13px", color: "secondary.main" }} />
              <MDTypography variant="caption" color="secondary">
                {row.supplierPhone}
              </MDTypography>
            </MDBox>
          )}
          {row.supplierEmail && (
            <MDBox display="flex" alignItems="center" gap={0.5}>
              <MailOutlineIcon sx={{ fontSize: "13px", color: "secondary.main" }} />
              <MDTypography variant="caption" color="info" sx={{ textDecoration: "underline", fontSize: "11px" }}>
                {row.supplierEmail}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      ),
    },
    {
      field: "createdBy",
      headerName: "Comprado por",
      flex: 1.3,
      renderCell: ({ row }) => (
        <MDBox display="flex" alignItems="center" gap={1}>
          <PersonIcon sx={{ fontSize: "16px", color: "secondary.main" }} />
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {row.userName}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 0.8,
      renderCell: ({ value }) => {
        const cfg = STATUS_MAP[value] || STATUS_MAP.PENDING;
        return (
          <Chip 
            size="small" 
            label={cfg.label} 
            color={cfg.color} 
            sx={{ fontWeight: "bold", borderRadius: "8px", fontSize: "10px" }} 
          />
        );
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      renderCell: ({ value }) => (
        <MDTypography variant="button" fontWeight="bold" color="dark">
          {formatPrice(value)}
        </MDTypography>
      ),
    },
    {
      field: "debt",
      headerName: "Adeudado",
      flex: 1,
      renderCell: ({ value }) => (
        <MDTypography variant="button" fontWeight="bold" color="dark">
          {formatPrice(value)}
        </MDTypography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: ({ row }) => (
        <IconButton onClick={(e) => handleOpenMenu(row._id, e)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const rows = buys.map((buy) => ({
    ...buy,
    supplierName: buy.supplier?.businessName?.toUpperCase(),
    supplierCuit: buy.supplier?.cuit,
    supplierPhone: buy.supplier?.phone,
    supplierEmail: buy.supplier?.email,
    userName: buy.createdBy ? `${buy.createdBy.name} ${buy.createdBy.lastName || ""}` : "Sistema",
    createdAt: dateToLocalDate(buy.createdAt),
    debt: buy.total - (buy.payment.cash + buy.payment.transfer)
  }));

  return (
    <>
      <MDBox height="75vh" sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          rowHeight={75}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: darkMode ? "1px solid #333" : "1px solid #f0f2f5",
              textTransform: "capitalize",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: darkMode ? "1px solid #333" : "1px solid #f0f2f5",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "13px",
              color: darkMode ? "#fff" : "#7b809a",
            }
          }}
        />
      </MDBox>

      <MenuTableOrders
        open={open}
        handleCloseMenu={handleCloseMenu}
        menuId={menuId}
      />
    </>
  );
}

export default TableListBuys;