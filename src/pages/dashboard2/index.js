/* eslint-disable no-unused-vars */
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useGetOrdersActiveQuery } from "api/orderApi";

import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import { useLoadScript } from "@react-google-maps/api";
import DashboardToday from "./components/DashboardToday";
import { useGetDeliveryZonesQuery } from "api/deliveryZoneApi";
import { useEffect } from "react";

function Dashboard2() {
  const {
    data: dataOrders,
    isLoading: l1,
    isError: e1,
  } = useGetOrdersActiveQuery();

  const {
    data: dataZones,
    isLoading: l2,
    isError: e2,
  } = useGetDeliveryZonesQuery();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_MAP_API_KEY,
    libraries: ["places", "visualization"],
  });
  useEffect(() => {
    if (isLoaded === true) {
      console.log("--------------------------");
      console.log("----Script map cargado----");
      console.log("--------------------------");
    }
  }, [isLoaded]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {(l1 || l2) && <Loading />}
      {e1 && e2 && <Alert severity="error">Ha ocurrido un error</Alert>}
      {dataOrders && isLoaded && (
        <DashboardToday
          activeOrders={dataOrders.data.orders}
          zones={dataZones.data.deliveryZones}
        />
      )}
    </DashboardLayout>
  );
}

export default Dashboard2;
