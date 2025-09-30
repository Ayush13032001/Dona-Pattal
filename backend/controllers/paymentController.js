// controllers/paymentController.js
exports.getKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_API_KEY, // only Key ID, never secret
    });
  } catch (err) {
    console.error("❌ Error fetching Razorpay key:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch Razorpay API key",
    });
  }
};
