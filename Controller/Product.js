import Category from "../Models/Category.js";
import Product from "../Models/Product.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { category, name, description, images, status, variants } = req.body;

    // Validate category exists
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: "Product name already exists" });
    }

    // Check duplicate SKUs in variants
    if (variants && variants.length > 0) {
      for (let v of variants) {
        const existingSku = await Product.findOne({ "variants.sku": v.sku });
        if (existingSku) {
          return res.status(400).json({ success: false, message: `SKU ${v.sku} already exists` });
        }
      }
    }

    const product = await Product.create({
      category,
      name,
      description,
      images,
      status: status || "active",
      variants: variants || []
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { name: regex },
        { description: regex },
        { "variants.sku": regex },
        { "variants.color": regex },
        { "variants.size": regex },
        // price is numeric, so convert search to number if possible
        { "variants.price": isNaN(search) ? -1 : Number(search) }
      ];
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { category, name, description, images, status, variants } = req.body;

    // If category provided, check it exists
    if (category) {
      const cat = await Category.findById(category);
      if (!cat) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
    }

    // Check duplicate SKUs in variants
    if (variants && variants.length > 0) {
      for (let v of variants) {
        const existingProduct = await Product.findOne({
          "variants.sku": v.sku,
          _id: { $ne: req.params.id }
        });
        if (existingProduct) {
          return res.status(400).json({ success: false, message: `SKU ${v.sku} already exists` });
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { category, name, description, images, status, variants },
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Decrease stock for a variant
export const decreaseStock = async (req, res) => {
  try {
    const { productId, variantSku, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items left in stock for ${variantSku}`,
      });
    }

    variant.stock -= quantity;
    await product.save();

    res.json({
      success: true,
      message: `Stock decreased by ${quantity} for ${variantSku}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increase stock for a variant
export const increaseStock = async (req, res) => {
  try {
    const { productId, variantSku, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    variant.stock += quantity;
    await product.save();

    res.json({
      success: true,
      message: `Stock increased by ${quantity} for ${variantSku}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
