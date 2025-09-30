import React, { useState, useEffect } from "react";
import "./Hero.css";
import hero_image1 from "../Assets/eco-friendly-utensils-arrangement.jpg";
import hero_image2 from "../Assets/image_116.jpg";
import hero_image3 from "../Assets/zhang-liven-AkgHzEXEPnQ-unsplash.jpg";

const Hero = ({ scrollToNewCollections }) => {
  const slides = [
    {
      title: "Pure & Natural",
      text1: "Eco-Friendly",
      text2: "Dona Pattal",
      subtitle: "100% biodegradable leaf plates for your occasions",
      img: hero_image1,
    },
    {
      title: "Premium Quality",
      text1: "Handcrafted",
      text2: "Excellence",
      subtitle: "Traditional craftsmanship meets modern needs",
      img: hero_image2,
    },
    {
      title: "Festival Special",
      text1: "Celebrate",
      text2: "Sustainably",
      subtitle: "Perfect for weddings, parties & religious ceremonies",
      img: hero_image3,
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero">
      {/* Left Section */}
      <div className="hero-left" data-aos="fade-right" data-aos-delay="200">
        <h2 className="hero-title" data-aos="fade-up" data-aos-delay="400">
          {slides[current].title}
        </h2>

        <div
          className="hero-text-section"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="hero-hand-icon">
            <p className="new-text">new</p>
            <div className="hand-icon">👋</div>
          </div>
          <p className="hero-main-text">{slides[current].text1}</p>
          <p className="hero-main-text">{slides[current].text2}</p>
        </div>

        <div
          className="hero-latest-btn"
          onClick={scrollToNewCollections}
          data-aos="zoom-in"
          data-aos-delay="800"
        >
          <span>Latest Collection</span>
          <span className="arrow">→</span>
        </div>
      </div>

      {/* Right Section with slideshow */}
      <div className="hero-right" data-aos="fade-left" data-aos-delay="400">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${
                index === current
                  ? "active"
                  : index === (current - 1 + slides.length) % slides.length
                  ? "prev"
                  : ""
              }`}
            >
              <img
                src={slide.img}
                alt={`${slide.title} - Dona Pattal`}
                className="hero-image"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slider controls */}
      <div className="slider-dots" data-aos="fade-up" data-aos-delay="1000">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
