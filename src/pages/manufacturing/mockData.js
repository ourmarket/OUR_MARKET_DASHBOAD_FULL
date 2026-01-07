// Mock data for the Manufacturing module

// Suppliers
export const suppliers = [
  {
    id: "sup-001",
    name: "TechParts Inc.",
    email: "ventas@techparts.com",
    phone: "+54 11 4567-8900",
    address: "Av. Corrientes 1234, CABA",
  },
  {
    id: "sup-002",
    name: "Office Solutions SA",
    email: "contacto@officesolutions.com.ar",
    phone: "+54 11 5678-1234",
    address: "Av. Santa Fe 5678, CABA",
  },
  {
    id: "sup-003",
    name: "Industrial Materials Corp",
    email: "pedidos@industrialmaterials.com",
    phone: "+54 11 6789-2345",
    address: "Parque Industrial Norte, Lote 45",
  },
  {
    id: "sup-004",
    name: "Global Supplies Ltd",
    email: "orders@globalsupplies.com",
    phone: "+54 11 7890-3456",
    address: "Zona Franca Sur, Edificio C",
  },
];

// Purchase Orders
export const purchaseOrders = [
  {
    id: "po-001",
    poNumber: "OC-2024-001",
    supplier: suppliers[0],
    expectedDate: "2024-02-15",
    status: "approved",
    items: [
      {
        id: "item-1",
        description: "Laptop Dell XPS 15",
        quantity: 5,
        unitPrice: 1500000,
        total: 7500000,
      },
      {
        id: "item-2",
        description: 'Monitor LG 27"',
        quantity: 5,
        unitPrice: 350000,
        total: 1750000,
      },
    ],
    estimatedAmount: 9250000,
    createdAt: "2024-01-20T10:30:00",
    updatedAt: "2024-01-25T14:00:00",
    notes: "Equipamiento para nuevo equipo de desarrollo",
    statusHistory: [
      { status: "draft", date: "2024-01-20T10:30:00", user: "María García" },
      {
        status: "submitted",
        date: "2024-01-21T09:00:00",
        user: "María García",
      },
      {
        status: "approved",
        date: "2024-01-25T14:00:00",
        user: "Carlos Mendez",
      },
    ],
  },
  {
    id: "po-002",
    poNumber: "OC-2024-002",
    supplier: suppliers[1],
    expectedDate: "2024-02-10",
    status: "submitted",
    items: [
      {
        id: "item-3",
        description: "Resma de papel A4 (x100)",
        quantity: 50,
        unitPrice: 8500,
        total: 425000,
      },
      {
        id: "item-4",
        description: "Toner HP 26A",
        quantity: 20,
        unitPrice: 45000,
        total: 900000,
      },
      {
        id: "item-5",
        description: "Carpetas A4 (x100)",
        quantity: 10,
        unitPrice: 15000,
        total: 150000,
      },
    ],
    estimatedAmount: 1475000,
    createdAt: "2024-01-28T11:00:00",
    updatedAt: "2024-01-28T11:00:00",
    statusHistory: [
      { status: "draft", date: "2024-01-28T11:00:00", user: "Ana López" },
      { status: "submitted", date: "2024-01-28T15:30:00", user: "Ana López" },
    ],
  },
  {
    id: "po-003",
    poNumber: "OC-2024-003",
    supplier: suppliers[2],
    expectedDate: "2024-03-01",
    status: "draft",
    items: [
      {
        id: "item-6",
        description: "Acero inoxidable 304 (kg)",
        quantity: 500,
        unitPrice: 12000,
        total: 6000000,
      },
      {
        id: "item-7",
        description: "Soldadura MIG (rollo)",
        quantity: 20,
        unitPrice: 85000,
        total: 1700000,
      },
    ],
    estimatedAmount: 7700000,
    createdAt: "2024-01-30T09:00:00",
    updatedAt: "2024-01-30T09:00:00",
    statusHistory: [
      { status: "draft", date: "2024-01-30T09:00:00", user: "Pedro Sánchez" },
    ],
  },
  {
    id: "po-004",
    poNumber: "OC-2024-004",
    supplier: suppliers[3],
    expectedDate: "2024-02-20",
    status: "rejected",
    items: [
      {
        id: "item-8",
        description: "Servidor Dell PowerEdge",
        quantity: 2,
        unitPrice: 5500000,
        total: 11000000,
      },
    ],
    estimatedAmount: 11000000,
    createdAt: "2024-01-15T14:00:00",
    updatedAt: "2024-01-18T10:00:00",
    notes: "Rechazado: Presupuesto excede límite aprobado Q1",
    statusHistory: [
      { status: "draft", date: "2024-01-15T14:00:00", user: "María García" },
      {
        status: "submitted",
        date: "2024-01-16T09:00:00",
        user: "María García",
      },
      {
        status: "rejected",
        date: "2024-01-18T10:00:00",
        user: "Director Financiero",
      },
    ],
  },
];

