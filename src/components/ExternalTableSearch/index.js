import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// UI
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

function ExternalTableSearch({ data, fields, children, placeholder }) {
  const [filterField, setFilterField] = useState(fields[0].key);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      const value = item[filterField]?.toString().toLowerCase() || "";
      return value.includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, filterField]);

  return (
    <>
      {/* BUSCADOR */}
      <MDBox mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MDInput
              select
              fullWidth
              label="Filtrar por"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              {fields.map((field) => (
                <MenuItem key={field.key} value={field.key}>
                  {field.label}
                </MenuItem>
              ))}
            </MDInput>
          </Grid>

          <Grid item xs={12} md={8}>
            <MDInput
              fullWidth
              placeholder={placeholder || "Buscar..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </MDBox>

      {/* DATA FILTRADA */}
      {children(filteredData)}
    </>
  );
}

ExternalTableSearch.propTypes = {
  data: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default ExternalTableSearch;
