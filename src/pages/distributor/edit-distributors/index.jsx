import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useParams } from "react-router-dom";
import { useGetDistributorQuery } from "api/distributorApi";
import Loading from "components/DRLoading";
import { Alert } from "@mui/material";
import DistributorEdit from "./DistributorsEdit";

function EditDistributor() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetDistributorQuery(id);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Editar distribuidora
                </MDTypography>
              </MDBox>
              <MDBox>
                {isLoading && <Loading />}
                {isError && (
                  <Alert severity="error">Ha ocurrido un error</Alert>
                )}
                {data && (
                  <DistributorEdit distributor={data.data.distributor} />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditDistributor;
