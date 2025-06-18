import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUserRole,
} from "../controllers/userController.js";
import {
  authenticateToken,
  requireAdmin,
  requireAdminOrSelf,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authenticateToken, getUserProfile);

// Admin only routes
router.get("/users", authenticateToken, requireAdmin, getAllUsers);
router.put(
  "/users/:userId/role",
  authenticateToken,
  requireAdmin,
  updateUserRole
);

export default router;
