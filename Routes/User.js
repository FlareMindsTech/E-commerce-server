import express from "express";
import { 
  createUser, 
  loginUser,   // ✅ import login controller
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
}from "../Controller/User.js";

const router = express.Router();

// Auth routes
router.post("/create", createUser);  // Register
router.post("/login", loginUser);    // ✅ Login

// User CRUD routes
router.get("/all", getAllUsers);
router.get("/id/:id", getUserById);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
