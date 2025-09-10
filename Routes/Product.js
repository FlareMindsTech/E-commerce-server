import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controller/Product.js";

const router = express.Router();

// Create a new product
router.post("/create", createProduct);

// Get all products
router.get("/all", getAllProducts);

// Get product by ID
router.get("/Id/:id", getProductById);

// Update product
router.put("/update/:id", updateProduct);

// Delete product
router.delete("/delete/:id", deleteProduct);

export default router;
