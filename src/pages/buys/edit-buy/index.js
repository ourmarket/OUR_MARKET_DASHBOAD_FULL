import { Alert, Grid } from "@mui/material";
import Loading from "components/DRLoading";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from "react-router-dom";
import Details from "./Details";
import { useGetBuyQuery } from "api/buyApi";

function BuyEdit() {
  const { id } = useParams();
  const { data: dataBuy, isLoading, error } = useGetBuyQuery(id);

  console.log(dataBuy);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Editar orden de compra
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              {isLoading && <Loading />}
              {error && <Alert severity="error">Ha ocurrido un error</Alert>}
              {dataBuy && <Details buy={dataBuy.data.buy} />}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default BuyEdit;
