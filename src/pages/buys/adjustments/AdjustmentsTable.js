import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// @mui material components
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// Utils
import { formatPrice } from "utils/formaPrice";
import { dateToLocalDate } from "utils/dateFormat";

// Mock Data
import { adjustments, purchases } from "../mockData";

export function AdjustmentsTable() {
  const navigate = useNavigate();

  const getAdjustmentTypeLabel = (type) => {
    switch (type) {
      case "shortage":
        return "Faltante";
      case "damage":
        return "Daño";
      case "price":
        return "Diferencia Precio";
      case "bonus":
        return "Bonificación";
      default:
        return type;
    }
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case "shortage":
        return "error";
      case "damage":
        return "warning";
      case "price":
        return "info";
      case "bonus":
        return "success";
      default:
        return "secondary";
    }
  };

  const columns = [
    {
      field: "adjustmentNumber",
      headerName: "Nº Ajuste",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {params.value}
        </MDTypography>
      ),
    },
    {
      field: "supplier",
      headerName: "Proveedor",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <MDTypography variant="button" color="text">
          {params.value?.name || params.value?.businessName || "Sin Proveedor"}
        </MDTypography>
      ),
    },
    {
      field: "purchaseId",
      headerName: "Compra Relacionada",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        const purchase = purchases.find((p) => p.id === params.value);
        return (
          <MDTypography variant="button" color="info" fontWeight="medium">
            {purchase?.purchaseNumber || purchase?.code || "-"}
          </MDTypography>
        );
      },
    },
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <MDTypography variant="button" color="text">
          {dateToLocalDate(params.value)}
        </MDTypography>
      ),
    },
    {
      field: "type",
      headerName: "Tipo",
      flex: 1,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <MDBadge
          badgeContent={getAdjustmentTypeLabel(params.value)}
          color={getAdjustmentTypeColor(params.value)}
          variant="gradient"
          size="sm"
        />
      ),
    },
    {
      field: "totalAmount",
      headerName: "Monto",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {formatPrice(params.value)}
        </MDTypography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      align: "right",
      renderCell: (params) => (
        <MDButton
          variant="text"
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/compras/ajustes/${params.row.id}`);
          }}
        >
          <Icon>visibility</Icon>&nbsp;Ver
        </MDButton>
      ),
    },
  ];

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Ajustes de Compra
        </MDTypography>
      </MDBox>
      <MDBox pt={0} pb={2} px={2}>
        <MDBox sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={adjustments}
            getRowId={(row) => row.id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-cell": {
                borderColor: "transparent",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderColor: "#f0f2f5",
                backgroundColor: "#f8f9fa",
              },
            }}
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}
