// src/App.jsx
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";

// Ecommerce imports
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ContactUs from "./Pages/ContactUs";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import ShopCategory from "./Pages/ShopCategory";
import AllProduct from "./Pages/AllProduct";
import banner_mens from "./Components/Assets/banner_mens.png";
import banner_kids from "./Components/Assets/banner_kids.png";
import banner_women from "./Components/Assets/banner_women.png";
import OtpPage from "./Pages/OtpPage.jsx";
import Payment from "./Pages/Payment.jsx";

// Chatbot imports
import ChatbotIcon from "./Components/ChatbotIcon";
import Chatform from "./Components/Chatform.jsx";
import ChatMessage from "./Components/ChatMessage.jsx";
import { companyInfo } from "./companyInfo.js";

// ProtectedRoute
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

// Loader component (for chatbot)
export const DotLoader = () => (
  <span className="dot-loader">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>
);

// ✅ Wrapper to handle Navbar/Footer conditionally
const AppWrapper = () => {
  const location = useLocation();

  // Hide Navbar/Footer for login and OTP
  const hideNavFooter = ["/login", "/verify-otp"].includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/plate"
          element={<ShopCategory banner={banner_mens} category="plate" />}
        />
        <Route
          path="/paper"
          element={<ShopCategory banner={banner_women} category="paper" />}
        />
        <Route
          path="/glass"
          element={<ShopCategory banner={banner_kids} category="glass" />}
        />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/allproduct" element={<AllProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/products/:productId" element={<Products />} />
        <Route path="/verify-otp" element={<OtpPage />} />

        {/* Protected Payment Route */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
};

function App() {
  // ✅ Ecommerce animation init
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Chatbot states
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", text: companyInfo },
  ]);
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatBot] = useState(false);

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error?.message || "Something went wrong!");

      const apiText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiText);
    } catch (err) {
      console.error(err.message);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.isLoader
            ? { role: "model", text: "Oops! Something went wrong." }
            : msg,
        ),
      );
    }
  };

  // Auto-scroll chatbot
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>

      {/* Chatbot Floating Widget */}
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button
          onClick={() => setShowChatBot((prev) => !prev)}
          id="chatbot-toggler"
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "29px", fontVariationSettings: "'FILL' 1" }}
          >
            mode_comment
          </span>
          <span className="material-symbols-rounded">close</span>
        </button>

        <div className="chatbot-popup">
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">Chatbot</h2>
            </div>
            <button
              onClick={() => setShowChatBot((prev) => !prev)}
              className="material-symbols-rounded"
            >
              keyboard_arrow_down
            </button>
          </div>

          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hey there 👋
                <br /> How can I help you today?
              </p>
            </div>

            {chatHistory.map((chat, i) => (
              <ChatMessage key={i} chat={chat} />
            ))}
          </div>

          <div className="chat-footer">
            <Chatform
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
