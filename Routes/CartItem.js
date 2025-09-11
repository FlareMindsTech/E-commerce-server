import express from "express";
import {
  addToCart,
  getAllCartItems,
  getUserCart,
  updateCartItem,
  deleteCartItem,
} from "../Controller/CartItem.js";

const router = express.Router();

// Add item to cart
router.post("/create", addToCart);

// Get all cart items
router.get("/all", getAllCartItems);

// Get user cart
router.get("/user/:userId", getUserCart);

// Update cart item quantity
router.put("/update/:id", updateCartItem);

// Delete cart item
router.delete("/delete/:id", deleteCartItem);

export default router;
