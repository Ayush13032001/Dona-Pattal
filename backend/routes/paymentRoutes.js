// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { getKey } = require("../controllers/paymentController");

router.get("/getkey", getKey);

module.exports = router;
