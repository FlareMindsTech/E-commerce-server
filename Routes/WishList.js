import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../Controller/WishList.js";

import { Auth } from "../Middleware/Auth.js";

const router = express.Router();

// Add to wishlist
router.post("/add", Auth, addToWishlist);

// Get wishlist of logged-in user
router.get("/all", Auth, getWishlist);

// Delete wishlist item
router.delete("/delete/:id", Auth, removeFromWishlist);

export default router;
