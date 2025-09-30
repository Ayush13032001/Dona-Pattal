import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import logo_big from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import './Footer.css'

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }) // 1s animation, triggers once
  }, [])

  return (
    <div className='footer' data-aos="fade-up">
        {/* Logo + Name */}
        <div className="footer-logo" data-aos="zoom-in">
            <img src={logo_big} alt="logo"/>
            <p>Mahesh Dona Pattal</p>
        </div>

        {/* Links */}
        <ul className='footer-links' data-aos="fade-up" data-aos-delay="200">
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>

        {/* Social Icons */}
<div className="footer-social-icon" data-aos="fade-up" data-aos-delay="400">
    <div className="footer-icons-container" data-aos="zoom-in" data-aos-delay="500">
        <a href="https://www.instagram.com/ayushjaiswal646" target="_blank" rel="noopener noreferrer">
            <img src={instagram_icon} alt="Instagram" />
        </a>
    </div>
    <div className="footer-icons-container" data-aos="zoom-in" data-aos-delay="600">
        <a href="https://www.pinterest.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <img src={pintester_icon} alt="Pinterest" />
        </a>
    </div>
    <div className="footer-icons-container" data-aos="zoom-in" data-aos-delay="700">
        <a href="https://wa.me/919001995951" target="_blank" rel="noopener noreferrer">
            <img src={whatsapp_icon} alt="WhatsApp" />
        </a>
    </div>
</div>


        {/* Copyright */}
        <div className="footer-copyright" data-aos="fade-up" data-aos-delay="800">
            <hr />
            <p>Copyright © 2025 - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
