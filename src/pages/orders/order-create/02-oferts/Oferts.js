/* eslint-disable react/prop-types */
import { Box, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useState } from "react";
import ProductCard from "./ProductCard";

function Oferts({ oferts }) {
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState(true);

  const productWithStock = oferts.filter((ofert) => ofert.stock.length > 0);

  const allProducts = oferts
    .map((ofert) => ofert)
    .sort((a, b) => {
      if (a.description < b.description) {
        return -1;
      }
      if (a.description > b.description) {
        return 1;
      }
      return 0;
    });

  console.log(allProducts);
  console.log(productWithStock);
  const [filterArr, setFilterArr] = useState(productWithStock);

  const filtrar = (arrayToFilter) => {
    const result = arrayToFilter.filter((ofert) => {
      if (
        ofert.description
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return ofert;
      }
    });
    return result;
  };

  const handleClick = () => {
    setStock(!stock);
    stock
      ? setFilterArr(filtrar(productWithStock))
      : setFilterArr(filtrar(allProducts));
  };

  const handlerFilterChanges = (e) => {
    setSearch(e.target.value);
    stock
      ? setFilterArr(filtrar(allProducts))
      : setFilterArr(filtrar(productWithStock));
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "20px",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Box>
        {!stock && (
          <MDButton variant="gradient" color="info" onClick={handleClick}>
            Ofertas con stocks
          </MDButton>
        )}
        {stock && (
          <MDButton variant="outlined" color="info" onClick={handleClick}>
            Todas las ofertas
          </MDButton>
        )}
      </Box>

      <TextField
        type="text"
        fullWidth
        placeholder="Buscar..."
        onChange={handlerFilterChanges}
        value={search}
      />
      <Box
        sx={{
          display: "flex",

          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          padding: "0px 20px",
        }}
      >
        <MDTypography variant="h6" sx={{ width: "52%" }}>
          Producto
        </MDTypography>

        <MDTypography variant="h6" sx={{ width: "17%" }}>
          Precio
        </MDTypography>
        <MDTypography variant="h6" sx={{ width: "17%", paddingLeft: "2%" }}>
          Stock
        </MDTypography>
        <MDTypography
          variant="h6"
          sx={{ width: "17%", textAlign: "right", paddingRight: "30px" }}
        >
          Acción
        </MDTypography>
      </Box>
      {filterArr.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </Box>
  );
}

export default Oferts;
