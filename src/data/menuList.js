export const menuList_dr = [
  {
    name: "Dashboard",
    icon: "loyalty",
    key: "dashboard",
    subRoutes: [
      {
        name: "Totales",
        icon: "signal_cellular_alt_icon",
        url: "/dashboard/totales",
      },
      {
        name: "Reparto",
        icon: "signal_cellular_alt_icon",
        url: "/dashboard/reparto",
      },
      {
        name: "Cajones de pollo",
        icon: "signal_cellular_alt_icon",
        url: "/dashboard/cajones_de_pollo",
      },
    ],
  },
  {
    name: "Usuarios",
    icon: "person",
    key: "usuarios",
    subRoutes: [
      {
        name: "Lista usuarios",
        icon: "format_list_bulleted_icon",
        url: "/usuarios/lista",
      },
    ],
  },
  {
    name: "Productos",
    icon: "shoppingCartIcon",
    key: "productos",
    subRoutes: [
      {
        name: "Productos",
        icon: "format_list_bulleted_icon",
        url: "/productos",
      },
      {
        name: "Proveedores",
        icon: "factory",
        url: "/productos/proveedores/lista",
      },
      {
        name: "Stock",
        icon: "list_alt",
        url: "/productos/stock/lista",
      },
    ],
  },
  {
    name: "Clientes",
    icon: "perm_contact_calendar_icon",
    key: "clientes",
    subRoutes: [
      {
        name: "Nuevo cliente",
        icon: "person_add_alt1_icon",
        url: "/clientes/nuevo",
      },
      {
        name: "Lista clientes",
        icon: "format_list_bulleted_icon",
        url: "/clientes/lista",
      },
      {
        name: "Direcciones",
        icon: "holiday_village_icon",
        url: "/clientes/direcciones/lista",
      },
    ],
  },

  {
    name: "Compras",
    icon: "add_business_icon",
    key: "compras",
    subRoutes: [
      {
        name: "Nueva compra",
        icon: "add_circle_outline_icon",
        url: "/compras/nueva",
      },
      {
        name: "Lista compras",
        icon: "format_list_bulleted_icon",
        url: "/compras/lista",
      },
    ],
  },
  {
    name: "Ventas",
    icon: "add_shopping_cart_icon",
    key: "ventas",
    subRoutes: [
      {
        name: "Nueva venta local",
        icon: "add_circle_outline_icon",
        url: "/ordenes/nueva-local",
      },
      {
        name: "Nueva venta reparto",
        icon: "add_circle_outline_icon",
        url: "/ordenes/nueva",
      },
      {
        name: "Lista ventas",
        icon: "format_list_bulleted_icon",
        url: "/ordenes/lista",
      },
      {
        name: "Resumen caja",
        icon: "format_list_bulleted_icon",
        url: "/ventas",
      },
    ],
  },
  {
    name: "Gastos",
    icon: "assignment_returned_icon",
    key: "gastos",
    subRoutes: [
      {
        name: "Nuevo gasto",
        icon: "add_circle_outline_icon",
        url: "/gastos/nuevo",
      },

      {
        name: "Lista gastos",
        icon: "format_list_bulleted_icon",
        url: "/gastos/lista",
      },
    ],
  },
  {
    name: "Distribución",
    icon: "local_shipping_icon",
    key: "distribucion",
    subRoutes: [
      /* {
        name: "Distribuidoras",
        icon: "store_icon",
        url: "/distribucion/distribuidoras/lista",
      }, */
      {
        name: "Repartidores",
        icon: "local_shipping_icon",
        url: "/distribucion/repartidores/lista",
      },
      {
        name: "Zonas reparto",
        icon: "home_work_icon",
        url: "/distribucion/zonas/lista",
      },
      {
        name: "SubZonas reparto",
        icon: "home_work_icon",
        url: "/distribucion/sub-zonas/lista",
      },
    ],
  },
  {
    name: "Reportes",
    icon: "assessment_icon",
    key: "reportes",
    subRoutes: [
      {
        name: "Rango de ventas",
        icon: "format_list_bulleted_icon",
        url: "/reportes/productos-vendidos-por-rango",
      },
    ],
  },
];
export const menuList_full = [
  {
    name: "Dashboard",
    icon: "loyalty",
    key: "dashboard",
    subRoutes: [
      {
        name: "Totales",
        icon: "signal_cellular_alt_icon",
        url: "/dashboard/totales",
      },
      {
        name: "Reparto",
        icon: "signal_cellular_alt_icon",
        url: "/dashboard/reparto",
      },
    ],
  },
  {
    name: "Usuarios",
    icon: "person",
    key: "usuarios",
    subRoutes: [
      {
        name: "Lista usuarios",
        icon: "format_list_bulleted_icon",
        url: "/usuarios/lista",
      },
    ],
  },
  {
    name: "Productos",
    icon: "shoppingCartIcon",
    key: "productos",
    subRoutes: [
      {
        name: "Productos",
        icon: "format_list_bulleted_icon",
        url: "/productos",
      },
      {
        name: "Proveedores",
        icon: "factory",
        url: "/productos/proveedores/lista",
      },
      {
        name: "Stock",
        icon: "list_alt",
        url: "/productos/stock/lista",
      },
    ],
  },
  {
    name: "Clientes",
    icon: "perm_contact_calendar_icon",
    key: "clientes",
    subRoutes: [
      {
        name: "Nuevo cliente",
        icon: "person_add_alt1_icon",
        url: "/clientes/nuevo",
      },
      {
        name: "Lista clientes",
        icon: "format_list_bulleted_icon",
        url: "/clientes/lista",
      },
      {
        name: "Direcciones",
        icon: "holiday_village_icon",
        url: "/clientes/direcciones/lista",
      },
    ],
  },

  {
    name: "Compras",
    icon: "add_business_icon",
    key: "compras",
    subRoutes: [
      {
        name: "Nueva compra",
        icon: "add_circle_outline_icon",
        url: "/compras/nueva",
      },
      {
        name: "Lista compras",
        icon: "format_list_bulleted_icon",
        url: "/compras/lista",
      },
    ],
  },
  {
    name: "Ventas",
    icon: "add_shopping_cart_icon",
    key: "ventas",
    subRoutes: [
      {
        name: "Nueva venta local",
        icon: "add_circle_outline_icon",
        url: "/ordenes/nueva-local",
      },
      {
        name: "Nueva venta reparto",
        icon: "add_circle_outline_icon",
        url: "/ordenes/nueva",
      },
      {
        name: "Lista ventas",
        icon: "format_list_bulleted_icon",
        url: "/ordenes/lista",
      },
      {
        name: "Resumen caja",
        icon: "format_list_bulleted_icon",
        url: "/ventas",
      },
    ],
  },
  {
    name: "Gastos",
    icon: "assignment_returned_icon",
    key: "gastos",
    subRoutes: [
      {
        name: "Nuevo gasto",
        icon: "add_circle_outline_icon",
        url: "/gastos/nuevo",
      },

      {
        name: "Lista gastos",
        icon: "format_list_bulleted_icon",
        url: "/gastos/lista",
      },
    ],
  },
  {
    name: "Distribución",
    icon: "local_shipping_icon",
    key: "distribucion",
    subRoutes: [
      /* {
        name: "Distribuidoras",
        icon: "store_icon",
        url: "/distribucion/distribuidoras/lista",
      }, */
      {
        name: "Repartidores",
        icon: "local_shipping_icon",
        url: "/distribucion/repartidores/lista",
      },
      {
        name: "Zonas reparto",
        icon: "home_work_icon",
        url: "/distribucion/zonas/lista",
      },
      {
        name: "SubZonas reparto",
        icon: "home_work_icon",
        url: "/distribucion/sub-zonas/lista",
      },
    ],
  },
  {
    name: "Reportes",
    icon: "assessment_icon",
    key: "reportes",
    subRoutes: [
      {
        name: "Rango de ventas",
        icon: "format_list_bulleted_icon",
        url: "/reportes/productos-vendidos-por-rango",
      },
    ],
  },
];
export const menuList_lite = [
  {
    name: "Dashboard",
    icon: "loyalty",
    key: "dashboard",
    subRoutes: [
      {
        name: "Totales",
        icon: "signal_cellular_alt_icon",
        url: "/dashboard/totales",
      },
    ],
  },
  {
    name: "Usuarios",
    icon: "person",
    key: "usuarios",
    subRoutes: [
      {
        name: "Lista usuarios",
        icon: "format_list_bulleted_icon",
        url: "/usuarios/lista",
      },
    ],
  },
  {
    name: "Productos",
    icon: "shoppingCartIcon",
    key: "productos",
    subRoutes: [
      {
        name: "Productos",
        icon: "format_list_bulleted_icon",
        url: "/productos",
      },
      {
        name: "Proveedores",
        icon: "factory",
        url: "/productos/proveedores/lista",
      },
      {
        name: "Stock",
        icon: "list_alt",
        url: "/productos/stock/lista",
      },
    ],
  },
  {
    name: "Clientes",
    icon: "perm_contact_calendar_icon",
    key: "clientes",
    subRoutes: [
      {
        name: "Nuevo cliente",
        icon: "person_add_alt1_icon",
        url: "/clientes/nuevo",
      },
      {
        name: "Lista clientes",
        icon: "format_list_bulleted_icon",
        url: "/clientes/lista",
      },
      {
        name: "Direcciones",
        icon: "holiday_village_icon",
        url: "/clientes/direcciones/lista",
      },
    ],
  },
  {
    name: "Compras",
    icon: "add_business_icon",
    key: "compras",
    subRoutes: [
      {
        name: "Nueva compra",
        icon: "add_circle_outline_icon",
        url: "/compras/nueva",
      },
      {
        name: "Lista compras",
        icon: "format_list_bulleted_icon",
        url: "/compras/lista",
      },
    ],
  },
  {
    name: "Ventas",
    icon: "add_shopping_cart_icon",
    key: "ventas",
    subRoutes: [
      {
        name: "Crear orden local",
        icon: "add_circle_outline_icon",
        url: "/ordenes/nueva-local",
      },

      {
        name: "Lista ordenes",
        icon: "format_list_bulleted_icon",
        url: "/ordenes/lista",
      },
    ],
  },
  {
    name: "Gastos",
    icon: "assignment_returned_icon",
    key: "gastos",
    subRoutes: [
      {
        name: "Nuevo gasto",
        icon: "add_circle_outline_icon",
        url: "/gastos/nuevo",
      },

      {
        name: "Lista gastos",
        icon: "format_list_bulleted_icon",
        url: "/gastos/lista",
      },
    ],
  },

  {
    name: "Reportes",
    icon: "assessment_icon",
    key: "reportes",
    subRoutes: [
      {
        name: "Rango de ventas",
        icon: "format_list_bulleted_icon",
        url: "/reportes/productos-vendidos-por-rango",
      },
    ],
  },
];