// Purchases (Compras realizadas)
export const purchases = [
  {
    id: "buy-001",
    purchaseNumber: "COMP-2024-001",
    supplier: suppliers[0],
    date: "2024-01-10",
    paymentStatus: "partial",
    items: [
      {
        id: "p-item-1",
        description: "Laptop Dell XPS 13",
        quantity: 3,
        unitCost: 1450000,
        total: 4350000,
      },
      {
        id: "p-item-2",
        description: "Docking Station",
        quantity: 3,
        unitCost: 180000,
        total: 540000,
      },
    ],
    totalAmount: 4890000,
    paidAmount: 2500000,
    balanceDue: 2390000,
    createdAt: "2024-01-10T16:00:00",
  },
  {
    id: "buy-002",
    purchaseNumber: "COMP-2024-002",
    supplier: suppliers[1],
    date: "2024-01-15",
    paymentStatus: "paid",
    items: [
      {
        id: "p-item-3",
        description: "Sillas ergonómicas",
        quantity: 10,
        unitCost: 125000,
        total: 1250000,
      },
      {
        id: "p-item-4",
        description: "Escritorios ajustables",
        quantity: 5,
        unitCost: 280000,
        total: 1400000,
      },
    ],
    totalAmount: 2650000,
    paidAmount: 2650000,
    balanceDue: 0,
    createdAt: "2024-01-15T11:30:00",
  },
  {
    id: "buy-003",
    purchaseNumber: "COMP-2024-003",
    supplier: suppliers[2],
    date: "2024-01-22",
    paymentStatus: "pending",
    items: [
      {
        id: "p-item-5",
        description: "Materiales de construcción",
        quantity: 1,
        unitCost: 3500000,
        total: 3500000,
      },
    ],
    totalAmount: 3500000,
    paidAmount: 0,
    balanceDue: 3500000,
    createdAt: "2024-01-22T14:00:00",
  },
  {
    id: "buy-004",
    purchaseNumber: "COMP-2024-004",
    supplier: suppliers[0],
    date: "2024-01-25",
    paymentStatus: "paid",
    items: [
      {
        id: "p-item-6",
        description: "Mouse inalámbrico Logitech",
        quantity: 20,
        unitCost: 35000,
        total: 700000,
      },
      {
        id: "p-item-7",
        description: "Teclado mecánico",
        quantity: 20,
        unitCost: 65000,
        total: 1300000,
      },
    ],
    totalAmount: 2000000,
    paidAmount: 2000000,
    balanceDue: 0,
    createdAt: "2024-01-25T10:00:00",
  },
];

// Payments
export const payments = [
  {
    id: "pay-001",
    paymentNumber: "PAG-2024-001",
    supplier: suppliers[0],
    date: "2024-01-12",
    paymentMethod: "transfer",
    amount: 2500000,
    purchaseIds: ["buy-001"],
    reference: "TRF-001-2024",
    createdAt: "2024-01-12T15:00:00",
  },
  {
    id: "pay-002",
    paymentNumber: "PAG-2024-002",
    supplier: suppliers[1],
    date: "2024-01-17",
    paymentMethod: "transfer",
    amount: 2650000,
    purchaseIds: ["buy-002"],
    reference: "TRF-002-2024",
    createdAt: "2024-01-17T11:00:00",
  },
  {
    id: "pay-003",
    paymentNumber: "PAG-2024-003",
    supplier: suppliers[0],
    date: "2024-01-26",
    paymentMethod: "check",
    amount: 2000000,
    purchaseIds: ["buy-004"],
    reference: "CHQ-45678",
    createdAt: "2024-01-26T09:30:00",
  },
];

// Goods Receipts (Recepciones de Mercadería)
export const goodsReceipts = [
  {
    id: "rcpt-001",
    receiptNumber: "REC-2024-001",
    purchaseId: "buy-001",
    date: "2024-01-11",
    items: [
      {
        itemId: "p-item-1",
        description: "Laptop Dell XPS 13",
        quantityOrdered: 3,
        quantityReceived: 3,
      },
      {
        itemId: "p-item-2",
        description: "Docking Station",
        quantityOrdered: 3,
        quantityReceived: 2,
        observations: "Faltante: 1 unidad por recibir",
      },
    ],
    observations: "Entrega parcial, falta 1 Docking Station",
    createdAt: "2024-01-11T10:00:00",
    createdBy: "Juan Pérez",
  },
  {
    id: "rcpt-002",
    receiptNumber: "REC-2024-002",
    purchaseId: "buy-002",
    date: "2024-01-16",
    items: [
      {
        itemId: "p-item-3",
        description: "Sillas ergonómicas",
        quantityOrdered: 10,
        quantityReceived: 10,
      },
      {
        itemId: "p-item-4",
        description: "Escritorios ajustables",
        quantityOrdered: 5,
        quantityReceived: 5,
      },
    ],
    createdAt: "2024-01-16T14:30:00",
    createdBy: "María García",
  },
  {
    id: "rcpt-003",
    receiptNumber: "REC-2024-003",
    purchaseId: "buy-004",
    date: "2024-01-25",
    items: [
      {
        itemId: "p-item-6",
        description: "Mouse inalámbrico Logitech",
        quantityOrdered: 20,
        quantityReceived: 20,
      },
      {
        itemId: "p-item-7",
        description: "Teclado mecánico",
        quantityOrdered: 20,
        quantityReceived: 18,
        observations: "2 unidades con daño de empaque, reportadas al proveedor",
      },
    ],
    observations: "2 teclados recibidos con daño de empaque",
    createdAt: "2024-01-25T11:00:00",
    createdBy: "Pedro Sánchez",
  },
];

