import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/recentproducts")
      .then((response) => response.json())
      .then((data) => setNew_Collection(data));
  }, []);
  return (
    <div className="new-collections" data-aos="fade-up">
      <h1 data-aos="zoom-in">New Collections</h1>
      <hr data-aos="fade-right" />

      <div className="new-collections-item">
        {new_collection.slice(0, 8).map((item, i) => {
          // ✅ only 4 items
          return (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100} // stagger animation for each item
            >
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;
