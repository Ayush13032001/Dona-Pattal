const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

// ✅ Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, new_price, old_price } = req.body;

    if (!name || !category || !new_price || !old_price || !req.file) {
      return res.status(400).json({
        success: false,
        error: "All fields including image are required",
      });
    }

    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const imageURL = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    const newProduct = new Product({
      id,
      name,
      category,
      new_price: Number(new_price),
      old_price: Number(old_price),
      image: imageURL,
    });

    await newProduct.save();

    res.json({
      success: true,
      message: "✅ Product saved",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ success: false, error: "Failed to save product" });
  }
};

// ✅ Remove Product (DB + Image)
exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await Product.findOneAndDelete({ id });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image file if exists
    if (deletedProduct.image) {
      const filename = deletedProduct.image.split("/images/")[1];
      const filePath = path.join(__dirname, "..", "upload", "images", filename);

      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠ Error deleting image file:", err);
        else console.log(`🗑 Deleted image file: ${filename}`);
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("❌ Error removing product:", error);
    res.status(500).json({ success: false, error: "Failed to remove product" });
  }
};

// ✅ Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};
// ✅ Get Popular Products (example: category = "plate")
exports.getPopularInPlate = async (req, res) => {
  try {
    const products = await Product.find({ category: "plate" }).limit(8);
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching popular products:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch popular products" });
  }
};

exports.getRecentProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);

  res.json(products);
};
