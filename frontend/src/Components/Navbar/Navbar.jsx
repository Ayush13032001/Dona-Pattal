import React, { useContext, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/p2.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out" });
  }, []);

  const menuItems = ["home", "plate", "paper", "glass", "allproduct", "contactus"];

  // 👇 Determine active menu from current URL
  const currentPath = location.pathname === "/" ? "home" : location.pathname.slice(1);

  return (
    <div className='navbar' data-aos="fade-down">
      {/* Logo */}
      <div className="nav-logo" data-aos="zoom-in" data-aos-delay="200">
        <img src={logo} alt="Logo" />
      </div>

      {/* Menu Items */}
      <ul className='nav-menu' data-aos="fade-down" data-aos-delay="400">
        {menuItems.map((item) => (
          <li key={item}>
            <Link style={{ textDecoration: 'none' }} to={item === "home" ? "/" : `/${item}`}>
              <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
            </Link>
            {currentPath === item && <hr />}
          </li>
        ))}
      </ul>

      {/* Login + Cart */}
      <div className="nav-login-cart" data-aos="fade-left" data-aos-delay="600">
        {localStorage.getItem('auth-token') ? (
          <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>
            <span>Logout</span>
          </button>
        ) : (
          <Link to='/login'>
            <button><span>Login</span></button>
          </Link>
        )}
        <Link to='/cart'><img src={cart_icon} alt="Cart" /></Link>
        <div className="nav-login-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
