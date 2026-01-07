import Dashboard2 from "pages/dashboard2";
import Dashboard1 from "pages/dashboard";
import Dashboard3 from "pages/dashboard3";
import ListUsers from "pages/users/list-users";
import CreateNewUser from "pages/users/new-user";
import EditUser from "pages/users/edit-user";
import EditPasswordUser from "pages/users/change-password";
import Products from "pages/products";
import ProductDetail from "pages/products/product/product-detail";
import NewCategory from "pages/products/category/category-create";
import EditCategory from "pages/products/category/category-edit";
import CreateProduct from "pages/products/product/product-create";

import ListSuppliers from "pages/suppliers/list-suppliers";
import CreateNewSupplier from "pages/suppliers/create-suppliers";
import EditSupplier from "pages/suppliers/edit-suppliers";
import ListClients from "pages/clients/list-clients";
import CreateSimpleClient from "pages/clients/create-simple-client";
import EditClient from "pages/clients/edit-clients";
import DetailsClients from "pages/clients/details-clients";
import DetailClientProduct from "pages/clients/details-clients-products";
import ListClientAddress from "pages/clientsAddress";
import CreateNewClientAddress from "pages/clientsAddress/create-clientAddress";
import EditClientAddress from "pages/clientsAddress/edit-clientAddress";
import ListOrders from "pages/orders/order-list";
import OrderDetails from "pages/orders/order-datails";
import OrderCreate from "pages/orders/order-create-all/order-delivery";
import OrderLocalCreate from "pages/orders/order-create-all/order-local";
import OrderEdit from "pages/orders/order-edit";
import ListDistributors from "pages/distributor/list-distributors";
import CreateNewDistributor from "pages/distributor/create-distributors";
import EditDistributor from "pages/distributor/edit-distributors";
import ListDeliveryTruck from "pages/deliveryTruck/list-deliveryTruck";
import CreateDeliveryTruck from "pages/deliveryTruck/create-deliveryTruck";
import EditDeliveryTruck from "pages/deliveryTruck/edit-deliveryTruck";
import DetailsDeliveryTruck from "pages/deliveryTruck/details-deliveryTruck";
import ListDeliveryZone from "pages/deliveryZone/list-deliveryZone";
import CreateNewDeliveryZone from "pages/deliveryZone/create-deliveryZone";
import EditDeliveryZone from "pages/deliveryZone/edit-deliveryZone";
import ListDeliverySubZone from "pages/deliverySubZone/list-deliverySubZone";
import CreateNewSubDeliveryZone from "pages/deliverySubZone/create-deliverySubZone";
import EditDeliverySubZone from "pages/deliverySubZone/edit-deliverySubZone";
import ProductsSellByRange from "pages/reports/reportByRange";
import CreateNewExpenses from "pages/expenses/new-expenses";
import ListExpenses from "pages/expenses/list-expenses";
import EditExpenses from "pages/expenses/edit-expenses";
import Sales from "pages/sales";
import SalesDetail from "pages/sales/detail/SalesDetail";

import CrearNuevoNegocio from "pages/negocios/nuevo-negocio";
import ListaNegocios from "pages/negocios/lista-negocios";
import EditarNegocioPage from "pages/negocios/editar-negocio";
//buy
import BuyPage from "pages/buys";
import NewOrder from "pages/buys/orders/NewOrder";
import OrderBuyDetails from "pages/buys/orders/OrderBuyDetails";
import EditOrder from "pages/buys/orders/EditOrder";
import NewPurchase from "pages/buys/buys/NewPurchase";
import PurchaseDetails from "pages/buys/buys/PurchaseDetails";
import NewPayment from "pages/buys/payments/NewPayment";
import PaymentDetails from "pages/buys/payments/PaymentDetails";
import PaymentByBuyId from "pages/buys/payments/PaymentByBuyId";
import NewAdjustment from "pages/buys/adjustments/NewAdjustment";
import AdjustmentDetail from "pages/buys/adjustments/AdjustmentDetail";
import NewReceipt from "pages/buys/buys/NewReceipt";
import StockPage from "pages/stock/Stock";
import StockDetail from "pages/stock/StockDetail";
import StockMovements from "pages/stock/StockMovement";
import Manufacturing from "pages/manufacturing/Manufacturing";
import NewProduction from "pages/manufacturing/NewProduction";
import ManufacturingDetail from "pages/manufacturing/ManufacturingDetail";
import Recipes from "pages/manufacturing/Recipes";
import ManufacturingReports from "pages/manufacturing/ManufacturingReports";

