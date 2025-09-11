import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controller/WishList.js";

const router = express.Router();

// Add to wishlist
router.post("/add", addToWishlist);

// Get all wishlist items of a user
router.get("/Id/:userId", getWishlist);

// Delete a single wishlist item
router.delete("/delete/:id", removeFromWishlist);


export default router;
