import React, { useEffect, useState, useRef } from "react";
import "./Popular.css";

import Item from "../Item/Item";
import AOS from "aos";
import "aos/dist/aos.css";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRef = useRef(false); // prevent double fetch in Strict Mode

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    if (fetchRef.current) return; // already fetched
    fetchRef.current = true;

    const fetchPopularProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/popularinplate");
        if (!res.ok) throw new Error("Failed to fetch popular products");
        const data = await res.json();
        setPopularProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="popular" data-aos="fade-up">
      <h1 data-aos="zoom-in">POPULAR IN PLATE</h1>
      <hr data-aos="fade-right" />

      <div className="popular-item">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : popularProducts.length > 0 ? (
          popularProducts.map((item, i) => (
            <div
              data-aos="fade-up"
              data-aos-delay={i * 100}
              key={item._id || item.id}
            >
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
          <p>No popular products found</p>
        )}
      </div>
    </div>
  );
};

export default Popular;
