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
import { zones } from "./Zones";
import { useSelector } from "react-redux";

const optionZones = {
  fillColor: "lightblue",
  fillOpacity: 0.2,
  strokeColor: "blue",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

function MapsHeat({ clientAddress }) {
  const filterClientAddress = clientAddress.filter((client) => client.lat);

  const dataHeat = filterClientAddress.map((client) => ({
    location: new window.google.maps.LatLng(client.lat, client.lng),
    weight: 5,
  }));

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
  const zone1 = useMemo(
    () => ({
      ...optionZones,
      fillColor: "#e91e63",
    }),
    []
  );
  const zone2 = useMemo(
    () => ({
      ...optionZones,
      fillColor: "#7b809a",
    }),
    []
  );
  const zone3 = useMemo(
    () => ({
      ...optionZones,
      fillColor: "#1A73E8",
    }),
    []
  );
  const zone4 = useMemo(
    () => ({
      ...optionZones,
      fillColor: "#4CAF50",
    }),
    []
  );
  const zone5 = useMemo(
    () => ({
      ...optionZones,
      fillColor: "#fb8c00",
    }),
    []
  );
  const zone6 = useMemo(
    () => ({
      ...optionZones,
      fillColor: "#F44335",
    }),
    []
  );
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

        <HeatmapLayerF
          data={dataHeat}
          options={{ radius: 30, maxIntensity: 10 }}
        />

        <Polygon paths={zones.zona1} options={zone1} />
        <Polygon paths={zones.zona2} options={zone2} />
        <Polygon paths={zones.zona3} options={zone3} />
        <Polygon paths={zones.zona4} options={zone4} />
        <Polygon paths={zones.zona5} options={zone5} />
        <Polygon paths={zones.zona6} options={zone6} />
      </GoogleMap>
    </Box>
  );
}

export default MapsHeat;