// Adjustments (Ajustes de Compra / Notas de Crédito)
export const adjustments = [
  {
    id: "adj-001",
    adjustmentNumber: "AJ-2024-001",
    purchaseId: "buy-001",
    supplier: suppliers[0],
    type: "shortage",
    date: "2024-01-15",
    items: [
      {
        itemId: "p-item-2",
        description: "Docking Station",
        quantity: 1,
        unitAmount: 180000,
        total: -180000,
      },
    ],
    totalAmount: -180000,
    observations: "Faltante de 1 Docking Station según recepción REC-2024-001",
    receiptId: "rcpt-001",
    createdAt: "2024-01-15T09:00:00",
    createdBy: "María García",
  },
  {
    id: "adj-002",
    adjustmentNumber: "AJ-2024-002",
    purchaseId: "buy-004",
    supplier: suppliers[0],
    type: "damage",
    date: "2024-01-27",
    items: [
      {
        itemId: "p-item-7",
        description: "Teclado mecánico",
        quantity: 2,
        unitAmount: 65000,
        total: -130000,
      },
    ],
    totalAmount: -130000,
    observations:
      "2 teclados con daño de empaque, bonificación acordada con proveedor",
    receiptId: "rcpt-003",
    createdAt: "2024-01-27T10:30:00",
    createdBy: "Pedro Sánchez",
  },
  {
    id: "adj-003",
    adjustmentNumber: "AJ-2024-003",
    purchaseId: "buy-003",
    supplier: suppliers[2],
    type: "price",
    date: "2024-01-24",
    items: [
      {
        itemId: "p-item-5",
        description: "Materiales de construcción",
        quantity: 1,
        unitAmount: 175000,
        total: -175000,
      },
    ],
    totalAmount: -175000,
    observations: "Diferencia de precio acordada post-negociación",
    createdAt: "2024-01-24T14:00:00",
    createdBy: "Carlos Mendez",
  },
];

// Helper to get adjustments for a purchase
export const getAdjustmentsForPurchase = (purchaseId) => {
  return adjustments.filter((a) => a.purchaseId === purchaseId);
};

// Helper to get total adjustment amount for a purchase
export const getTotalAdjustments = (purchaseId) => {
  return adjustments
    .filter((a) => a.purchaseId === purchaseId)
    .reduce((sum, adj) => sum + adj.totalAmount, 0);
};

// Helper to get receipt status for a purchase
export const getReceiptStatus = (purchaseId) => {
  const purchase = purchases.find((p) => p.id === purchaseId);
  if (!purchase) return "none";

  const receipts = goodsReceipts.filter((r) => r.purchaseId === purchaseId);
  if (receipts.length === 0) return "none";

  // Check if all items have been fully received
  const totalOrdered = purchase.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalReceived = receipts.reduce(
    (sum, receipt) =>
      sum +
      receipt.items.reduce(
        (itemSum, item) => itemSum + item.quantityReceived,
        0
      ),
    0
  );

  if (totalReceived >= totalOrdered) return "complete";
  return "partial";
};

// Get receipts for a specific purchase
export const getReceiptsForPurchase = (purchaseId) => {
  return goodsReceipts.filter((r) => r.purchaseId === purchaseId);
};

// Helper functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

export const formatDateTime = (dateString) => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

// Stats calculations
export const getStats = () => {
  const pendingApproval = purchaseOrders.filter(
    (po) => po.status === "submitted"
  ).length;
  const pendingPayment = purchases.filter(
    (p) => p.paymentStatus !== "paid"
  ).length;
  const totalPurchasedMonth = purchases.reduce(
    (sum, p) => sum + p.totalAmount,
    0
  );
  const totalPendingAmount = purchases.reduce(
    (sum, p) => sum + p.balanceDue,
    0
  );

  return {
    pendingApproval,
    pendingPayment,
    totalPurchasedMonth,
    totalPendingAmount,
  };
};

