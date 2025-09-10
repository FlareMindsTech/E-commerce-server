import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { authMiddleware } from "../middlewares/auth.js"; // your auth middleware

const router = express.Router();

router.post("/", authMiddleware, addToWishlist);         // Add product
router.get("/", authMiddleware, getWishlist);            // Get wishlist
router.delete("/:id", authMiddleware, removeFromWishlist); // Remove product

export default router;
