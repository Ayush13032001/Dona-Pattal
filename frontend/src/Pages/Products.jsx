import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import { ShopContext } from "../Context/ShopContext";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import "./CSS/Products.css"; // We'll add some CSS for loader

const Products = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();

  // Find the product
  const product = all_product.find((e) => e.id === Number(productId));

  if (all_product.length === 0) {
    return (
      <div className="loader-container">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Fetching your awesome product...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="loader-container">Product Not Found 😢</div>;
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
