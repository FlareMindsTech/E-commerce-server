// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import User from "../Models/User.js";
// import nodemailer from "nodemailer";

// // Generate JWT
// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
// };

// // Nodemailer transporter

// export const transporter =  nodemailer.createTransport({
//   host: process.env.SMTP_HOST,      // smtp.gmail.com
//    // 587
//   secure: false,                     // true for 465, false for 587
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,    // App password
//   },
// });

// transporter.verify((err, success) => {
//   if (err) console.log("SMTP Connection Error: ", err);
//   else console.log("SMTP Connected Successfully");
  

// });


// // ---------------- CONTROLLERS ----------------

// // Register
// export const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, phone, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     let user = await User.findOne({ email });

//     // If user exists and verified
//     if (user && user.isVerified) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // If user exists but NOT verified, resend verification email
//     if (user && !user.isVerified) {
//       const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       const verifyURL = `http://localhost:7000/api/users/verify/${verifyToken}`;

//       await transporter.sendMail({
//         from: `"Boutique Auth" <${process.env.SMTP_USER}>`,
//         to: user.email,
//         subject: "Verify Your Email (Resent)",
//         text: `Click here to verify your account: ${verifyURL}`,
//       });

//       return res.status(200).json({ message: "Verification email resent. Check your inbox." });
//     }

//     // If user does not exist, create new
//     user = await User.create({ firstName, lastName, phone, email, password });

//     const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     const verifyURL = `http://localhost:7000/api/users/verify/${verifyToken}`;

//     await transporter.sendMail({
//       from: `"Boutique Auth" <${process.env.SMTP_USER}>`,
//       to: user.email,
//       subject: "Verify Your Email",
//       text: `Click here to verify your account: ${verifyURL}`,
//     });

//     res.status(201).json({ message: "Registered successfully. Check email for verification." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

























// // Verify
// export const verifyUser = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(400).json({ message: "Invalid token" });

//     user.isVerified = true;
//     await user.save();

//     res.json({ message: "Account verified successfully" });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// };

// // Login
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) return res.status(400).json({ message: "Invalid email or password" });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

//     if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

//     const token = generateToken(user._id, user.role);
//     res.json({ token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Forgot Password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

//     user.resetPasswordToken = resetTokenHash;
//     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const resetURL = `http://localhost:7000/api/users/reset-password/${resetToken}`;

//     await transporter.sendMail({
//       from: `"Boutique Auth" <${process.env.SMTP_USER}>`,
//       to: user.email,
//       subject: "Password Reset",
//       text: `Click here to reset your password: ${resetURL}`,
//     });

//     res.json({ message: "Password reset link sent" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Reset Password
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: resetTokenHash,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Admin-only
// export const adminOnly = async (req, res) => {
//   res.json({ message: "Welcome Admin! Only admins can see this." });
// };


import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../Models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ---------------- CONTROLLERS ----------------

// Register
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (!user) {
      user = await User.create({ firstName, lastName, phone, email, password });
    }

    // Generate verification token
    const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verifyURL = `http://localhost:7000/api/users/verify/${verifyToken}`;

    await sendEmail(
      user.email,
      "Verify Your Email",
      `Click here to verify your account: ${verifyURL}`
    );

    res.status(201).json({ message: "Registered successfully. Check email for verification." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify
export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

    const token = generateToken(user._id, user.role);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetURL = `http://localhost:7000/api/users/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `Click here to reset your password: ${resetURL}`
    );

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin-only route
export const adminOnly = async (req, res) => {
  res.json({ message: "Welcome Admin! Only admins can see this." });
};

