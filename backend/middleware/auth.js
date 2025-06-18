import jwt from "jsonwebtoken";
import User from "../model/user.js";

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );
    const user = await User.findById(decoded.userId, "-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Check if user is admin or accessing their own data
export const requireAdminOrSelf = (req, res, next) => {
  const targetUserId = req.params.userId || req.params.id;

  if (req.user.role === "admin" || req.user._id.toString() === targetUserId) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};