// ===== STOCK MODULE =====

// Products catalog
export const products = [
  {
    id: "prod-001",
    code: "LAP-XPS13",
    name: "Laptop Dell XPS 13",
    category: "Tecnología",
    unit: "unidad",
    minStock: 2,
  },
  {
    id: "prod-002",
    code: "DOCK-STD",
    name: "Docking Station",
    category: "Tecnología",
    unit: "unidad",
    minStock: 3,
  },
  {
    id: "prod-003",
    code: "SIL-ERG",
    name: "Sillas ergonómicas",
    category: "Mobiliario",
    unit: "unidad",
    minStock: 5,
  },
  {
    id: "prod-004",
    code: "ESC-AJU",
    name: "Escritorios ajustables",
    category: "Mobiliario",
    unit: "unidad",
    minStock: 2,
  },
  {
    id: "prod-005",
    code: "MAT-CON",
    name: "Materiales de construcción",
    category: "Materiales",
    unit: "lote",
    minStock: 1,
  },
  {
    id: "prod-006",
    code: "MOU-LOG",
    name: "Mouse inalámbrico Logitech",
    category: "Tecnología",
    unit: "unidad",
    minStock: 10,
  },
  {
    id: "prod-007",
    code: "TEC-MEC",
    name: "Teclado mecánico",
    category: "Tecnología",
    unit: "unidad",
    minStock: 10,
  },
  {
    id: "prod-008",
    code: "MON-LG27",
    name: 'Monitor LG 27"',
    category: "Tecnología",
    unit: "unidad",
    minStock: 3,
  },
  {
    id: "prod-009",
    code: "PAP-A4",
    name: "Resma de papel A4",
    category: "Insumos",
    unit: "resma",
    minStock: 20,
  },
  {
    id: "prod-010",
    code: "TON-HP26",
    name: "Toner HP 26A",
    category: "Insumos",
    unit: "unidad",
    minStock: 5,
  },
];

// Stock movements history
export const stockMovements = [
  {
    id: "mov-001",
    movementNumber: "MOV-2024-001",
    date: "2024-01-11",
    productId: "prod-001",
    product: products[0],
    type: "in",
    reason: "receipt",
    quantity: 3,
    documentType: "receipt",
    documentId: "rcpt-001",
    documentNumber: "REC-2024-001",
    balanceAfter: 3,
    createdBy: "Juan Pérez",
    createdAt: "2024-01-11T10:00:00",
    observations: "Recepción completa de Laptops",
  },
  {
    id: "mov-002",
    movementNumber: "MOV-2024-002",
    date: "2024-01-11",
    productId: "prod-002",
    product: products[1],
    type: "in",
    reason: "receipt",
    quantity: 2,
    documentType: "receipt",
    documentId: "rcpt-001",
    documentNumber: "REC-2024-001",
    balanceAfter: 2,
    createdBy: "Juan Pérez",
    createdAt: "2024-01-11T10:05:00",
    observations: "Recepción parcial, faltante 1 unidad",
  },
  {
    id: "mov-003",
    movementNumber: "MOV-2024-003",
    date: "2024-01-16",
    productId: "prod-003",
    product: products[2],
    type: "in",
    reason: "receipt",
    quantity: 10,
    documentType: "receipt",
    documentId: "rcpt-002",
    documentNumber: "REC-2024-002",
    balanceAfter: 10,
    createdBy: "María García",
    createdAt: "2024-01-16T14:30:00",
  },
  {
    id: "mov-004",
    movementNumber: "MOV-2024-004",
    date: "2024-01-16",
    productId: "prod-004",
    product: products[3],
    type: "in",
    reason: "receipt",
    quantity: 5,
    documentType: "receipt",
    documentId: "rcpt-002",
    documentNumber: "REC-2024-002",
    balanceAfter: 5,
    createdBy: "María García",
    createdAt: "2024-01-16T14:35:00",
  },
  {
    id: "mov-005",
    movementNumber: "MOV-2024-005",
    date: "2024-01-25",
    productId: "prod-006",
    product: products[5],
    type: "in",
    reason: "receipt",
    quantity: 20,
    documentType: "receipt",
    documentId: "rcpt-003",
    documentNumber: "REC-2024-003",
    balanceAfter: 20,
    createdBy: "Pedro Sánchez",
    createdAt: "2024-01-25T11:00:00",
  },
  {
    id: "mov-006",
    movementNumber: "MOV-2024-006",
    date: "2024-01-25",
    productId: "prod-007",
    product: products[6],
    type: "in",
    reason: "receipt",
    quantity: 18,
    documentType: "receipt",
    documentId: "rcpt-003",
    documentNumber: "REC-2024-003",
    balanceAfter: 18,
    createdBy: "Pedro Sánchez",
    createdAt: "2024-01-25T11:05:00",
    observations: "2 unidades con daño, no ingresadas",
  },
  {
    id: "mov-007",
    movementNumber: "MOV-2024-007",
    date: "2024-01-20",
    productId: "prod-003",
    product: products[2],
    type: "out",
    reason: "sale",
    quantity: -3,
    balanceAfter: 7,
    createdBy: "Sistema",
    createdAt: "2024-01-20T09:00:00",
    observations: "Venta a cliente interno",
  },
  {
    id: "mov-008",
    movementNumber: "MOV-2024-008",
    date: "2024-01-22",
    productId: "prod-001",
    product: products[0],
    type: "reserved",
    reason: "sale",
    quantity: -1,
    balanceAfter: 2,
    createdBy: "Sistema",
    createdAt: "2024-01-22T15:00:00",
    observations: "Reserva para proyecto Alpha",
  },
  {
    id: "mov-009",
    movementNumber: "MOV-2024-009",
    date: "2024-01-28",
    productId: "prod-006",
    product: products[5],
    type: "out",
    reason: "sale",
    quantity: -8,
    balanceAfter: 12,
    createdBy: "Sistema",
    createdAt: "2024-01-28T10:00:00",
    observations: "Entrega a nuevo equipo",
  },
  {
    id: "mov-010",
    movementNumber: "MOV-2024-010",
    date: "2024-01-29",
    productId: "prod-007",
    product: products[6],
    type: "out",
    reason: "sale",
    quantity: -10,
    balanceAfter: 8,
    createdBy: "Sistema",
    createdAt: "2024-01-29T14:00:00",
    observations: "Entrega a nuevo equipo",
  },
];

