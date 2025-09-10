import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  deleteReport,
} from "../Controller/Report.js";

const router = express.Router();

// POST → Create a new report
router.post("/create", createReport);

// GET → Get all reports
router.get("/all", getReports);

// GET → Get single report by ID
router.get("/Id/:id", getReportById);

// DELETE → Delete a report by ID
router.delete("/delete/:id", deleteReport);

export default router;
