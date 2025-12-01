/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { Box } from "@mui/system";
import {
  GoogleMap,
  HeatmapLayerF,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function isValidCoord(v) {
  // acepta números o strings numéricos, descarta null/undefined/NaN/""
  if (v === null || v === undefined) return false;
  const n = Number(v);
  return Number.isFinite(n);
}

function MapsNegociosHeat({ clientAddress = [], zones = [] }) {
  const { superUserData } = useSelector((store) => store.auth || {});

  // Centro del mapa (asegurarse que exista)
  const center = useMemo(() => {
    const lat = Number(superUserData?.lat) || 0;
    const lng = Number(superUserData?.lng) || 0;
    return { lat, lng };
  }, [superUserData?.lat, superUserData?.lng]);

  // Filtrar y normalizar clientes: sólo lat/lng válidos como Number
  const validClients = useMemo(() => {
    if (!Array.isArray(clientAddress)) return [];
    return clientAddress
      .map((c) => {
        const lat = c?.lat;
        const lng = c?.lng;
        if (!isValidCoord(lat) || !isValidCoord(lng)) return null;
        return {
          ...c,
          lat: Number(lat),
          lng: Number(lng),
        };
      })
      .filter(Boolean);
  }, [clientAddress]);

  // Crear puntos del heatmap con objetos LatLng válidos
  const dataHeat = useMemo(() => {
    if (!validClients.length) return [];
    // map a LatLng
    return validClients.map((client) => ({
      location: new window.google.maps.LatLng(client.lat, client.lng),
      weight: 5,
    }));
  }, [validClients]);

  console.log(dataHeat)

  // Opciones del mapa
  const mapOptions = useMemo(
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

  // Normalizar zonas
  const deliveryZones = useMemo(() => {
    if (!Array.isArray(zones)) return [];
    return zones.map((zone) => ({
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
  }, [zones]);

  // Key para forzar remount del heatmap cuando cambian puntos (string compacto)
  const heatmapKey = useMemo(() => {
    if (!validClients.length) return "heat-empty";
    // construir string pequeño con coordenadas para detectar cambios
    const s = validClients
      .map((c) => `${c.lat.toFixed(5)},${c.lng.toFixed(5)}`)
      .join("|");
    return `heat-${validClients.length}-${s}`;
  }, [validClients]);

  return (
    <Box p={3}>
      <GoogleMap
        zoom={13}
        center={center}
        mapContainerClassName="map-container"
        options={mapOptions}
      >
        {/* Marcador del usuario */}
        <Marker
          position={center}
          icon="https://ik.imagekit.io/mrprwema7/OurMarket/home_5973800%20(1)_bn1AFnpE4.png?updatedAt=1701697209819"
        />

        {/* Solo renderizar Heatmap si hay puntos válidos */}
        {dataHeat.length > 0 ? (
          <HeatmapLayerF
            key={JSON.stringify(dataHeat.length)} // 🔥 Fuerza el remount cuando cambia dataHeat
            data={dataHeat}
            options={{ radius: 30, maxIntensity: 10 }}
          />
        ) : null}

        {/* Zonas de entrega */}
        {deliveryZones.map((zone) => (
          <Polygon key={zone.id} paths={zone.path} options={zone.option} />
        ))}
      </GoogleMap>
    </Box>
  );
}

export default MapsNegociosHeat;
