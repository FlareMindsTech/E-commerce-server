import express from "express";
import {
  addRecentViewed,
  getRecentViewedByUser,
  deleteRecentViewed,
  clearRecentViewed,
} from "../Controller/RecentlyViewed.js";

const router = express.Router();

// POST → add/update recent viewed
router.post("/add", addRecentViewed);

// GET → all recent viewed for user
router.get("/Id/:userId", getRecentViewedByUser);

// DELETE → one recent viewed entry
router.delete("/delete/:id", deleteRecentViewed);

// DELETE → clear all of a user
router.delete("/clear/:userId", clearRecentViewed);

export default router;
