/* eslint-disable react/prop-types */
import { Avatar, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import colors from "assets/theme-dark/base/colors";
import { useMaterialUIController } from "context";
import { dateToLocalDate } from "utils/dateFormat";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { formatPrice } from "utils/formaPrice";
import { formatQuantity } from "utils/quantityFormat";

function StockAvailableTable({ allStock }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const stocks = allStock.filter((product) => product.stock > 0);

  const columns = [
    {
      field: "img",
      headerName: "Img",
      width: 60,
      renderCell: (params) => <Avatar src={params.row.img} />,
      sortable: false,
      filterable: false,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "product",
      headerName: "Producto",
      flex: 2,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    },
    /*  {
      field: "supplier",
      headerName: "Proveedor",
      flex: 1.2,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
    }, */

    {
      field: "thereIsStock",
      headerName: "Stock",
      flex: 0.6,
      headerClassName: "super-app-theme--header",
      renderCell: (params) =>
        params.row.thereIsStock ? (
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
      field: "quantity",
      headerName: "Cant. Comprada",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { quantity } }) => (
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
          {quantity}
        </div>
      ),
    },
    {
      field: "stock",
      headerName: "Cant. Actual",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { stock } }) => (
        <div
          style={{
            color: "black",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {stock}
        </div>
      ),
    },

    {
      field: "stock1",
      headerName: "Cant. Actual %",
      flex: 0.6,
      headerClassName: "super-app-theme--header",
      renderCell: ({ row: { stock, quantity } }) => (
        <div
          style={{
            height: "20px",
            width: "100%",
            position: "relative",
            color: "black",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #49a3f1",
            backgroundColor: "#eee",
          }}
        >
          <p style={{ zIndex: "2" }}>{Math.trunc((stock * 100) / quantity)}%</p>
          <span
            style={{
              position: "absolute",
              background: "#49a3f1",
              height: "19px",
              width: `${Math.trunc((stock * 100) / quantity)}%`,
              top: 0,
              left: 0,
            }}
          />
        </div>
      ),
    },

    {
      field: "cost",
      headerName: "Costo",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "cost_unit",
      headerName: "Costo Unidad",
      flex: 0.8,
      headerClassName: "super-app-theme--header",
    },
  ];

  return (
    <>
      <Box m="20px" sx={{ overflowX: "scroll" }}>
        <Box m="10px 0 0 0" height="75vh" width="auto">
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            rows={stocks.map((productsLot) => ({
              ...productsLot,
              _id: productsLot._id,
              product: productsLot.product.name,
              img: productsLot.product.img,
              cost: `${formatPrice(productsLot.cost)}`,
              stock: `${formatQuantity(productsLot.stock)}`,
              quantity: `${formatQuantity(productsLot.quantity)}`,
              supplier: productsLot.supplier,

              cost_unit: `${formatPrice(productsLot.unityCost)}`,
              createdAt: dateToLocalDate(productsLot.createdStock),
              updatedAt: productsLot.updateStock
                ? dateToLocalDate(productsLot.updateStock)
                : "",
              thereIsStock: productsLot.stock > 0 ? true : false,
              moveDate: productsLot.moveDate
                ? dateToLocalDate(productsLot.moveDate)
                : "Sin movimiento",
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
    </>
  );
}

export default StockAvailableTable;
