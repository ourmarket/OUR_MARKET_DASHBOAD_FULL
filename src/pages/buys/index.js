import { useState } from "react";
import { Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { getStats, formatCurrency } from "./mockData";
import { OrderBuyTable } from "./orders/OrderBuyTable";
import { PurchasesTable } from "./buys/PurchasesTable";
import { PaymentsTable } from "./payments/PaymentsTable";
import { useGetPurchaseOrdersQuery } from "api/purchaseOrderApi";
import { useGetBuyPaymentsQuery, useGetBuysQuery } from "api/buyApi";

function BuyPage() {
  const { data: purchaseOrders, isLoading: l1 } = useGetPurchaseOrdersQuery();
  const { data: dataBuys, isLoading: l2 } = useGetBuysQuery();
  const { data: dataBuyPayments, isLoading: l3 } = useGetBuyPaymentsQuery();

  const [activeTab, setActiveTab] = useState(0);
  const [menu, setMenu] = useState(null);
  const stats = getStats();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>
        <Link
          to="/compras/ordenes/nueva"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Icon sx={{ mr: 1 }}>assignment</Icon>
          Nueva Orden de Compra
        </Link>
      </MenuItem>
      <MenuItem onClick={closeMenu}>
        <Link
          to="/compras/directa/nueva"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Icon sx={{ mr: 1 }}>shopping_bag</Icon>
          Registrar Compra Directa
        </Link>
      </MenuItem>
      <MenuItem onClick={closeMenu}>
        <Link
          to="/compras/pagos/nuevo"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Icon sx={{ mr: 1 }}>account_balance_wallet</Icon>
          Registrar Pago
        </Link>
      </MenuItem>
    </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Header & Actions */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="medium">
              Compras
            </MDTypography>
            <MDTypography variant="button" color="text">
              Gestioná todo el flujo de compras en un solo lugar
            </MDTypography>
          </MDBox>
          <MDBox>
            <MDButton variant="gradient" color="info" onClick={openMenu}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;Nueva Acción
            </MDButton>
            {renderMenu}
          </MDBox>
        </MDBox>

        {/* KPIs */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="schedule"
                title="Pendientes de Aprobación"
                count={stats.pendingApproval}
                percentage={{
                  color: "secondary",
                  amount: "",
                  label: "órdenes esperando revisión",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="error_outline"
                title="Pendientes de Pago"
                count={stats.pendingPayment}
                percentage={{
                  color: "secondary",
                  amount: "",
                  label: "compras sin saldar",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="trending_up"
                title="Comprado este Mes"
                count={formatCurrency(stats.totalPurchasedMonth)}
                percentage={{
                  color: "success",
                  amount: "+12%",
                  label: "que el mes pasado",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Tabs & Content */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={2}>
                <AppBar position="static">
                  <Tabs
                    orientation="horizontal"
                    value={activeTab}
                    onChange={handleTabChange}
                  >
                    <Tab
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Icon fontSize="small" sx={{ mr: 1 }}>
                            assignment
                          </Icon>
                          Planificadas (
                          {purchaseOrders ? purchaseOrders.data.length : 0})
                        </div>
                      }
                    />
                    <Tab
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Icon fontSize="small" sx={{ mr: 1 }}>
                            shopping_bag
                          </Icon>
                          Realizadas ({dataBuys?.length || 0})
                        </div>
                      }
                    />
                    <Tab
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Icon fontSize="small" sx={{ mr: 1 }}>
                            account_balance_wallet
                          </Icon>
                          Pagos ({dataBuyPayments?.length || 0})
                        </div>
                      }
                    />
                  </Tabs>
                </AppBar>

                <MDBox mt={3}>
                  {activeTab === 0 && (
                    <MDBox>
                      <MDTypography
                        variant="h6"
                        fontWeight="medium"
                        gutterBottom
                      >
                        ¿Qué compras están planificadas o esperando aprobación?
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        <OrderBuyTable orders={purchaseOrders} isLoading={l1} />
                      </MDTypography>
                    </MDBox>
                  )}
                  {activeTab === 1 && (
                    <MDBox>
                      <MDTypography
                        variant="h6"
                        fontWeight="medium"
                        gutterBottom
                      >
                        ¿Qué ya compré y cuánto debo pagar?
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        <PurchasesTable buys={dataBuys} isLoading={l2} />
                      </MDTypography>
                    </MDBox>
                  )}
                  {activeTab === 2 && (
                    <MDBox>
                      <MDTypography
                        variant="h6"
                        fontWeight="medium"
                        gutterBottom
                      >
                        ¿Qué pagos ya se hicieron?
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        <PaymentsTable
                          payments={dataBuyPayments}
                          isLoading={l3}
                        />
                      </MDTypography>
                    </MDBox>
                  )}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default BuyPage;
