import express from "express";
import {
  addToWishlist,
  getWishlistByUser,
  deleteWishlistItem,
  clearWishlist
} from "../Controller/WishList.js";

const router = express.Router();

// Add to wishlist
router.post("/add", addToWishlist);

// Get all wishlist items of a user
router.get("/Id/:userId", getWishlistByUser);

// Delete a single wishlist item
router.delete("/delete/:id", deleteWishlistItem);

// Clear all wishlist items of a user
router.delete("/clear/:userId", clearWishlist);

export default router;
