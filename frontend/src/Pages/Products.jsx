import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import { ShopContext } from "../Context/ShopContext";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const Products = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();

  // Find the product
  const product = all_product.find((e) => e.id === Number(productId));

  // Fix: Check if products are loaded yet
  if (all_product.length === 0) {
    return <div>Loading Products from Server...</div>;
  }

  // Fix: Check if specific product exists
  if (!product) {
    return <div>Product Not Found</div>;
  }

  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};

export default Products;
