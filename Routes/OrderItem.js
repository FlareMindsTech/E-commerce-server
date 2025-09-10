import express from "express";
import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
} from "../Controller/OrderItem.js";

const router = express.Router();

router.post("/create", createOrderItem);          // Create
router.get("/all", getAllOrderItems);          // Get all
router.get("/Id/:id", getOrderItemById);       // Get one
router.put("/update/:id", updateOrderItem);        // Update
router.delete("/delete/:id", deleteOrderItem);     // Delete

export default router;