export const routes_dr = [
  //dashboard
  {
    route: "/dashboard/totales",
    component: <Dashboard1 />,
  },
  {
    route: "/dashboard/reparto",
    component: <Dashboard2 />,
  },
  {
    route: "/dashboard/cajones_de_pollo",
    component: <Dashboard3 />,
  },
  /* usuario  */
  {
    route: "/usuarios/lista",
    component: <ListUsers />,
  },
  {
    route: "/usuarios/nuevo",
    component: <CreateNewUser />,
  },
  {
    route: "/usuarios/editar/:id",
    component: <EditUser />,
  },
  {
    route: "/usuarios/editar/password/:id",
    component: <EditPasswordUser />,
  },

  /* Productos */

  {
    route: "/productos",
    component: <Products />,
  },
  {
    route: "/productos/nuevo",
    component: <CreateProduct />,
  },
  {
    // este edita producto, oferta y stock
    route: "/productos/detalle/:id",
    component: <ProductDetail />,
  },

  {
    route: "/productos/categoria/nueva",
    component: <NewCategory />,
  },
  {
    route: "/productos/categoria/editar/:id",
    component: <EditCategory />,
  },

  /* Proveedores */

  {
    route: "/productos/proveedores/lista",
    component: <ListSuppliers />,
  },
  {
    route: "/productos/proveedores/nuevo",
    component: <CreateNewSupplier />,
  },
  {
    route: "/productos/proveedores/editar/:id",
    component: <EditSupplier />,
  },

  /* Clientes */

  {
    route: "/clientes/lista",
    component: <ListClients />,
  },
  {
    route: "/clientes/nuevo",
    component: <CreateSimpleClient />,
  },

  {
    route: "/clientes/editar/:id",
    component: <EditClient />,
  },
  {
    route: "/clientes/detalle/:id",
    component: <DetailsClients />,
  },
  {
    route: "/clientes/detalle/producto/:id",
    component: <DetailClientProduct />,
  },
  /* Direcciones clientes */
  {
    route: "/clientes/direcciones/lista",
    component: <ListClientAddress />,
  },
  {
    route: "/clientes/direcciones/nuevo",
    component: <CreateNewClientAddress />,
  },
  {
    route: "/clientes/direcciones/editar/:id",
    component: <EditClientAddress />,
  },

  /* Ordenes */
  {
    route: "/ordenes/lista",
    component: <ListOrders />,
  },

  {
    route: "/ordenes/detalle/:id",
    component: <OrderDetails />,
  },
  {
    route: "/ordenes/nueva",
    component: <OrderCreate />,
  },
  {
    route: "/ordenes/nueva-local",
    component: <OrderLocalCreate />,
  },
  {
    route: "/ordenes/editar/:id",
    component: <OrderEdit />,
  },
  /* Distribuidoras */
  {
    route: "/distribucion/distribuidoras/lista",
    component: <ListDistributors />,
  },
  {
    route: "/distribucion/distribuidoras/nueva",
    component: <CreateNewDistributor />,
  },
  {
    route: "/distribucion/distribuidoras/editar/:id",
    component: <EditDistributor />,
  },
  /* Repartidores */
  {
    route: "/distribucion/repartidores/lista",
    component: <ListDeliveryTruck />,
  },
  {
    route: "/distribucion/repartidores/nuevo",
    component: <CreateDeliveryTruck />,
  },
  {
    route: "/distribucion/repartidores/editar/:id",
    component: <EditDeliveryTruck />,
  },
  {
    route: "/distribucion/repartidores/detalle/:id",
    component: <DetailsDeliveryTruck />,
  },
  /* Zonas reparto */
  {
    route: "/distribucion/zonas/lista",
    component: <ListDeliveryZone />,
  },
  {
    route: "/distribucion/zonas/nueva",
    component: <CreateNewDeliveryZone />,
  },
  {
    route: "/distribucion/zonas/editar/:id",
    component: <EditDeliveryZone />,
  },
  /* Sub Zonas reparto */
  {
    route: "/distribucion/sub-zonas/lista",
    component: <ListDeliverySubZone />,
  },
  {
    route: "/distribucion/sub-zonas/nueva",
    component: <CreateNewSubDeliveryZone />,
  },
  {
    route: "/distribucion/sub-zonas/editar/:id",
    component: <EditDeliverySubZone />,
  },
  /* Reportes */
  /* {
    route: "/reportes/productos-vendidos-por-dia",
    component: (
     
        <ProductsSellByDay />
     
    ),
  }, */
  {
    route: "/reportes/productos-vendidos-por-rango",
    component: <ProductsSellByRange />,
  },
  // Expenses
  {
    route: "/gastos/nuevo",
    component: <CreateNewExpenses />,
  },
  {
    route: "/gastos/lista",
    component: <ListExpenses />,
  },
  {
    route: "/gastos/editar/:id",
    component: <EditExpenses />,
  },

  //sales

  {
    route: "/ventas",
    component: <Sales />,
  },
  {
    route: "/ventas/:id",
    component: <SalesDetail />,
  },

  /* negocios */

  {
    route: "/negocios/lista",
    component: <ListaNegocios />,
  },
  {
    route: "/negocios/nuevo",
    component: <CrearNuevoNegocio />,
  },

  {
    route: "/negocios/editar/:id",
    component: <EditarNegocioPage />,
  },
  {
    route: "/negocios/detalle/:id",
    component: <DetailsClients />,
  },

  //Operaciones
  {
    route: "/compras",
    component: <BuyPage />,
  },
  {
    route: "/compras/ordenes/nueva",
    component: <NewOrder />,
  },
  {
    route: "/compras/ordenes/editar/:id",
    component: <EditOrder />,
  },
  {
    route: "/compras/nueva",
    component: <NewPurchase />,
  },
  {
    route: "/compras/pagos/nuevo",
    component: <NewPayment />,
  },
  {
    route: "/compras/detalle1/:id",
    component: <PurchaseDetails />,
  },
  {
    route: "/compras/pagos/:id",
    component: <PaymentDetails />,
  },
  {
    route: "/compras/pagos/registrar-pago/:id",
    component: <PaymentByBuyId />,
  },
  {
    route: "/compras/ordenes/:id",
    component: <OrderBuyDetails />,
  },
  {
    route: "/compras/ajustes/nuevo",
    component: <NewAdjustment />,
  },
  {
    route: "/compras/ajustes/:id",
    component: <AdjustmentDetail />,
  },
  {
    route: "/compras/recepciones/nueva/:id",
    component: <NewReceipt />,
  },

  /* Stock */
  {
    route: "/productos/stock/lista",
    component: <StockPage />,
  },
  {
    route: "/productos/stock/detalle/:id",
    component: <StockDetail />,
  },
  {
    route: "/productos/stock/movimientos",
    component: <StockMovements />,
  },

  /* Manufactura */
  {
    route: "/manufactura/ordenes",
    component: <Manufacturing />,
  },
  {
    route: "/manufactura/nueva",
    component: <NewProduction />,
  },
  {
    route: "/manufactura/detalle/:id",
    component: <ManufacturingDetail />,
  },
  {
    route: "/manufactura/recetas",
    component: <Recipes />,
  },
  {
    route: "/manufactura/reportes",
    component: <ManufacturingReports />,
  },
];
export const routes_full = [
  //dashboard
  {
    route: "/dashboard/totales",
    component: <Dashboard1 />,
  },
  {
    route: "/dashboard/reparto",
    component: <Dashboard2 />,
  },
  {
    route: "/dashboard/cajones_de_pollo",
    component: <Dashboard3 />,
  },
  /* usuario  */
  {
    route: "/usuarios/lista",
    component: <ListUsers />,
  },
  {
    route: "/usuarios/nuevo",
    component: <CreateNewUser />,
  },
  {
    route: "/usuarios/editar/:id",
    component: <EditUser />,
  },
  {
    route: "/usuarios/editar/password/:id",
    component: <EditPasswordUser />,
  },

  /* Productos */

  {
    route: "/productos",
    component: <Products />,
  },
  {
    route: "/productos/nuevo",
    component: <CreateProduct />,
  },
  {
    // este edita producto, oferta y stock
    route: "/productos/detalle/:id",
    component: <ProductDetail />,
  },

  {
    route: "/productos/categoria/nueva",
    component: <NewCategory />,
  },
  {
    route: "/productos/categoria/editar/:id",
    component: <EditCategory />,
  },

  /* Proveedores */

  {
    route: "/productos/proveedores/lista",
    component: <ListSuppliers />,
  },
  {
    route: "/productos/proveedores/nuevo",
    component: <CreateNewSupplier />,
  },
  {
    route: "/productos/proveedores/editar/:id",
    component: <EditSupplier />,
  },

  /* Clientes */

  {
    route: "/clientes/lista",
    component: <ListClients />,
  },
  {
    route: "/clientes/nuevo",
    component: <CreateSimpleClient />,
  },

  {
    route: "/clientes/editar/:id",
    component: <EditClient />,
  },
  {
    route: "/clientes/detalle/:id",
    component: <DetailsClients />,
  },
  {
    route: "/clientes/detalle/producto/:id",
    component: <DetailClientProduct />,
  },
  /* Direcciones clientes */
  {
    route: "/clientes/direcciones/lista",
    component: <ListClientAddress />,
  },
  {
    route: "/clientes/direcciones/nuevo",
    component: <CreateNewClientAddress />,
  },
  {
    route: "/clientes/direcciones/editar/:id",
    component: <EditClientAddress />,
  },

  /* Ordenes */
  {
    route: "/ordenes/lista",
    component: <ListOrders />,
  },

  {
    route: "/ordenes/detalle/:id",
    component: <OrderDetails />,
  },
  {
    route: "/ordenes/nueva",
    component: <OrderCreate />,
  },
  {
    route: "/ordenes/nueva-local",
    component: <OrderLocalCreate />,
  },
  {
    route: "/ordenes/editar/:id",
    component: <OrderEdit />,
  },
  /* Distribuidoras */
  {
    route: "/distribucion/distribuidoras/lista",
    component: <ListDistributors />,
  },
  {
    route: "/distribucion/distribuidoras/nueva",
    component: <CreateNewDistributor />,
  },
  {
    route: "/distribucion/distribuidoras/editar/:id",
    component: <EditDistributor />,
  },
  /* Repartidores */
  {
    route: "/distribucion/repartidores/lista",
    component: <ListDeliveryTruck />,
  },
  {
    route: "/distribucion/repartidores/nuevo",
    component: <CreateDeliveryTruck />,
  },
  {
    route: "/distribucion/repartidores/editar/:id",
    component: <EditDeliveryTruck />,
  },
  {
    route: "/distribucion/repartidores/detalle/:id",
    component: <DetailsDeliveryTruck />,
  },
  /* Zonas reparto */
  {
    route: "/distribucion/zonas/lista",
    component: <ListDeliveryZone />,
  },
  {
    route: "/distribucion/zonas/nueva",
    component: <CreateNewDeliveryZone />,
  },
  {
    route: "/distribucion/zonas/editar/:id",
    component: <EditDeliveryZone />,
  },
  /* Sub Zonas reparto */
  {
    route: "/distribucion/sub-zonas/lista",
    component: <ListDeliverySubZone />,
  },
  {
    route: "/distribucion/sub-zonas/nueva",
    component: <CreateNewSubDeliveryZone />,
  },
  {
    route: "/distribucion/sub-zonas/editar/:id",
    component: <EditDeliverySubZone />,
  },
  /* Reportes */
  /* {
    route: "/reportes/productos-vendidos-por-dia",
    component: (
     
        <ProductsSellByDay />
     
    ),
  }, */
  {
    route: "/reportes/productos-vendidos-por-rango",
    component: <ProductsSellByRange />,
  },
  // Expenses
  {
    route: "/gastos/nuevo",
    component: <CreateNewExpenses />,
  },
  {
    route: "/gastos/lista",
    component: <ListExpenses />,
  },
  {
    route: "/gastos/editar/:id",
    component: <EditExpenses />,
  },

  //sales

  {
    route: "/ventas",
    component: <Sales />,
  },
  {
    route: "/ventas/:id",
    component: <SalesDetail />,
  },

  //Operaciones
  {
    route: "/compras",
    component: <BuyPage />,
  },
  {
    route: "/compras/ordenes/nueva",
    component: <NewOrder />,
  },
  {
    route: "/compras/nueva",
    component: <NewPurchase />,
  },
  {
    route: "/compras/pagos/nuevo",
    component: <NewPayment />,
  },
  {
    route: "/compras/ordenes/editar/:id",
    component: <EditOrder />,
  },
  {
    route: "/compras/detalle1/:id",
    component: <PurchaseDetails />,
  },
  {
    route: "/compras/pagos/:id",
    component: <PaymentDetails />,
  },
  {
    route: "/compras/pagos/registrar-pago/:id",
    component: <PaymentByBuyId />,
  },
  {
    route: "/compras/ordenes/:id",
    component: <OrderBuyDetails />,
  },
  {
    route: "/compras/ajustes/nuevo",
    component: <NewAdjustment />,
  },
  {
    route: "/compras/ajustes/:id",
    component: <AdjustmentDetail />,
  },

  /* Manufactura */
  {
    route: "/manufactura/ordenes",
    component: <Manufacturing />,
  },
  {
    route: "/manufactura/nueva",
    component: <NewProduction />,
  },
  {
    route: "/manufactura/detalle/:id",
    component: <ManufacturingDetail />,
  },
  {
    route: "/manufactura/recetas",
    component: <Recipes />,
  },
  {
    route: "/manufactura/reportes",
    component: <ManufacturingReports />,
  },
];
export const routes_lite = [
  //dashboard
  {
    route: "/dashboard/totales",
    component: <Dashboard1 />,
  },

  /* usuario  */
  {
    route: "/usuarios/lista",
    component: <ListUsers />,
  },
  {
    route: "/usuarios/nuevo",
    component: <CreateNewUser />,
  },
  {
    route: "/usuarios/editar/:id",
    component: <EditUser />,
  },
  {
    route: "/usuarios/editar/password/:id",
    component: <EditPasswordUser />,
  },

  /* Productos */

  {
    route: "/productos",
    component: <Products />,
  },
  {
    route: "/productos/nuevo",
    component: <CreateProduct />,
  },
  {
    // este edita producto, oferta y stock
    route: "/productos/detalle/:id",
    component: <ProductDetail />,
  },

  {
    route: "/productos/categoria/nueva",
    component: <NewCategory />,
  },
  {
    route: "/productos/categoria/editar/:id",
    component: <EditCategory />,
  },

  /* Proveedores */

  {
    route: "/productos/proveedores/lista",
    component: <ListSuppliers />,
  },
  {
    route: "/productos/proveedores/nuevo",
    component: <CreateNewSupplier />,
  },
  {
    route: "/productos/proveedores/editar/:id",
    component: <EditSupplier />,
  },

  /* Clientes */

  {
    route: "/clientes/lista",
    component: <ListClients />,
  },
  {
    route: "/clientes/nuevo",
    component: <CreateSimpleClient />,
  },

  {
    route: "/clientes/editar/:id",
    component: <EditClient />,
  },
  {
    route: "/clientes/detalle/:id",
    component: <DetailsClients />,
  },
  {
    route: "/clientes/detalle/producto/:id",
    component: <DetailClientProduct />,
  },
  /* Direcciones clientes */
  {
    route: "/clientes/direcciones/lista",
    component: <ListClientAddress />,
  },
  {
    route: "/clientes/direcciones/nuevo",
    component: <CreateNewClientAddress />,
  },
  {
    route: "/clientes/direcciones/editar/:id",
    component: <EditClientAddress />,
  },

  {
    route: "/distribucion/zonas/nueva",
    component: <CreateNewDeliveryZone />,
  },
  {
    route: "/distribucion/zonas/editar/:id",
    component: <EditDeliveryZone />,
  },

  /* Ordenes */
  {
    route: "/ordenes/lista",
    component: <ListOrders />,
  },

  {
    route: "/ordenes/detalle/:id",
    component: <OrderDetails />,
  },
  {
    route: "/ordenes/nueva",
    component: <OrderCreate />,
  },
  {
    route: "/ordenes/nueva-local",
    component: <OrderLocalCreate />,
  },
  {
    route: "/ordenes/editar/:id",
    component: <OrderEdit />,
  },

  /* Reportes */

  {
    route: "/reportes/productos-vendidos-por-rango",
    component: <ProductsSellByRange />,
  },
  // Expenses
  {
    route: "/gastos/nuevo",
    component: <CreateNewExpenses />,
  },
  {
    route: "/gastos/lista",
    component: <ListExpenses />,
  },
  {
    route: "/gastos/editar/:id",
    component: <EditExpenses />,
  },

  /* Manufactura */
  {
    route: "/manufactura/ordenes",
    component: <Manufacturing />,
  },
  {
    route: "/manufactura/nueva",
    component: <NewProduction />,
  },
  {
    route: "/manufactura/detalle/:id",
    component: <ManufacturingDetail />,
  },
  {
    route: "/manufactura/recetas",
    component: <Recipes />,
  },
  {
    route: "/manufactura/reportes",
    component: <ManufacturingReports />,
  },
];
