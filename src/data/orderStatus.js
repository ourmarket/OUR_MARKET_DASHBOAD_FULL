export const ORDER_STATUS = {
  DRAFT: {
    label: "Borrador",
    color: "secondary",
    actions: {
      submit: true, // → SUBMITTED
      approve: false,
      cancel: true, // → CANCELLED
      convert: false,
    },
  },

  SUBMITTED: {
    label: "Enviada",
    color: "info",
    actions: {
      submit: false,
      approve: true, // → APPROVED
      cancel: true, // → CANCELLED
      convert: false,
    },
  },

  APPROVED: {
    label: "Aprobada",
    color: "success",
    actions: {
      submit: false,
      approve: false,
      cancel: false,
      convert: true, // → BUY
      close: false, // opcional
    },
  },
  EXECUTED: {
    label: "Ejecutada",
    color: "info",
    actions: {},
  },

  CANCELLED: {
    label: "Cancelada",
    color: "error",
    actions: {},
  },

  CLOSED: {
    label: "Cerrada",
    color: "dark",
    actions: {},
  },
};
