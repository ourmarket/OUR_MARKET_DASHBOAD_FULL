import Loading from "components/DRLoading";
import Oferts from "./Oferts";
import { Alert } from "@mui/material";
import { useGetOfertsQuery } from "api/ofertApi";

export const Oferts_index = () => {
  const { data: oferts, isLoading: l1, isError: e1 } = useGetOfertsQuery(1);
  return (
    <>
      {l1 && <Loading />}
      {e1 && <Alert severity="error">Ha ocurrido un error</Alert>}
      {oferts && <Oferts oferts={oferts.data.oferts} />}
    </>
  );
};
