export const menuList_dr = [
  {
    name: "Dashboard",
    icon: "dashboard", // Icono clásico de tablero
    key: "dashboard",
    subRoutes: [
      {
        name: "Totales",
        icon: "analytics", // Para análisis de datos generales
        url: "/dashboard/totales",
      },
      {
        name: "Reparto",
        icon: "query_stats", // Estadísticas de movimiento
        url: "/dashboard/reparto",
      },
      {
        name: "Cajones de pollo",
        icon: "leaderboard", // Para visualización de métricas/cantidades
        url: "/dashboard/cajones_de_pollo",
      },
    ],
  },
  {
    name: "Usuarios",
    icon: "people", // Plural para gestión de grupos
    key: "usuarios",
    subRoutes: [
      {
        name: "Lista usuarios",
        icon: "manage_accounts", // Configuración de perfiles
        url: "/usuarios/lista",
      },
    ],
  },
  {
    name: "Productos",
    icon: "inventory_2", // Representa una caja/producto físico
    key: "productos",
    subRoutes: [
      {
        name: "Productos",
        icon: "category", // Categorización de ítems
        url: "/productos",
      },
      {
        name: "Proveedores",
        icon: "storefront", // Representa el local del proveedor
        url: "/productos/proveedores/lista",
      },
      {
        name: "Stock",
        icon: "warehouse", // Almacenamiento/Existencias
        url: "/productos/stock/lista",
      },
      {
        name: "Stock Movimientos",
        icon: "warehouse", // Almacenamiento/Existencias
        url: "/productos/stock/movimientos",
      },
    ],
  },
  {
    name: "Clientes",
    icon: "groups", // Grupo de personas
    key: "clientes",
    subRoutes: [
      {
        name: "Nuevo cliente",
        icon: "person_add",
        url: "/clientes/nuevo",
      },
      {
        name: "Lista clientes",
        icon: "contact_page", // Fichas de contactos
        url: "/clientes/lista",
      },
      {
        name: "Direcciones",
        icon: "place", // Ubicación/Puntero de mapa
        url: "/clientes/direcciones/lista",
      },
    ],
  },
  {
    name: "Negocios",
    icon: "business", // Edificio corporativo
    key: "negocios",
    subRoutes: [
      {
        name: "Nuevo negocio",
        icon: "add_business",
        url: "/negocios/nuevo",
      },
      {
        name: "Lista negocios",
        icon: "domain", // Estructura de dominios/negocios
        url: "/negocios/lista",
      },
    ],
  },
  {
    name: "Compras",
    icon: "shopping_bag", // Bolsa de compra (proveedor)
    key: "compras",
    subRoutes: [
      {
        name: "Compras",
        icon: "date_range", // Filtro por fechas
        url: "/compras",
      },
    ],
  },
  {
    name: "Ventas",
    icon: "sell", // Etiqueta de venta
    key: "ventas",
    subRoutes: [
      {
        name: "Nueva venta local",
        icon: "point_of_sale", // TPV / Caja rápida
        url: "/ordenes/nueva-local",
      },
      {
        name: "Nueva venta reparto",
        icon: "local_mall", // Venta para llevar/enviar
        url: "/ordenes/nueva",
      },
      {
        name: "Lista ventas",
        icon: "list_alt",
        url: "/ordenes/lista",
      },
      {
        name: "Resumen caja",
        icon: "account_balance_wallet", // Dinero/Caja diaria
        url: "/ventas",
      },
    ],
  },
  {
    name: "Manufactura",
    icon: "precision_manufacturing",
    key: "manufactura",
    subRoutes: [
      {
        name: "Órdenes de Producción",
        icon: "assignment",
        url: "/manufactura/ordenes",
      },
      {
        name: "Nueva Producción",
        icon: "play_circle",
        url: "/manufactura/nueva",
      },
      {
        name: "Recetas (BOM)",
        icon: "menu_book",
        url: "/manufactura/recetas",
      },
      {
        name: "Simulación",
        icon: "calculate",
        url: "/manufactura/simulacion",
      },
      {
        name: "Reportes",
        icon: "analytics",
        url: "/manufactura/reportes",
      },
    ],
  },
  {
    name: "Gastos",
    icon: "payments", // Salida de billetes
    key: "gastos",
    subRoutes: [
      {
        name: "Nuevo gasto",
        icon: "money_off", // Representa pérdida o gasto de dinero
        url: "/gastos/nuevo",
      },
      {
        name: "Lista gastos",
        icon: "history_edu", // Registro de gastos
        url: "/gastos/lista",
      },
    ],
  },
  {
    name: "Distribución",
    icon: "local_shipping", // Camión de reparto
    key: "distribucion",
    subRoutes: [
      {
        name: "Repartidores",
        icon: "badge", // Identificación de empleados
        url: "/distribucion/repartidores/lista",
      },
      {
        name: "Zonas reparto",
        icon: "map", // Mapa general de zonas
        url: "/distribucion/zonas/lista",
      },
      {
        name: "SubZonas reparto",
        icon: "edit_location_alt", // Localizaciones específicas
        url: "/distribucion/sub-zonas/lista",
      },
    ],
  },
  {
    name: "Reportes",
    icon: "assessment", // Reporte de evaluación
    key: "reportes",
    subRoutes: [
      {
        name: "Rango de ventas",
        icon: "date_range", // Filtro por fechas
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
    name: "Manufactura",
    icon: "precision_manufacturing",
    key: "manufactura",
    subRoutes: [
      {
        name: "Órdenes de Producción",
        icon: "assignment",
        url: "/manufactura/ordenes",
      },
      {
        name: "Nueva Producción",
        icon: "play_circle",
        url: "/manufactura/nueva",
      },
      {
        name: "Recetas (BOM)",
        icon: "menu_book",
        url: "/manufactura/recetas",
      },
      {
        name: "Simulación",
        icon: "calculate",
        url: "/manufactura/simulacion",
      },
      {
        name: "Reportes",
        icon: "analytics",
        url: "/manufactura/reportes",
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
    name: "Manufactura",
    icon: "precision_manufacturing",
    key: "manufactura",
    subRoutes: [
      {
        name: "Órdenes de Producción",
        icon: "assignment",
        url: "/manufactura/ordenes",
      },
      {
        name: "Nueva Producción",
        icon: "play_circle",
        url: "/manufactura/nueva",
      },
      {
        name: "Recetas (BOM)",
        icon: "menu_book",
        url: "/manufactura/recetas",
      },
      {
        name: "Simulación",
        icon: "calculate",
        url: "/manufactura/simulacion",
      },
      {
        name: "Reportes",
        icon: "analytics",
        url: "/manufactura/reportes",
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
