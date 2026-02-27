import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }
    // Pass size to context if your backend/logic supports it
    addToCart(product.id, selectedSize);
  };

  return (
    <section className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {/* Using a key for lists is vital in React */}
          {[...Array(4)].map((_, index) => (
            <img
              key={index}
              src={product.image}
              alt={`${product.name} thumbnail ${index}`}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-star">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="star" />
          ))}
          <img src={star_dull_icon} alt="star dull" />
          <p>(122 Reviews)</p>
        </div>

        <div className="productdisplay-right-prices">
          <span className="productdisplay-right-price-old">
            Rs.{product.old_price}
          </span>
          <span className="productdisplay-right-price-new">
            Rs.{product.new_price}
          </span>
        </div>

        <div className="productdisplay-right-description">
          {product.description ||
            "Premium quality apparel designed for comfort and style."}
        </div>

        <div className="productdisplay-right-size">
          <h2>Select Size</h2>
          <div className="size-selector">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active-size" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          ADD TO CART
        </button>

        <div className="productdisplay-footer">
          <p>
            <span>Category :</span> {product.category}, T-Shirt, Crop Top
          </p>
          <p>
            <span>Tags :</span> Modern, Latest
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;
