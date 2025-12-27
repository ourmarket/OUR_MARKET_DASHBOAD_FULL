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

// Helpers
import { formatPrice } from "utils/formaPrice";
import { formatDate } from "./mockData";
import { ORDER_STATUS } from "../../../data/orderStatus";

export function OrderBuyTable({ orders: orderData, isLoading }) {
  const orders = orderData?.data || [];
  const navigate = useNavigate();

  const getStatusLabel = (status) => ORDER_STATUS[status]?.label || status;

  const getStatusColor = (status) => ORDER_STATUS[status]?.color || "light";

  const calculateEstimatedAmount = (items = []) =>
    items.reduce(
      (acc, item) =>
        acc + (item.quantityOrdered || 0) * (item.estimatedUnitCost || 0),
      0
    );

  const rows = (orders || []).map((po) => ({
    id: po._id,
    code: po.code,
    supplierName: po.supplier?.businessName || "-",
    expectedDeliveryDate: po.expectedDate,
    status: po.status,
    estimatedAmount: calculateEstimatedAmount(po.items),
  }));

  const columns = [
    {
      field: "code",
      headerName: "Nº Orden",
      flex: 1,
      renderCell: (params) => (
        <MDTypography variant="button" fontWeight="medium">
          {params.value}
        </MDTypography>
      ),
    },
    {
      field: "supplierName",
      headerName: "Proveedor",
      flex: 2,
      renderCell: (params) => (
        <MDBox display="flex" alignItems="center">
          <Icon fontSize="small" sx={{ mr: 1 }}>
            business
          </Icon>
          <MDTypography variant="button">{params.value}</MDTypography>
        </MDBox>
      ),
    },
    {
      field: "expectedDeliveryDate",
      headerName: "Fecha Esperada",
      flex: 1.5,
      renderCell: (params) => (
        <MDTypography variant="button">
          {params.value ? formatDate(params.value) : "-"}
        </MDTypography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      align: "center",
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
      field: "estimatedAmount",
      headerName: "Monto Estimado",
      flex: 1,
      align: "right",
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
      sortable: false,
      renderCell: (params) => (
        <MDButton
          variant="text"
          color="info"
          size="small"
          onClick={() => navigate(`/compras/ordenes/${params.row.id}`)}
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
          Órdenes de Compra
        </MDTypography>
      </MDBox>
      <MDBox pt={0} pb={2} px={2}>
        <MDBox sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
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
