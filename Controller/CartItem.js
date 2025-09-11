import CartItem from "../Models/CartItem.js";

export const addToCart = async (req, res) => {
  try {
    const { user_id, product, quantity } = req.body;

    const existingItem = await CartItem.findOne({ user_id, product });
    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.json({ message: "Cart updated", cartItem: existingItem });
    }

    const cartItem = await CartItem.create({ user_id, product, quantity });
    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user_id: req.params.userId }).populate("product");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(req.params.id, { quantity }, { new: true, runValidators: true });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Cart updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
