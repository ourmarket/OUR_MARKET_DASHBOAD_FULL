/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box } from "@mui/system";
import { GoogleMap, InfoWindow, Marker, Polygon } from "@react-google-maps/api";
import { useSocket2 } from "hooks/useSockets2";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setPositions } from "reduxToolkit/positionSlice";
import { formatPrice } from "utils/formaPrice";

function ClientMarker({ data }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15,
    textAlign: "center",
  };
  return (
    <Marker
      position={{
        lat: data.shippingAddress.lat,
        lng: data.shippingAddress.lng,
      }}
      onClick={handleOpen}
      icon={
        data.status === "Entregado"
          ? "https://ik.imagekit.io/mrprwema7/geo-icon-16__2__FMgqGb84R.png?updatedAt=1686144731319"
          : null
      }
    >
      {open && (
        <InfoWindow
          position={{
            lat: data.shippingAddress.lat,
            lng: data.shippingAddress.lng,
          }}
          onCloseClick={handleClose}
        >
          <div style={divStyle}>
            <h2>
              {data.shippingAddress.name} {data.shippingAddress.lastName}
            </h2>
            <h3>{data.shippingAddress.address}</h3>
            <h3>Estado: {data.status}</h3>
            <h3>{formatPrice(data.total)}</h3>
            <h3 style={{ marginBottom: "5px" }}>{data.deliveryZone.name}</h3>
            <Link to={`/clientes/detalle/${data.client}`}>Ver Cliente</Link>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}
function DeliveryMarker({ data, orders }) {
  const [open, setOpen] = useState(false);

  const filterOrders = orders.filter(
    (order) =>
      order.deliveryTruck && order.deliveryTruck.truckId === data.truckId
  );

  const filterOrdersDelivered = filterOrders.filter(
    (order) => order.status === "Entregado"
  );

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const divStyle = {
    background: `white`,

    padding: 10,
    textAlign: "center",
  };

  return (
    <Marker
      onClick={handleOpen}
      position={{ lat: data.lat, lng: data.lng }}
      icon="https://i.ibb.co/SJdVf1D/geo-icon-16-3.png"
    >
      {open && (
        <InfoWindow
          position={{ lat: data.lat, lng: data.lng }}
          onCloseClick={handleClose}
        >
          <div style={divStyle}>
            <h2>{data.truckId}</h2>
            <h3>{data.deliveryName}</h3>
            <h3 style={{ marginBottom: "5px" }}>
              Ordenes entregadas : {filterOrdersDelivered.length}/
              {filterOrders.length}
            </h3>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}

function MapDelivery({ activeOrders, zones }) {
  const dispatch = useDispatch();
  const activeFilterOrders = activeOrders.filter(
    (order) => order.shippingAddress.lat
  );

  const { positions } = useSelector((store) => store.positions);
  const { superUserData } = useSelector((store) => store.auth);

  const { socket, connectSocket, disconnectSocket } = useSocket2(
    `${import.meta.env.VITE_APP_SOCKET_URL}/orders/delivery`
  );

  useEffect(() => {
    // Conecta el socket al montar el componente
    connectSocket();

    // Desconecta el socket al desmontar el componente
    return () => {
      disconnectSocket();
    };
  }, []);

  const center = useMemo(
    () => ({ lat: superUserData.lat, lng: superUserData.lng }),
    []
  );
  const options = useMemo(
    () => ({
      clickableIcons: false,
      styles: [
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  useEffect(() => {
    if (socket) {
      socket.on("delivery", (data) => {
        dispatch(setPositions(data));
      });
    }
  }, [socket, dispatch]);

  const deliveryZones = zones.map((zone) => ({
    id: zone._id,
    path: zone.mapLimits,
    option: {
      fillColor: zone.fillColor,
      fillOpacity: 0.2,
      strokeColor: "blue",
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      geodesic: false,
      zIndex: 1,
    },
  }));

  return (
    <Box p={3}>
      <GoogleMap
        zoom={13}
        center={center}
        mapContainerClassName="map-container"
        options={options}
      >
        <Marker
          position={center}
          icon="https://ik.imagekit.io/mrprwema7/OurMarket/home_5973800%20(1)_bn1AFnpE4.png?updatedAt=1701697209819"
        />

        {positions.length > 0 &&
          positions.map((truck) => (
            <DeliveryMarker key={truck} data={truck} orders={activeOrders} />
          ))}

        {activeFilterOrders.map((order) => (
          <ClientMarker data={order} key={order._id} />
        ))}

        {deliveryZones.map((zone) => (
          <Polygon key={zone.id} paths={zone.path} options={zone.option} />
        ))}
      </GoogleMap>
    </Box>
  );
}

export default MapDelivery;
