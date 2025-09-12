import mongoose from "mongoose";
import Wishlist from "../Models/Wishlist.js";

// Add product to wishlist (toggle style)
export const addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    const userId = req.user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user ID" });
    }
    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ success: false, message: "Invalid or missing product ID" });
    }

    const exists = await Wishlist.findOne({ user: userId, product });

    if (exists) {
      // toggle: remove if already in wishlist
      await Wishlist.findByIdAndDelete(exists._id);
      return res.status(200).json({ success: true, message: "Removed from wishlist" });
    }

    const wishlist = new Wishlist({ user: userId, product });
    await wishlist.save();

    res.status(201).json({ success: true, message: "Added to wishlist", data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get wishlist for user (self or admin)
export const getWishlist = async (req, res) => {
  try {
    // If admin route is hit, use param; otherwise fallback to logged-in user
    const userId = req.params.userId || req.user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user ID" });
    }

    const wishlist = await Wishlist.find({ user: userId })
      .populate({
        path: "product",
        populate: { path: "category" },
      });

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Remove product from wishlist by wishlistId
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing wishlist ID" });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user ID" });
    }

    const deleted = await Wishlist.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Wishlist item not found" });
    }

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
