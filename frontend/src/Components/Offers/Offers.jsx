import React from 'react';
import './Offers.css';
import exclusive_image from '../Assets/padraig-treanor-UvR8ihj-iLg-unsplash.jpg';

const Offers = () => {
  return (
    <div className="offers">
      <div className="offers-left">
        <h1>EXCLUSIVE</h1>
        <h1>OFFERS FOR YOU</h1>
        <p>ONLY ON BEST SELLER PRODUCTS</p>
        <button>Check Now</button>
      </div>
      
      <div className="offers-right">
        <div className="glass-container">
          <div className="rotating-glass">
            <img src={exclusive_image} alt="Exclusive Offers" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;