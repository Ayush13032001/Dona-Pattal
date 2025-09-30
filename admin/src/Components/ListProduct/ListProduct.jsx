import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  // Fetch products
  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove product
  const remove_product = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return; // ❌ If user clicks 'Cancel', stop here

    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id }) // ✅ fixed typo
    });

    // Refresh product list after delete
    fetchInfo();
  };

  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="list-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproduct">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt={product.name} className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>Rs {product.old_price}</p>
            <p>Rs {product.new_price}</p>
            <p>{product.category}</p>
            <img
              className='listproduct-remove-icon'
              src={cross_icon}
              alt="Remove"
              onClick={() => remove_product(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
