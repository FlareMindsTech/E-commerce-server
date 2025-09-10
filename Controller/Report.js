import Report from "../Models/Report.js";
import User from "../Models/User.js";

// Create Report
export const createReport = async (req, res) => {
  try {
    const { user, name, email, phone, message, label } = req.body;

    // Validate User
    const checkUser = await User.findById(user);
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const report = await Report.create({
      user,
      name,
      email,
      phone,
      message,
      label,
    });

    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Error creating report", error: error.message });
  }
};

// Get all Reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "name email");
    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// Get single Report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("user", "name email");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error: error.message });
  }
};

// Delete Report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error: error.message });
  }
};
