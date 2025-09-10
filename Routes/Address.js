import express from "express";
import {
  createAddress,
  getAllAddresses,
  getUserAddresses,
  updateAddress,
  deleteAddress,
} from "../Controller/Address.js";

const router = express.Router();

// Create new address
router.post("/create", createAddress);

// Get all addresses
router.get("/all", getAllAddresses);

// Get addresses by user
router.get("/Id/:userId", getUserAddresses);

// Update address
router.put("/update/:id", updateAddress);

// Delete address
router.delete("/delete/:id", deleteAddress);

export default router;
