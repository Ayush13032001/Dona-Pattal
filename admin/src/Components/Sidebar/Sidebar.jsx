import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import add_product_icon from '../../assets/Product_Cart.svg';
import list_product_icon from '../../assets/Product_list_icon.svg';

const Sidebar = () => {
  const handleClick = (msg) => {
    toast.info(msg, {
      position: "bottom-right",
      autoClose: 2000,
      theme: "colored"
    });
  };

  return (
    <div className="sidebar">
      <Link to="/addproduct" style={{ textDecoration: "none" }}>
        <div className="sidebar-item" onClick={() => handleClick("Navigating to Add Product 🚀")}>
          <img src={add_product_icon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>

      <Link to="/listproduct" style={{ textDecoration: "none" }}>
        <div className="sidebar-item" onClick={() => handleClick("Viewing Product List 📦")}>
          <img src={list_product_icon} alt="Product List" />
          <p>Product List</p>
        </div>
      </Link>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
