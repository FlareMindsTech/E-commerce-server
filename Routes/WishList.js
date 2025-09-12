import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controller/WishList.js";

const router = express.Router();

// Add to wishlist (user only)
router.post("/add", addToWishlist);

// Get wishlist for the logged-in user
router.get("/me", getWishlist);

// Get wishlist for a specific user (admin usage)
router.get("/:userId", getWishlist);

// Delete a single wishlist item (user only)
router.delete("/delete/:id", removeFromWishlist);


export default router;
