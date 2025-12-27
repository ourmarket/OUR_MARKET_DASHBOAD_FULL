/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

// Iconos
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Utils y Componentes externos
import { dateToLocalDate } from "utils/dateFormat";
import { formatQuantity } from "utils/quantityFormat";
import MenuListUsers from "./MenuListUsers";

import DataGridProReusable from "components/DataGrid/DataGridProReusable";
import { usePutProductMutation } from "api/productApi";
import { useDispatch } from "react-redux";
import { showFeedback } from "reduxToolkit/uiSlice";
import UsersActions from "components/DataGrid/UsersActions";

function TableListProducts({ products }) {
  const listProducts = products?.products || [];
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [productId, setProductId] = useState(null);

  // --- Manejo del Menú desplegable ---
  const handleOpenMenu = (id, event) => {
    setOpen(event.currentTarget);
    setProductId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setProductId(null);
  };

  const columns = [
    {
      field: "img",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <Avatar
          src={params.row.img}
          variant="rounded"
          sx={{ width: 40, height: 40, mt: 1, boxShadow: 2 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Producto",
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
            fontWeight="medium"
            sx={{ color: darkMode ? "#fff" : "#344767", lineHeight: 1 }}
          >
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text">
            {params.row.brand || "Sin marca"}
          </Typography>
        </Box>
      ),
    },

    {
      field: "price",
      headerName: "Precio",
      flex: 1,
      editable: true,
      type: "number",
      renderCell: (params) => {
        const price = params.row.price ?? 0;
        return (
          <Typography variant="button" fontWeight="bold" color="success">
            ${price.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      field: "hasOffer",
      headerName: "Oferta",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) =>
        params.row.hasOffer ? (
          <Chip
            icon={
              <LocalOfferIcon style={{ color: "white", fontSize: "14px" }} />
            }
            label={`$${(params.row.offerPrice ?? 0).toLocaleString()}`}
            size="small"
            color="primary"
            sx={{ fontWeight: "bold" }}
          />
        ) : (
          <Typography variant="caption" color="secondary">
            No
          </Typography>
        ),
    },
    {
      field: "stockAvailable",
      headerName: "Stock",
      align: "center",
      headerAlign: "center",
      flex: 0.8,
      renderCell: (params) => {
        const stock = params.row.stockAvailable ?? 0;
        const outOfStock = stock <= 0;
        return (
          <Chip
            label={outOfStock ? "Agotado" : formatQuantity(stock)}
            variant="outlined"
            size="small"
            color={outOfStock ? "error" : "success"}
            sx={{ fontWeight: "bold", borderWeight: 2 }}
          />
        );
      },
    },
    {
      field: "isFeatured",
      headerName: "Destacado",
      width: 90,
      editable: true,
      type: "boolean",
      renderCell: (params) =>
        params.row.isFeatured ? (
          <CheckCircleIcon color="success" fontSize="medium" />
        ) : (
          <CancelIcon color="error" fontSize="medium" />
        ),
    },
    {
      field: "available",
      headerName: "Visible",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "boolean",
      renderCell: (params) =>
        params.row.available ? (
          <CheckCircleIcon color="success" fontSize="medium" />
        ) : (
          <CancelIcon color="error" fontSize="medium" />
        ),
    },
    {
      field: "updatedAt",
      headerName: "Actualizado",
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="caption" color="text">
          {dateToLocalDate(params.row.updatedAt)}
        </Typography>
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
      headerName: "",
      sortable: false,
      width: 50,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleOpenMenu(params.row._id, e)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const [editProduct, error, isLoading] = usePutProductMutation();
  const dispatch = useDispatch();

  const processRowUpdate = async (newRow) => {
    
    try {
      const result = await editProduct({
        id: newRow._id,
        price: newRow.price,
        available: newRow.available,
        isFeatured: newRow.isFeatured,
      }).unwrap();
      console.log("result:", result);

      return { ...newRow, ...result };
    } catch (err) {
      dispatch(
        showFeedback({
          title: "Error al actualizar el producto",
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
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Catálogo de Productos
            </Typography>
            <Typography variant="button" color="text">
              Lista de completa productos
            </Typography>
          </Box>
          <MDButton
            color="dark"
            variant="gradient"
            onClick={() => navigate("/productos/nuevo")}
          >
            Nuevo Producto
          </MDButton>
        </Stack>

        <Box
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": {
              borderBottom: darkMode
                ? "1px solid #384158"
                : "1px solid #f0f2f5",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: darkMode ? "#1f283e" : "#f8f9fa",
              borderRadius: "0 0 8px 8px",
            },
          }}
        >
          <DataGridProReusable
            processRowUpdate={processRowUpdate}
            rows={listProducts}
            columns={columns}
            getRowId={(row) => row._id}
            loading={isLoading}
            storageKey="products"
            pageSize={100}
            onRowDoubleClick={(params) =>
              navigate(`/productos/detalle/${params.row._id}`)
            }
            onBulkAction={(ids) => {
              //console.log("Seleccionados:", ids);
            }}
            error={error}
          />
        </Box>
      </Box>

      <MenuListUsers
        open={open}
        handleCloseMenu={handleCloseMenu}
        productId={productId}
      />
    </>
  );
}

export default TableListProducts;
