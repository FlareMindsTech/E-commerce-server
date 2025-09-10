import Product from "../Models/Product.js";
import Category from "../Models/Category.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { category, name, description, images, sku, stock, price, status } = req.body;

    // check category exists
    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingSku) return res.status(400).json({ message: "SKU already exists" });

    const product = await Product.create({
      category,
      name,
      description,
      images,
      sku,
      stock,
      price,
      status,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { category, name, description, images, sku, stock, price, status } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check category if updated
    if (category && category !== product.category.toString()) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ message: "Category not found" });
      product.category = category;
    }

    if (sku && sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
      if (existingSku) return res.status(400).json({ message: "SKU already exists" });
      product.sku = sku.toUpperCase();
    }

    Object.assign(product, { name, description, images, stock, price, status });
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
