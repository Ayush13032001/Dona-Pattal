import React, { useState } from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault(); // Prevent page reload

    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Success
    setMessage(`Thanks for subscribing, ${email}!`);
    setEmail(''); // Clear input
  };

  return (
    <div className='newsletter' data-aos="fade-up">
      <h1 data-aos="fade-down">Get Exclusive Offers On Your Email</h1>
      <p data-aos="fade-right">Subscribe to our newsletter and stay updated</p>
      <form className="newsletter-form" onSubmit={handleSubscribe} data-aos="zoom-in">
        <input
          type="email"
          placeholder='Your Email Id'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
      {message && <p className='message'>{message}</p>}
    </div>
  );
};

export default NewsLetter;
