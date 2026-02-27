const express = require("express");
const router = express.Router();
const {
  getKey,
  fakePaymentSuccess,
} = require("../controllers/paymentController");

router.get("/getkey", getKey);
router.post("/fake-success", fakePaymentSuccess);

module.exports = router;
