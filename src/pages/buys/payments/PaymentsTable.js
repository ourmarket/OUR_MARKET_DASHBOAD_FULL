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

export function PaymentsTable({ payments, isLoading }) {
  console.log(payments);
  const navigate = useNavigate();

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "TRANSFER":
        return "account_balance";
      case "CASH":
        return "payments";
      case "CHECK":
        return "request_quote";
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return "credit_card";
      default:
        return "payment";
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "TRANSFER":
        return "Transferencia";
      case "CASH":
        return "Efectivo";
      case "CHECK":
        return "Cheque";
      case "CREDIT_CARD":
        return "T. Crédito";
      case "DEBIT_CARD":
        return "T. Débito";
      default:
        return method;
    }
  };

  const columns = [
    {
      field: "paymentNumber",
      headerName: "Nº Pago",
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
      minWidth: 150,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <Icon fontSize="small" sx={{ mr: 1, color: "text.secondary" }}>
            business
          </Icon>
          <MDTypography variant="button" color="text">
            {params.row.supplier?.businessName || "Sin Proveedor"}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <Icon fontSize="small" sx={{ mr: 1, color: "text.secondary" }}>
            event
          </Icon>
          <MDTypography variant="button" color="text">
            {dateToLocalDate(params.value)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Método",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <Icon fontSize="small" sx={{ mr: 1, color: "text.secondary" }}>
            {getPaymentMethodIcon(params.value)}
          </Icon>
          <MDTypography variant="button" color="text">
            {getPaymentMethodLabel(params.value)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "reference",
      headerName: "Referencia",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <MDTypography variant="caption" color="text">
          {params.value || "-"}
        </MDTypography>
      ),
    },
    {
      field: "amount",
      headerName: "Monto",
      flex: 1,
      minWidth: 110,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="bold" color="success">
          {formatPrice(params.value)}
        </MDTypography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      align: "right",
      renderCell: (params) => (
        <MDButton
          variant="text"
          color="info"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/compras/pagos/${params.row.id}`);
          }}
        >
          <Icon>visibility</Icon>
        </MDButton>
      ),
    },
  ];

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Historial de Pagos
        </MDTypography>
      </MDBox>
      <MDBox pt={0} pb={2} px={2}>
        <MDBox sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={payments || []}
            getRowId={(row) => row.id || row._id}
            columns={columns}
            loading={isLoading}
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