// Current stock (calculated from movements)
export const stockItems = [
  {
    productId: "prod-001",
    product: products[0],
    currentStock: 3,
    reservedStock: 1,
    availableStock: 2,
    status: "normal",
    lastMovementDate: "2024-01-22",
  },
  {
    productId: "prod-002",
    product: products[1],
    currentStock: 2,
    reservedStock: 0,
    availableStock: 2,
    status: "low",
    lastMovementDate: "2024-01-11",
  },
  {
    productId: "prod-003",
    product: products[2],
    currentStock: 7,
    reservedStock: 0,
    availableStock: 7,
    status: "normal",
    lastMovementDate: "2024-01-20",
  },
  {
    productId: "prod-004",
    product: products[3],
    currentStock: 5,
    reservedStock: 0,
    availableStock: 5,
    status: "normal",
    lastMovementDate: "2024-01-16",
  },
  {
    productId: "prod-005",
    product: products[4],
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    status: "out",
    lastMovementDate: "2024-01-22",
  },
  {
    productId: "prod-006",
    product: products[5],
    currentStock: 12,
    reservedStock: 0,
    availableStock: 12,
    status: "normal",
    lastMovementDate: "2024-01-28",
  },
  {
    productId: "prod-007",
    product: products[6],
    currentStock: 8,
    reservedStock: 2,
    availableStock: 6,
    status: "low",
    lastMovementDate: "2024-01-29",
  },
  {
    productId: "prod-008",
    product: products[7],
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    status: "out",
    lastMovementDate: "",
  },
  {
    productId: "prod-009",
    product: products[8],
    currentStock: 15,
    reservedStock: 0,
    availableStock: 15,
    status: "low",
    lastMovementDate: "2024-01-05",
  },
  {
    productId: "prod-010",
    product: products[9],
    currentStock: 3,
    reservedStock: 0,
    availableStock: 3,
    status: "low",
    lastMovementDate: "2024-01-08",
  },
];

// Stock helpers
export const getStockItem = (productId) => {
  return stockItems.find((s) => s.productId === productId);
};

