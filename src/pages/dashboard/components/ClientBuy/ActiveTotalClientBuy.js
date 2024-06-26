/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Avatar, Divider } from "@mui/material";
import { formatPrice } from "utils/formaPrice";
import { Link } from "react-router-dom";
import PollIcon from "@mui/icons-material/Poll";

function ActiveTotalClientsBuy({ active }) {
  return (
    <Card>
      <MDBox sx={{ flex: 1, padding: 3 }}>
        <MDTypography
          variant="h6"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <PollIcon fontSize="large" /> {`Top ${active.length} Clientes`}
          <span style={{ color: "green", margin: " 0 5px" }}>Activos</span> con
          más ganancia
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          Han comprado los últimos 20 días.
        </MDTypography>
        <Divider />

        {active.map((client) => (
          <Link
            to={`/clientes/detalle/${client.clientId}`}
            key={client.clientId}
          >
            <MDBox
              mb={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#dddddd2d",
                },
              }}
            >
              <MDBox
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  width: "75%",
                }}
              >
                <Avatar
                  src={
                    client?.img ||
                    "https://ik.imagekit.io/mrprwema7/OurMarket/pngwing.com%20(3)%20(2)_HuAjhlJK-.png?updatedAt=1695995911119"
                  }
                />
                <MDTypography variant="body2">
                  {client.name} {client.lastName}
                </MDTypography>
              </MDBox>

              <MDTypography
                variant="body2"
                mr={1}
                sx={{ width: "25%", textAlign: "right" }}
              >
                {formatPrice(client?.totalProfits)}
              </MDTypography>
            </MDBox>
          </Link>
        ))}
      </MDBox>
    </Card>
  );
}

export default ActiveTotalClientsBuy;
