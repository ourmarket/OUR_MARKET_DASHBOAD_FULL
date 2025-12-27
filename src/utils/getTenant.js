// utils/getTenant.js
export const getTenant = () => {
  const host = window.location.hostname;

  // localhost o IP
  if (host === "localhost" || host === "127.0.0.1") {
    return import.meta.env.VITE_TENANT; // ej: dr_01
  }

  // dr_01.dashboard.ourmarket.com
  return host.split(".")[0];
};