export const getMovementsForProduct = (productId) => {
  return stockMovements
    .filter((m) => m.productId === productId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getMovementsForDocument = (documentId) => {
  return stockMovements.filter((m) => m.documentId === documentId);
};

export const getStockStats = () => {
  const totalProducts = stockItems.length;
  const lowStock = stockItems.filter((s) => s.status === "low").length;
  const outOfStock = stockItems.filter((s) => s.status === "out").length;
  const totalMovements = stockMovements.length;

  return {
    totalProducts,
    lowStock,
    outOfStock,
    normalStock: totalProducts - lowStock - outOfStock,
    totalMovements,
  };
};

export const getCategories = () => {
  return [...new Set(products.map((p) => p.category))];
};

// ===== MANUFACTURING MODULE =====

// Manufacturing products (inputs and outputs)
export const manufacturingProducts = [
  {
    id: "mp-001",
    code: "POL-ENT",
    name: "Pollo Entero",
    category: "Materia Prima",
    unit: "kg",
    unitCost: 850,
    stockAvailable: 500,
  },
  {
    id: "mp-002",
    code: "PAN-RAL",
    name: "Pan Rallado",
    category: "Insumo",
    unit: "kg",
    unitCost: 320,
    stockAvailable: 150,
  },
  {
    id: "mp-003",
    code: "HUEV-001",
    name: "Huevos",
    category: "Insumo",
    unit: "docena",
    unitCost: 480,
    stockAvailable: 80,
  },
  {
    id: "mp-004",
    code: "SAL-001",
    name: "Sal",
    category: "Insumo",
    unit: "kg",
    unitCost: 45,
    stockAvailable: 200,
  },
  {
    id: "mp-005",
    code: "ESP-001",
    name: "Especias Mix",
    category: "Insumo",
    unit: "kg",
    unitCost: 1200,
    stockAvailable: 25,
  },
  {
    id: "mp-006",
    code: "PECH-001",
    name: "Pechuga de Pollo",
    category: "Producto Intermedio",
    unit: "kg",
    unitCost: 1450,
    stockAvailable: 85,
  },
  {
    id: "mp-007",
    code: "MUSL-001",
    name: "Muslo de Pollo",
    category: "Producto Intermedio",
    unit: "kg",
    unitCost: 980,
    stockAvailable: 120,
  },
  {
    id: "mp-008",
    code: "ALAS-001",
    name: "Alas de Pollo",
    category: "Producto Intermedio",
    unit: "kg",
    unitCost: 720,
    stockAvailable: 60,
  },
  {
    id: "mp-009",
    code: "CARC-001",
    name: "Carcasa de Pollo",
    category: "Subproducto",
    unit: "kg",
    unitCost: 180,
    stockAvailable: 40,
  },
  {
    id: "mp-010",
    code: "MIL-PECH",
    name: "Milanesa de Pechuga",
    category: "Producto Terminado",
    unit: "kg",
    unitCost: 2850,
    stockAvailable: 45,
  },
  {
    id: "mp-011",
    code: "MIL-MUSL",
    name: "Milanesa de Muslo",
    category: "Producto Terminado",
    unit: "kg",
    unitCost: 2200,
    stockAvailable: 30,
  },
  {
    id: "mp-012",
    code: "CAJ-POL",
    name: "Cajón de Pollo (10u)",
    category: "Materia Prima",
    unit: "cajón",
    unitCost: 22000,
    stockAvailable: 15,
  },
  {
    id: "mp-013",
    code: "ACEITE",
    name: "Aceite Vegetal",
    category: "Insumo",
    unit: "litro",
    unitCost: 580,
    stockAvailable: 100,
  },
  {
    id: "mp-014",
    code: "HARINA",
    name: "Harina 000",
    category: "Insumo",
    unit: "kg",
    unitCost: 280,
    stockAvailable: 200,
  },
];

// Recipes (Bill of Materials)
export const recipes = [
  {
    id: "rec-001",
    code: "BOM-TROZADO",
    name: "Trozado de Pollo Entero",
    description: "Despiece de pollo entero en pechuga, muslo, alas y carcasa",
    outputProduct: manufacturingProducts[5], // Pechuga como output principal
    outputQuantity: 1,
    inputs: [
      { productId: "mp-001", product: manufacturingProducts[0], quantity: 2.5 },
    ],
    isActive: true,
    createdAt: "2024-01-05T10:00:00",
    createdBy: "Carlos Mendez",
  },
  {
    id: "rec-002",
    code: "BOM-MIL-PECH",
    name: "Milanesa de Pechuga",
    description: "Elaboración de milanesas de pechuga empanadas",
    outputProduct: manufacturingProducts[9], // Milanesa de Pechuga
    outputQuantity: 1,
    inputs: [
      { productId: "mp-006", product: manufacturingProducts[5], quantity: 1.2 },
      { productId: "mp-002", product: manufacturingProducts[1], quantity: 0.3 },
      { productId: "mp-003", product: manufacturingProducts[2], quantity: 0.5 },
      {
        productId: "mp-004",
        product: manufacturingProducts[3],
        quantity: 0.02,
      },
      {
        productId: "mp-005",
        product: manufacturingProducts[4],
        quantity: 0.01,
      },
    ],
    isActive: true,
    createdAt: "2024-01-05T11:00:00",
    createdBy: "Carlos Mendez",
  },
  {
    id: "rec-003",
    code: "BOM-MIL-MUSL",
    name: "Milanesa de Muslo",
    description: "Elaboración de milanesas de muslo empanadas",
    outputProduct: manufacturingProducts[10], // Milanesa de Muslo
    outputQuantity: 1,
    inputs: [
      { productId: "mp-007", product: manufacturingProducts[6], quantity: 1.3 },
      {
        productId: "mp-002",
        product: manufacturingProducts[1],
        quantity: 0.25,
      },
      { productId: "mp-003", product: manufacturingProducts[2], quantity: 0.4 },
      {
        productId: "mp-004",
        product: manufacturingProducts[3],
        quantity: 0.02,
      },
      {
        productId: "mp-005",
        product: manufacturingProducts[4],
        quantity: 0.01,
      },
    ],
    isActive: true,
    createdAt: "2024-01-06T09:00:00",
    createdBy: "Carlos Mendez",
  },
  {
    id: "rec-004",
    code: "BOM-CAJON",
    name: "Despiece Cajón de Pollo",
    description: "Procesamiento completo de cajón de 10 pollos",
    outputProduct: manufacturingProducts[5],
    outputQuantity: 12,
    inputs: [
      { productId: "mp-012", product: manufacturingProducts[11], quantity: 1 },
    ],
    isActive: false,
    createdAt: "2024-01-03T14:00:00",
    createdBy: "María García",
  },
];

// Production Orders
export const productionOrders = [
  {
    id: "prod-ord-001",
    orderNumber: "OP-2024-001",
    date: "2024-01-15",
    status: "completed",
    recipeId: "rec-002",
    recipeName: "Milanesa de Pechuga",
    inputs: [
      {
        productId: "mp-006",
        product: manufacturingProducts[5],
        quantityRequired: 24,
        stockBefore: 85,
      },
      {
        productId: "mp-002",
        product: manufacturingProducts[1],
        quantityRequired: 6,
        stockBefore: 150,
      },
      {
        productId: "mp-003",
        product: manufacturingProducts[2],
        quantityRequired: 10,
        stockBefore: 80,
      },
      {
        productId: "mp-004",
        product: manufacturingProducts[3],
        quantityRequired: 0.4,
        stockBefore: 200,
      },
      {
        productId: "mp-005",
        product: manufacturingProducts[4],
        quantityRequired: 0.2,
        stockBefore: 25,
      },
    ],
    outputs: [
      {
        productId: "mp-010",
        product: manufacturingProducts[9],
        quantityProduced: 20,
        unitCost: 2850,
        totalCost: 57000,
      },
    ],
    totalInputCost: 52800,
    totalOutputCost: 57000,
    observations: "Producción para pedido semanal",
    events: [
      {
        date: "2024-01-15T08:00:00",
        action: "Orden creada",
        user: "María García",
      },
      {
        date: "2024-01-15T09:30:00",
        action: "Producción ejecutada",
        user: "Pedro Sánchez",
      },
    ],
    createdAt: "2024-01-15T08:00:00",
    createdBy: "María García",
    executedAt: "2024-01-15T09:30:00",
    executedBy: "Pedro Sánchez",
  },
  {
    id: "prod-ord-002",
    orderNumber: "OP-2024-002",
    date: "2024-01-18",
    status: "completed",
    recipeId: "rec-003",
    recipeName: "Milanesa de Muslo",
    inputs: [
      {
        productId: "mp-007",
        product: manufacturingProducts[6],
        quantityRequired: 26,
        stockBefore: 120,
      },
      {
        productId: "mp-002",
        product: manufacturingProducts[1],
        quantityRequired: 5,
        stockBefore: 144,
      },
      {
        productId: "mp-003",
        product: manufacturingProducts[2],
        quantityRequired: 8,
        stockBefore: 70,
      },
      {
        productId: "mp-004",
        product: manufacturingProducts[3],
        quantityRequired: 0.4,
        stockBefore: 199.6,
      },
      {
        productId: "mp-005",
        product: manufacturingProducts[4],
        quantityRequired: 0.2,
        stockBefore: 24.8,
      },
    ],
    outputs: [
      {
        productId: "mp-011",
        product: manufacturingProducts[10],
        quantityProduced: 20,
        unitCost: 2200,
        totalCost: 44000,
      },
    ],
    totalInputCost: 38500,
    totalOutputCost: 44000,
    events: [
      {
        date: "2024-01-18T07:30:00",
        action: "Orden creada",
        user: "María García",
      },
      {
        date: "2024-01-18T10:00:00",
        action: "Producción ejecutada",
        user: "Juan Pérez",
      },
    ],
    createdAt: "2024-01-18T07:30:00",
    createdBy: "María García",
    executedAt: "2024-01-18T10:00:00",
    executedBy: "Juan Pérez",
  },
  {
    id: "prod-ord-003",
    orderNumber: "OP-2024-003",
    date: "2024-01-22",
    status: "in_progress",
    recipeId: "rec-001",
    recipeName: "Trozado de Pollo Entero",
    inputs: [
      {
        productId: "mp-001",
        product: manufacturingProducts[0],
        quantityRequired: 50,
        stockBefore: 500,
      },
    ],
    outputs: [
      {
        productId: "mp-006",
        product: manufacturingProducts[5],
        quantityProduced: 15,
        unitCost: 1450,
        totalCost: 21750,
      },
      {
        productId: "mp-007",
        product: manufacturingProducts[6],
        quantityProduced: 12,
        unitCost: 980,
        totalCost: 11760,
      },
      {
        productId: "mp-008",
        product: manufacturingProducts[7],
        quantityProduced: 8,
        unitCost: 720,
        totalCost: 5760,
      },
      {
        productId: "mp-009",
        product: manufacturingProducts[8],
        quantityProduced: 15,
        unitCost: 180,
        totalCost: 2700,
      },
    ],
    totalInputCost: 42500,
    totalOutputCost: 41970,
    observations: "Trozado para stock semanal",
    events: [
      {
        date: "2024-01-22T06:00:00",
        action: "Orden creada",
        user: "Pedro Sánchez",
      },
    ],
    createdAt: "2024-01-22T06:00:00",
    createdBy: "Pedro Sánchez",
  },
  {
    id: "prod-ord-004",
    orderNumber: "OP-2024-004",
    date: "2024-01-25",
    status: "draft",
    inputs: [
      {
        productId: "mp-006",
        product: manufacturingProducts[5],
        quantityRequired: 12,
        stockBefore: 61,
      },
      {
        productId: "mp-002",
        product: manufacturingProducts[1],
        quantityRequired: 3,
        stockBefore: 139,
      },
      {
        productId: "mp-003",
        product: manufacturingProducts[2],
        quantityRequired: 5,
        stockBefore: 62,
      },
    ],
    outputs: [
      {
        productId: "mp-010",
        product: manufacturingProducts[9],
        quantityProduced: 10,
        unitCost: 2850,
        totalCost: 28500,
      },
    ],
    totalInputCost: 26400,
    totalOutputCost: 28500,
    observations: "Pendiente de aprobación",
    events: [
      {
        date: "2024-01-25T11:00:00",
        action: "Orden creada (borrador)",
        user: "María García",
      },
    ],
    createdAt: "2024-01-25T11:00:00",
    createdBy: "María García",
  },
  {
    id: "prod-ord-005",
    orderNumber: "OP-2024-005",
    date: "2024-01-10",
    status: "cancelled",
    recipeId: "rec-002",
    recipeName: "Milanesa de Pechuga",
    inputs: [
      {
        productId: "mp-006",
        product: manufacturingProducts[5],
        quantityRequired: 30,
        stockBefore: 45,
      },
    ],
    outputs: [
      {
        productId: "mp-010",
        product: manufacturingProducts[9],
        quantityProduced: 25,
        unitCost: 2850,
        totalCost: 71250,
      },
    ],
    totalInputCost: 43500,
    totalOutputCost: 71250,
    observations: "Cancelada por falta de stock de pechuga",
    events: [
      {
        date: "2024-01-10T08:00:00",
        action: "Orden creada",
        user: "María García",
      },
      {
        date: "2024-01-10T08:30:00",
        action: "Orden cancelada - Stock insuficiente",
        user: "Carlos Mendez",
      },
    ],
    createdAt: "2024-01-10T08:00:00",
    createdBy: "María García",
  },
];

// Manufacturing helpers
export const getProductionOrder = (id) => {
  return productionOrders.find((o) => o.id === id);
};

export const getRecipe = (id) => {
  return recipes.find((r) => r.id === id);
};

export const getManufacturingProduct = (id) => {
  return manufacturingProducts.find((p) => p.id === id);
};

export const getActiveRecipes = () => {
  return recipes.filter((r) => r.isActive);
};

export const getManufacturingStats = () => {
  const thisMonth = productionOrders.filter((o) =>
    o.date.startsWith("2024-01")
  );
  const completed = thisMonth.filter((o) => o.status === "completed");
  const inProgress = productionOrders.filter(
    (o) => o.status === "in_progress"
  ).length;
  const drafts = productionOrders.filter((o) => o.status === "draft").length;

  const totalInputsCost = completed.reduce(
    (sum, o) => sum + o.totalInputCost,
    0
  );
  const totalOutputsCost = completed.reduce(
    (sum, o) => sum + o.totalOutputCost,
    0
  );
  const totalProduced = completed.reduce(
    (sum, o) => sum + o.outputs.reduce((s, out) => s + out.quantityProduced, 0),
    0
  );

  return {
    productionsThisMonth: completed.length,
    inProgress,
    drafts,
    totalInputsCost,
    totalOutputsCost,
    totalProduced,
    avgCostPerUnit:
      totalProduced > 0 ? Math.round(totalInputsCost / totalProduced) : 0,
  };
};

export const getProductionOrdersByStatus = (status) => {
  return productionOrders.filter((o) => o.status === status);
};

export const getManufacturingCategories = () => {
  return [...new Set(manufacturingProducts.map((p) => p.category))];
};
