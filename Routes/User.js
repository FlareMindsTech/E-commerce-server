import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getAll
} from "../Controller/User.js";

import { Auth, authorizeRoles } from "../Middleware/Auth.js";

const router = express.Router();

// ---------- Public Routes ----------
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/all", getAll);        // Get all users
router.get("/byId:id", getUserById);    // Get user by ID

// ---------- Protected Routes ----------
router.get("/users", getAllUsers);


// Update user (Admin &
router.put("/update/:id", updateUser);

// Delete user (Admin & Superadmin only)
router.delete("/delete/:id", deleteUser);

// Admin Only Test Route

export default router;
