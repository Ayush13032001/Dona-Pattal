import React from 'react';
import './CSS/ContactUs.css';
import whatsapp_icon from '../Components/Assets/whatsapp_icon.png';
import gmail from '../Components/Assets/gmail.png';

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <p>We’re here to help! Reach out to us via WhatsApp or Email:</p>

      <div className="contact-buttons">
        {/* WhatsApp */}
        <a 
          href="https://wa.me/919001995951?text=Hello!%20I%20have%20a%20query%20about%20my%20order" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <button className="contact-btn whatsapp-btn">
            <img src={whatsapp_icon} alt="WhatsApp" className="icon" /> Chat on WhatsApp
          </button>
        </a>

        {/* Email */}
        <a 
          href="mailto:ayushjaiswal.madz1303@gmail.com?subject=Query%20from%20website&body=Hello!%20I%20have%20a%20question" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <button className="contact-btn email-btn">
            <img src={gmail} alt="Email" className="icon" /> Send Email
          </button>
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
