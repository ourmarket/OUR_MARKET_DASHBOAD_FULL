/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Alert, Autocomplete, Box, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSupplier } from "reduxToolkit/buySlice";

const AddSuppliers = ({ suppliersData = [], setPage }) => {
  const dispatch = useDispatch();
  const [suppliers, setSuppliers] = useState([]);

  const data = useSelector((store) => store.buy.supplier);

  useEffect(() => {
    if (suppliersData) {
      const autoCompleteSuppliers = suppliersData
        .map((supplier) => {
          const firstLetter = supplier.businessName[0].toUpperCase();
          return {
            id: supplier._id,
            businessName: supplier.businessName,

            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
          };
        })
        .sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter));

      dispatch(addSupplier(autoCompleteSuppliers[0]));
      setSuppliers(autoCompleteSuppliers);
    }
  }, [suppliersData]);

  if (suppliersData.length === 0) {
    return (
      <Box p={3}>
        <Alert severity="info">No hay proveedores creados todavía.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Autocomplete
        options={suppliers}
        getOptionLabel={(options) => options.businessName}
        groupBy={(option) => option.firstLetter}
        multiple={false}
        value={data}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(event, newValue) => {
          dispatch(addSupplier(newValue));
        }}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecciona un proveedor"
            variant="outlined"
          />
        )}
      />

      <MDButton
        variant="outlined"
        color="info"
        onClick={() => setPage(1)}
        sx={{
          mt: 1,
          mb: 2,
        }}
      >
        Confirmar proveedor
      </MDButton>
    </Box>
  );
};

export default AddSuppliers;
