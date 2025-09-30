import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);

  // 👇 Razorpay Checkout
  const checkoutHandler = async () => {
    try {
      // 1. Get Razorpay key from backend
      const { key } = await fetch("http://localhost:4000/getkey").then((res) =>
        res.json()
      );

      // 2. Create order from backend
      const { order } = await fetch("http://localhost:4000/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getTotalCartAmount(), // total amount in Rs
        }),
      }).then((res) => res.json());

      // 3. Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Mahesh Dona Pattal",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // 4. Verify payment on backend
          const verifyRes = await fetch("http://localhost:4000/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }).then((res) => res.json());

          if (verifyRes.success) {
            alert("✅ Payment Successful!");
          } else {
            alert("❌ Payment Verification Failed");
          }
        },
        prefill: {
          name: "Ayush Jaiswal", // optional: you can take from logged-in user
          email: "ayushjaiswal.madz1303@gmail.com",
          contact: "9001995951",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Checkout Error:", err);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format">
                <img
                  src={e.image}
                  alt={e.name}
                  className="carticon-product-icon"
                />
                <p>{e.name}</p>
                <p>Rs {e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>Rs {e.new_price * cartItems[e.id]}</p>
                <img
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="Remove"
                  className="cart-remove-icon"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-tatal">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Rs {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-iteem">
              <h3>Total</h3>
              <h3>Rs {getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={checkoutHandler}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="caritems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
