import jwt from "jsonwebtoken";
import User from "../Models/User.js"; // make sure the path is correct

// Verify token
export const Auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }
    req.user = decoded; // decoded contains { id, role }
    next();
  });
};

// Role-based authorization
export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
        return res.status(403).json({ message: `Access denied: ${allowedRoles.join(", ")} only` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};
