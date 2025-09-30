const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { addProduct, removeProduct, getAllProducts } = require("../controllers/productController");

// Add product with image upload
router.post("/addproduct", upload.single("image"), addProduct);

// Remove product
router.post("/removeproduct", removeProduct);

// Get all products
router.get("/allproducts", getAllProducts);

module.exports = router;
