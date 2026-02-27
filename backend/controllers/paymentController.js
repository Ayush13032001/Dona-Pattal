exports.getKey = async (req, res) => {
  res.json({
    success: true,
    key:
      process.env.USE_FAKE_PAYMENT === "true"
        ? "rzp_test_fake_key"
        : process.env.RAZORPAY_KEY_ID,
  });
};

exports.fakePaymentSuccess = async (req, res) => {
  res.status(200).json({
    success: true,
    fake: true,
    message: "Payment Successful (FAKE)",
    paymentId: "pay_fake_" + Date.now(),
    orderId: "order_fake_" + Date.now(),
  });
};
