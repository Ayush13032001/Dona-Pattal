import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const Breadcrums = ({ product }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/">
        HOME
      </Link>
      <Link underline="hover" color="inherit" href="/shop">
        SHOP
      </Link>
      <Link
        underline="hover"
        color="inherit"
        href={`/category/${product.category}`}
      >
        {product.category}
      </Link>
      <Typography color="text.primary">{product.name}</Typography>
    </Breadcrumbs>
  );
};

export default Breadcrums;
