import User from "../Models/User.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const user = new User({ firstName, lastName, email, phone });
    await user.save();

    // Send password via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your Account Password",
      text: `Hello ${user.fullName},\n\nYour auto-generated password is: ${user._plainPassword}\n\nKeep it safe!`,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully. Password sent to your email.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
