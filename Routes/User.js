import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
  adminOnly
 
} from "../Controller/User.js";

import { Auth, authorizeRoles } from "../Middleware/Auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
// router.post("/login", loginUser);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// Protected + role-based
// router.get("/admin-only", Auth, authorizeRoles("admin"), adminOnly);

export default router;
