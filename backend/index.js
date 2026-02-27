const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Routes
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

/* ------------------ MIDDLEWARE ------------------ */
app.use(express.json());
app.use(cors());

/* ------------------ UPLOAD DIR ------------------ */
const uploadDir = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/images", express.static(uploadDir));

/* ------------------ DB ------------------ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ------------------ USER MODEL ------------------ */
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  otp: String,
  otpExpires: Date,
  date: { type: Date, default: Date.now },
});

/* ------------------ AUTH MIDDLEWARE ------------------ */
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/* ------------------ EMAIL SETUP ------------------ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ------------------ AUTH ROUTES ------------------ */
// Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await Users.findOne({ email });
  if (exists)
    return res.json({ success: false, error: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  const user = new Users({
    name: username,
    email,
    password: hashed,
    cartData: cart,
    otp,
    otpExpires,
  });

  await user.save();

  // Send OTP
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Signup",
    html: `<h3>Your OTP is <b>${otp}</b>. Expires in 5 minutes.</h3>`,
  });

  res.json({ success: true, message: "Signup successful. OTP sent." });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) return res.json({ success: false, error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, error: "Invalid password" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Login",
    html: `<h3>Your OTP is <b>${otp}</b>. Expires in 5 minutes.</h3>`,
  });

  res.json({ success: true, message: "OTP sent for login" });
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await Users.findOne({ email });
  if (!user) return res.json({ success: false, error: "User not found" });

  if (user.otp !== otp || user.otpExpires < new Date())
    return res.json({ success: false, error: "Invalid or expired OTP" });

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ success: true, token });
});

// Resend OTP
app.post("/resend-otp", async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user) return res.json({ success: false, error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Resent OTP",
    html: `<h3>Your OTP is <b>${otp}</b>. Expires in 5 minutes.</h3>`,
  });

  res.json({ success: true, message: "OTP resent successfully" });
});

/* ------------------ CART ------------------ */
app.post("/addtocart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  user.cartData[req.body.itemId]++;
  await user.save();
  res.json({ success: true });
});

app.post("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

/* ------------------ PAYMENT SETUP ------------------ */
let razorpay = null;
if (process.env.USE_FAKE_PAYMENT !== "true" && process.env.RAZORPAY_KEY_ID) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay Enabled");
} else console.log("⚠️ Fake Payment Mode ON");

app.post("/payment/process", async (req, res) => {
  if (process.env.USE_FAKE_PAYMENT === "true")
    return res.json({
      success: true,
      fake: true,
      order: { id: "order_fake_" + Date.now(), amount: req.body.amount * 100 },
    });

  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: "INR",
  });
  res.json({ success: true, order });
});

app.post("/payment/verify", async (req, res) => {
  if (process.env.USE_FAKE_PAYMENT === "true")
    return res.json({ success: true, fake: true });

  const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  res.json({ success: expected === req.body.razorpay_signature });
});

/* ------------------ OTHER ROUTES ------------------ */
app.use("/payment", paymentRoutes);
app.use("/", productRoutes);

app.get("/", (req, res) => res.send("🚀 Backend Running"));

/* ------------------ START SERVER ------------------ */
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`),
);
