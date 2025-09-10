import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders
} from "../Controller/Order.js ";

const router = express.Router();

// Create order
router.post("/create", createOrder);

// Get order by ID
router.get("/Id/:id", getOrderById);

// Update order
router.put("/update/:id", updateOrder);

// Delete order
router.delete("/delete/:id", deleteOrder);

// Get all orders
router.get("/all", getAllOrders);

export default router;
