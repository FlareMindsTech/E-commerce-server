import express from "express";
import {
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  getAllPayments
} from "../Controller/Payment.js";

const router = express.Router();

// Create payment
router.post("/create", createPayment);

// Get payment by ID
router.get("/Id/:id", getPaymentById);

// Update payment
router.put("/update/:id", updatePayment);

// Delete payment
router.delete("/delete/:id", deletePayment);

// Get all payments
router.get("/all", getAllPayments);

export default router;
