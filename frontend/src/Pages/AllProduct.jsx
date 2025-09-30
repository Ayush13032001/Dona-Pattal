import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";
import "./CSS/AllProduct.css";

const AllProduct = () => {
  const { all_product } = useContext(ShopContext);

  return (
    <div className="all-products">
      <h1>All Products</h1>
      <hr />
      <div className="all-products-grid">
        {all_product.map((item) => (
          <div key={item.id} className="product-card">
            <Link to={`/products/${item.id}`}>
              <img src={item.image} alt={item.name} className="product-img" />
            </Link>
            <p className="product-name">{item.name}</p>
            <div className="product-prices">
              <span className="new-price">Rs {item.new_price}</span>
              <span className="old-price">Rs {item.old_price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
