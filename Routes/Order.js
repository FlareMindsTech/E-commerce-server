import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
} from "../Controller/Order.js";
import { Auth } from "../Middleware/Auth.js";

const router = express.Router();

// Create order (any logged-in user)
router.post("/create", Auth, createOrder);

// Get order by ID
router.get("/byId/:id", Auth, getOrderById);

// Update order (any logged-in user, restricted in controller)
router.put("/update/:id", Auth, updateOrder);

// Delete order (admin only)
router.delete("/delete/:id", Auth, deleteOrder);

// Get all orders (search + pagination + role-based)
router.get("/all", Auth, getAllOrders);

export default router;
