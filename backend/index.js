// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const paymentRoutes = require("./routes/paymentRoutes");
require("dotenv").config();


// ----------------------
// RAZORPAY INSTANCE
// ----------------------
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// ----------------------
// ROUTES & MODELS
// ----------------------
const productRoutes = require("./routes/productRoutes");
const Product = require("./models/Product");

const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// ----------------------
// APP INIT
// ----------------------
const app = express();
const port = process.env.PORT || 4000;

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(express.json());
app.use(cors());

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Serve images statically
app.use("/images", express.static(uploadDir));

// ----------------------
// FETCH USER MIDDLEWARE
// ----------------------
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// ----------------------
// MONGODB CONNECTION
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------------
// SIGNUP
// ----------------------
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Existing user found with the same email address",
      });
    }

    const cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);

    const user = new Users({
      name: username,
      email,
      password: hashedPassword,
      cartData: cart,
    });

    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ----------------------
// LOGIN
// ----------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ success: false, error: "Wrong Email Id" });
    }

    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.json({ success: false, error: "Wrong Password" });
    }

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ----------------------
// NEW COLLECTION
// ----------------------
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(-8); // last 8 products
  res.send(newcollection);
});

// ----------------------
// POPULAR IN WOMEN
// ----------------------
app.get("/popularinplate", async (req, res) => {
  let products = await Product.find({ category: "plate" });
  let popular_in_women = products.slice(0, 4);
  res.send(popular_in_women);
});

// ----------------------
// CART ENDPOINTS
// ----------------------
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] =
    (userData.cartData[req.body.itemId] || 0) + 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

app.post("/getcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData.cartData);
  } catch (err) {
    console.error("❌ Error fetching cart data:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------
// PAYMENT ENDPOINT
// ----------------------
app.post("/payment/process", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ Razorpay Error:", err);
    res.status(500).json({ success: false, error: "Payment initiation failed" });
  }
});



//RAZORPAY_KEY API

app.use("/", paymentRoutes);




// VERIFY PAYMENT
app.post("/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ success: false, error: "Verification failed" });
  }
});



// ----------------------
// OTHER ROUTES
// ----------------------
app.use("/", productRoutes);

// Test route
app.get("/", (req, res) => res.send("Express App is running 🚀"));

// ----------------------
// START SERVER
// ----------------------
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
