/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box } from "@mui/system";
import { GoogleMap, InfoWindow, Marker, Polygon } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function CustomMarker({ lat, lng, client }) {
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
      position={{ lat, lng }}
      onClick={handleOpen}
      icon={
        client.client.active
          ? "https://ik.imagekit.io/mrprwema7/geo-icon-16__2__FMgqGb84R.png?updatedAt=1686144731319"
          : null
      }
    >
      {open && (
        <InfoWindow position={{ lat, lng }} onCloseClick={handleClose}>
          <div style={divStyle}>
            <h2>
              {client.user.name} {client.user.lastName}
            </h2>
            <h3>{client.address}</h3>
            <h3 style={{ marginBottom: "5px" }}>{client.deliveryZone.name}</h3>
            <Link to={`/clientes/detalle/${client.client._id}`}>
              Ver Cliente
            </Link>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}

function MapsLocations({ clientAddress, zones }) {
  const filterClientAddress = clientAddress.filter((client) => client.lat);
  const { superUserData } = useSelector((store) => store.auth);

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
        <Marker position={center} icon="https://i.ibb.co/nbm4b4x/pngegg.png" />

        {filterClientAddress.map((client) => (
          <CustomMarker
            lat={client.lat}
            lng={client.lng}
            client={client}
            key={client._id}
          />
        ))}
        {deliveryZones.map((zone) => (
          <Polygon key={zone.id} paths={zone.path} options={zone.option} />
        ))}
      </GoogleMap>
    </Box>
  );
}

export default MapsLocations;
