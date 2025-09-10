import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../Controller/Category.js";

const router = express.Router();

// Create a new category
router.post("/create", createCategory);

// Get all categories
router.get("/all", getAllCategories);

// Get category by ID
router.get("/Id/:id", getCategoryById);

// Update category
router.put("/update/:id", updateCategory);

// Delete category
router.delete("/delete/:id", deleteCategory);

export default router;
