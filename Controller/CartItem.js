import CartItem from "../Models/CartItem.js";
import mongoose from "mongoose";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { user_id, product, quantity } = req.body;

    // Validation
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid or missing user_id" });
    }
    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ message: "Invalid or missing product id" });
    }
    const qty = quantity ? parseInt(quantity) : 1;
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const existingItem = await CartItem.findOne({ user_id, product });
    if (existingItem) {
      existingItem.quantity += qty;
      await existingItem.save();
      return res.json({ message: "Cart updated", cartItem: existingItem });
    }

    const cartItem = await CartItem.create({ user_id, product, quantity: qty });
    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cart items (for admin or testing)
export const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find()
      .populate("user_id", "name email") // populate user info (select name, email)
      .populate("product", "name price"); // populate product info (select name, price)

    res.json({
      success: true,
      count: cartItems.length,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const cartItems = await CartItem.find({ user_id: userId }).populate("product");
    res.json({ success: true, count: cartItems.length, data: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item id" });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const cartItem = await CartItem.findByIdAndUpdate(
      id,
      { quantity: qty },
      { new: true, runValidators: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete cart item
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item id" });
    }

    const cartItem = await CartItem.findByIdAndDelete(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
