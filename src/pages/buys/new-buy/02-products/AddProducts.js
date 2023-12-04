import { Box, TextField } from "@mui/material";
import ProductCard from "./ProductCard";
import { useState } from "react";

/* eslint-disable react/prop-types */
const AddProducts = ({ products }) => {
  const [search, setSearch] = useState("");

  const [filterProducts, setFilterProducts] = useState(products);

  const handleFilterChanges = (e) => {
    setSearch(e.target.value);
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilterProducts(filteredProducts);
  };

  return (
    <Box p={3}>
      <TextField
        type="text"
        fullWidth
        placeholder="Buscar..."
        onChange={handleFilterChanges}
        value={search}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {filterProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default AddProducts;
