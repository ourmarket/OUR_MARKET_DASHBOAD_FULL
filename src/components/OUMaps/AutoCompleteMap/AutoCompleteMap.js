/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { DraggableMarker } from "./components/DraggableMarker";
import { RecenterAutomatically } from "./components/RecenterAutomatically";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import { useSelector } from "react-redux";
import { AutoCompleteForm } from "./components/AutoCompleteForm";

function AutoCompleteMap({ zones }) {
  const { lat, lng } = useSelector((store) => store.mapAutocomplete);
  const [position, setPosition] = useState({ lat, lng });

  useEffect(() => {
    setPosition({ lat, lng });
  }, [lat, lng]);

  const deliveryZones = zones.map((zone) => ({
    id: zone?._id,
    colorFill: {
      color: zone?.fillColor,
    },
    path: zone?.mapLimits.map((limit) => [limit?.lat, limit?.lng]),
  }));

  return (
    <Box sx={{ width: "100%", height: 610, marginTop: "15px" }}>
      <MapContainer
        center={position}
        zoom={17}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <AutoCompleteForm />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} setPosition={setPosition} />
        <RecenterAutomatically lat={position.lat} lng={position.lng} />

        {deliveryZones.map((zone) => (
          <Polygon
            key={zone.id}
            pathOptions={zone.colorFill}
            positions={zone.path}
          />
        ))}
      </MapContainer>
      <Box
        sx={{
          backgroundColor: colors.gradients.grey_blue.main,
          padding: "10px",
        }}
      >
        <MDTypography
          sx={{ textAlign: "center", color: "#fff" }}
          variant="h5"
        >{`Lat: ${position.lat} || Lon: ${position.lng}`}</MDTypography>
      </Box>
    </Box>
  );
}

export default AutoCompleteMap;
