import { Card, Stack } from "@mui/material";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

const MapZones = () => {
  const navigate = useNavigate();
  return (
    <Card m="20px" sx={{ overflowX: "scroll", padding: "20px" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <MDButton
          color="dark"
          variant="gradient"
          onClick={() => navigate("/clientes/direcciones/nuevo")}
        >
          Nueva Zona
        </MDButton>
      </Stack>
    </Card>
  );
};

export default MapZones;
