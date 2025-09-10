import CartItem from "../Models/CartItem.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { user_id, variant_id, quantity } = req.body;

    if (!user_id || !variant_id) {
      return res.status(400).json({ message: "user_id and variant_id are required" });
    }

    const existingItem = await CartItem.findOne({ user_id, variant_id });
    if (existingItem) {
      existingItem.quantity += quantity || 1;

      if (existingItem.quantity > 10) {
        return res.status(400).json({ message: "Quantity cannot exceed 10" });
      }

      await existingItem.save();
      return res.json({ message: "Cart updated", cartItem: existingItem });
    }

    const cartItem = await CartItem.create({
      user_id,
      variant_id,
      quantity: quantity || 1,
    });

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user_id: req.params.userId })
      .populate("variant_id", "name price stock"); // ✅ populate product fields
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    console.log("updateCartItem called:", { params: req.params, body: req.body });

    const { quantity } = req.body;
    if (typeof quantity === "undefined") {
      return res.status(400).json({ message: "Quantity is required in request body" });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be an integer >= 1" });
    }

    // optional business rule: max limit
    if (qty > 10) {
      return res.status(400).json({ message: "Quantity cannot exceed 10" });
    }

    // find then save (gives better validation/errors and triggers pre hooks)
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = qty;
    await cartItem.save();

    return res.json({ message: "Cart updated", cartItem });
  } catch (error) {
    console.error("updateCartItem error:", error);

    // helpful error responses
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid cart item id format" });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error" });
    }

    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete cart item
export const deleteCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
