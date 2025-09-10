import Wishlist from "../models/Wishlist.js";

// Add product to wishlist (toggle style)
export const addToWishlist = async (req, res) => {
  try {
    const { product_variant } = req.body;
    const userId = req.user._id;

    // check if already exists
    const exists = await Wishlist.findOne({ user: userId, product_variant });

    if (exists) {
      // toggle: remove if already in wishlist
      await Wishlist.findByIdAndDelete(exists._id);
      return res.status(200).json({
        success: true,
        message: "Removed from wishlist",
      });
    }

    const wishlist = new Wishlist({ user: userId, product_variant });
    await wishlist.save();

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get wishlist for a user
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.find({ user: userId })
      .populate({
        path: "product_variant",
        populate: { path: "product" }, // if productVariant has product reference
      });

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Remove product from wishlist by wishlistId
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params; // wishlist document _id
    const userId = req.user._id;

    const deleted = await Wishlist.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
