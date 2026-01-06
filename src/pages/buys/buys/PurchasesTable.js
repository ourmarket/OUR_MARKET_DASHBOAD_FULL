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
import { dateToLocalDate, formatDateMonthFull } from "utils/dateFormat";

export function PurchasesTable({ buys: buysData, isLoading }) {
  const navigate = useNavigate();
  const buys = buysData || [];
  console.log(buys);

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PARTIAL":
        return "warning";
      case "PENDING":
        return "error";
      default:
        return "light";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PAID":
        return "Pagado";
      case "PARTIAL":
        return "Parcial";
      case "PENDING":
        return "Pendiente";
      default:
        return status;
    }
  };

  const getReceiptStatusLabel = (status) => {
    switch (status) {
      case "COMPLETE":
        return "Completado";
      case "PARTIAL":
        return "Parcial";
      case "NONE":
        return "No recibido";
      default:
        return status;
    }
  };

  const getReceiptStatusColor = (status) => {
    switch (status) {
      case "COMPLETE":
        return "success";
      case "PARTIAL":
        return "warning";
      case "NONE":
        return "error";
      default:
        return "light";
    }
  };

  const columns = [
    {
      field: "code",
      headerName: "Cód. Compra",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {params.value}
        </MDTypography>
      ),
    },
    {
      field: "supplier",
      headerName: "Proveedor",
      flex: 2,
      minWidth: 200,
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
      headerName: "Fecha programada",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <Icon fontSize="small" sx={{ mr: 1, color: "text.secondary" }}>
            event
          </Icon>
          <MDTypography variant="button" color="text">
            {formatDateMonthFull(params.value)}
          </MDTypography>
        </MDBox>
      ),
    },
    {
      field: "status",
      headerName: "Estado Pago",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <MDBadge
          badgeContent={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          variant="gradient"
          size="sm"
        />
      ),
    },
    {
      field: "receiptStatus",
      headerName: "Recepción",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <MDBadge
          badgeContent={getReceiptStatusLabel(params.value)}
          color={getReceiptStatusColor(params.value)}
          variant="gradient"
          size="sm"
        />
      ),
    },
    {
      field: "total",
      headerName: "Total",
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
      field: "balanceDue",
      headerName: "Saldo",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => {
        const totalPayments =
          params.row.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
        return (params.row.total || 0) - totalPayments;
      },
      renderCell: (params) => (
        <MDTypography
          variant="button"
          fontWeight={params.value > 0 ? "bold" : "regular"}
          color={params.value > 0 ? "error" : "text"}
        >
          {formatPrice(params.value)}
        </MDTypography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      flex: 1.4,
      minWidth: 150,
      sortable: false,
      align: "right",
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/compras/detalle1/${params.row._id}`);
            }}
          >
            <Icon>visibility</Icon>&nbsp;Ver
          </MDButton>
          {params.row.receiptStatus === "NONE" && (
            <MDButton
              variant="text"
              color="success"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/compras/recepciones/nueva/${params.row._id}`);
              }}
            >
              <Icon>inventory_2</Icon>&nbsp;Recibir
            </MDButton>
          )}
        </MDBox>
      ),
    },
  ];

  return (
    <Card>
      <MDBox p={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Historial de Compras
        </MDTypography>
      </MDBox>
      <MDBox pt={0} pb={2} px={2}>
        <MDBox sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={buys}
            getRowId={(row) => row._id}
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
