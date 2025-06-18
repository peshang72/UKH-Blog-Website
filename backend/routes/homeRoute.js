import express from "express";
import {
  postBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  getAllBlogsAdmin,
  getUserBlogs,
  deleteBlogAdmin,
} from "../controllers/blogController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlogById);

// Protected routes (require authentication)
router.post("/post-blog", authenticateToken, postBlog);
router.put("/blogs/:id", authenticateToken, updateBlog);
router.delete("/blogs/:id", authenticateToken, deleteBlog);
router.get("/user/blogs", authenticateToken, getUserBlogs);

// Admin only routes
router.get(
  "/admin/blogs/pending",
  authenticateToken,
  requireAdmin,
  getPendingBlogs
);
router.get("/admin/blogs", authenticateToken, requireAdmin, getAllBlogsAdmin);
router.put(
  "/admin/blogs/:id/approve",
  authenticateToken,
  requireAdmin,
  approveBlog
);
router.put(
  "/admin/blogs/:id/reject",
  authenticateToken,
  requireAdmin,
  rejectBlog
);
router.delete(
  "/admin/blogs/:id",
  authenticateToken,
  requireAdmin,
  deleteBlogAdmin
);

export default router;
