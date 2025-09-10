import express from "express";
<<<<<<< HEAD
import { registerUser, loginUser } from "../Controller/User.js";

const router = express.Router();

// Register
router.post("/register", registerUser);
=======
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
>>>>>>> f8700e0939da4fd5affbe482ae05bb2c90bef505

// Login
router.post("/login", loginUser);

export default router;
