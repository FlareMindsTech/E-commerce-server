import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  deleteCartItem,
} from "../Controller/CartItem.js";

const router = express.Router();

// Add item to cart
router.post("/create", addToCart);

// Get user cart
router.get("/Id/:userId", getUserCart);

// Update cart item quantity
router.put("/update/:id", updateCartItem);

// Delete cart item
router.delete("/delete/:id", deleteCartItem);

export default router;
