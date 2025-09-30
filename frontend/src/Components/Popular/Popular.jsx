import React, { useEffect, useState } from 'react';
import './Popular.css';

import Item from '../Item/Item';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularinplate')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched popular products:", data); // debug log
        setPopularProducts(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out' });
  }, []);

  return (
    <div className='popular' data-aos="fade-up">
      <h1 data-aos="zoom-in">POPULAR IN PLATE</h1>
      <hr data-aos="fade-right" />

      <div className="popular-item">
        {popularProducts.length > 0 ? (
          popularProducts.map((item, i) => (
            <div data-aos="fade-up" data-aos-delay={i * 100} key={item.id}>
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Popular;
