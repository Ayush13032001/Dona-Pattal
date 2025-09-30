import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './CSS/LoginSignup.css';

// ✅ React-Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        toast.success("✅ Login successful");
        setTimeout(() => window.location.replace("/"), 1500);
      } else {
        toast.error(data.error || "❌ Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("⚠️ Server error during login");
    }
  };

  const signup = async () => {
    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        toast.success("🎉 Signup successful");
        setTimeout(() => window.location.replace("/"), 1500);
      } else {
        toast.error(data.error || "❌ Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("⚠️ Server error during signup");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="loginsignup">
      <div className="loginsignup-container" data-aos="zoom-in">
        <h1 data-aos="fade-down">{state}</h1>
        <div className="loginsignup-feilds" data-aos="fade-up">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          data-aos="flip-up"
          onClick={() => (state === "Login" ? login() : signup())}
        >
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="loginsingnup-login" data-aos="fade-right">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsingnup-login" data-aos="fade-right">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree" data-aos="fade-left">
          <input type="checkbox" />
          <p>By Continue, I Agree to the terms of use & privacy policy.</p>
        </div>
      </div>

      {/* ✅ Toastify container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default LoginSignup;
