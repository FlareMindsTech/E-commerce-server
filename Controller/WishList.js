import Wishlist from "../Models/WishList.js";

// ✅ Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;

    // Prevent duplicates
    const existing = await Wishlist.findOne({ user, product });
    if (existing) {
      return res.status(200).json({ message: "Already in wishlist", data: existing });
    }

    const wishlistItem = new Wishlist({ user, product });
    await wishlistItem.save();

    res.status(201).json({ message: "Added to wishlist", data: wishlistItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get wishlist for a user
export const getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ user: userId })
      .populate({
        path: "product",
        populate: { path: "product", model: "Product" } // only if ProductVariant has product ref
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Remove one item from wishlist
export const deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Wishlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Clear wishlist of a user
export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    await Wishlist.deleteMany({ user: userId });
    res.status(200).json({ message: "Cleared wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
