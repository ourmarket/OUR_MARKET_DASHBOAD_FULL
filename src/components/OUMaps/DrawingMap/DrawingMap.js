/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useSelector } from "react-redux";
import MDTypography from "components/MDTypography";
import { Box } from "@mui/material";

const DrawingMap = ({ color, setMapLimits, zones }) => {
  const { superUserData } = useSelector((store) => store.auth);
  const [error, setError] = useState(true);

  const deliveryZones = zones.map((zone) => ({
    id: zone._id,
    colorFill: {
      color: zone.fillColor,
    },
    path: zone.mapLimits.map((limit) => [limit.lat, limit.lng]),
  }));

  console.log(deliveryZones);

  const center = useMemo(
    () => ({ lat: superUserData.lat, lng: superUserData.lng }),
    []
  );

  const _onCreate = (e) => {
    console.log(e);

    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setError(false);
      setMapLimits((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const _onEdited = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLimits((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };

  const _onDeleted = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    setError(true);

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLimits((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: "15px",
        position: "relative",
      }}
    >
      {error && (
        <Box
          sx={{
            backgroundColor: "#fff",
            zIndex: 999999999,
            position: "absolute",
            top: "10px",
            left: "45%",
            padding: 1,
            borderRadius: "5px",
            color: "red",
          }}
        >
          Dibujar Zona ❌
        </Box>
      )}
      {!error && (
        <Box
          sx={{
            backgroundColor: "#fff",
            zIndex: 999999999,
            position: "absolute",
            top: "10px",
            left: "45%",
            padding: 1,
            borderRadius: "5px",
            color: "green",
          }}
        >
          Dibujar Zona ✔
        </Box>
      )}
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "90%" }}
      >
        <Marker position={center}>
          <Popup>Mi ubicación 🏠</Popup>
        </Marker>
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreate}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: {
                shapeOptions: {
                  color: "#1A73E8",
                  fillColor: `${color}`,
                },
              },
            }}
          />
        </FeatureGroup>
        {deliveryZones.map((zone) => (
          <Polygon
            key={zone.id}
            pathOptions={zone.colorFill}
            positions={zone.path}
          />
        ))}

        {/*  <Polygon pathOptions={purpleOptions} positions={multiPolygon} /> */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      <MDTypography variant="body2" p={1}>
        (*) Seleccione el primer icono de arriba a la derecha. Dibuje la zona,
        comenzando y terminando en el mismo punto.
      </MDTypography>
    </div>
  );
};

export default DrawingMap;
