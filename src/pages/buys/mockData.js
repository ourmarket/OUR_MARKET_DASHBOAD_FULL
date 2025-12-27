// Mock data for the Purchases module

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
