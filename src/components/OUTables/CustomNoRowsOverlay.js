import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

function CustomNoRowsOverlay({ title, message, icon }) {
  return (
    <MDBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Icon
        sx={{
          fontSize: "64px !important",
          color: "text.secondary",
          opacity: 0.3,
        }}
      >
        {icon || "search_off"}
      </Icon>
      <MDTypography
        variant="h6"
        fontWeight="medium"
        color="text"
        sx={{ mt: 1, opacity: 0.5 }}
      >
        {title || "No se encontraron resultados"}
      </MDTypography>
      <MDTypography variant="button" color="text" sx={{ opacity: 0.5 }}>
        {message || "Intenta ajustar los filtros de búsqueda"}
      </MDTypography>
    </MDBox>
  );
}

CustomNoRowsOverlay.defaultProps = {
  title: "No se encontraron resultados",
  message: "Intenta ajustar los filtros de búsqueda",
  icon: "search_off",
};

CustomNoRowsOverlay.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.string,
};

export default CustomNoRowsOverlay;
