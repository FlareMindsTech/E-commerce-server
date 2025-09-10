import express from "express";
import { registerUser } from "../Controller/User.js";

const router = express.Router();

// Register Route
router.post("/register", registerUser);

export default router;
