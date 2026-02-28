// src/Pages/Payment.jsx
import React, { useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import "./CSS/Payment.css";

const Payment = () => {
  const { getTotalCartAmount } = useContext(ShopContext);

  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    name: userFromStorage.name || "",
    email: userFromStorage.email || "",
    mobile: userFromStorage.mobile || "",
    address: "",
    paymentMethod: "card",
    upiId: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fakePaymentHandler = async () => {
    if (!form.name || !form.email || !form.mobile || !form.address) {
      return alert("Please fill all required fields");
    }

    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setSuccess(true);

      // Fake email API
      await fetch("http://localhost:4000/payment/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          amount: getTotalCartAmount(),
        }),
      });
    }, 2000);
  };

  if (success) {
    return (
      <div className="payment-success">
        <h1>🎉 Order Confirmed!</h1>
        <p>Confirmation email sent to</p>
        <b>{form.email}</b>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h1>Checkout</h1>
      <div className="payment-form">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email ID"
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
        />

        <h3>Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={form.paymentMethod === "card"}
            onChange={handleChange}
          />{" "}
          Credit / Debit Card
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="upi"
            onChange={handleChange}
          />{" "}
          UPI
        </label>
        {form.paymentMethod === "upi" && (
          <input
            name="upiId"
            placeholder="Enter UPI ID"
            value={form.upiId}
            onChange={handleChange}
          />
        )}
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            onChange={handleChange}
          />{" "}
          Cash on Delivery
        </label>

        <h2>Total: ₹{getTotalCartAmount()}</h2>
        <button onClick={fakePaymentHandler} disabled={loading}>
          {loading ? "Processing Payment..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
