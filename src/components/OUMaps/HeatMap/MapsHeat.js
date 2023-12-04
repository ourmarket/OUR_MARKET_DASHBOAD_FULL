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

function MapsHeat({ clientAddress, zones }) {
  const filterClientAddress = clientAddress.filter((client) => client.lat);
  const { superUserData } = useSelector((store) => store.auth);

  const center = useMemo(
    () => ({ lat: superUserData.lat, lng: superUserData.lng }),
    []
  );

  const dataHeat = filterClientAddress.map((client) => ({
    location: new window.google.maps.LatLng(client.lat, client.lng),
    weight: 5,
  }));

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
        <Marker
          position={center}
          icon="https://ik.imagekit.io/mrprwema7/OurMarket/home_5973800%20(1)_bn1AFnpE4.png?updatedAt=1701697209819"
        />

        <HeatmapLayerF
          data={dataHeat}
          options={{ radius: 30, maxIntensity: 10 }}
        />

        {deliveryZones.map((zone) => (
          <Polygon key={zone.id} paths={zone.path} options={zone.option} />
        ))}
      </GoogleMap>
    </Box>
  );
}

export default MapsHeat;
