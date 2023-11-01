/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { Box, Card, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MDButton from "components/MDButton";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import MenuProductsLots from "../Menu/MenuDeliveryZone";

function TableListDeliveryZone({ deliveryZones }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  console.log(deliveryZones);

  const navigate = useNavigate();
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
      headerName: "Zona",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "province",
      headerName: "Ciudad",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "city",
      headerName: "Ciudad",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },

    {
      field: "cost",
      headerName: "Costo",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "active",
      headerName: "Color",
      flex: 0.6,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div
          style={{
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            backgroundColor: `${params.row.fillColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        ></div>
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
    <Card>
      <Box m="20px" sx={{ overflowX: "scroll" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <MDButton
            color="dark"
            variant="gradient"
            onClick={() => navigate("/distribucion/zonas/nueva")}
          >
            Nueva Zona
          </MDButton>
        </Stack>
        <Box m="40px 0 0 0" height="75vh" width="auto">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={deliveryZones.map((zone) => ({
              ...zone,
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

      <MenuProductsLots
        open={open}
        handleCloseMenu={handleCloseMenu}
        menuId={menuId}
      />
    </Card>
  );
}

export default TableListDeliveryZone;
