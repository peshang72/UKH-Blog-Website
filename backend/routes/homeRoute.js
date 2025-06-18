import express from "express";
import {
  postBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlogById);

// Protected routes (require authentication)
router.post("/post-blog", authenticateToken, postBlog);
router.put("/blogs/:id", authenticateToken, updateBlog);
router.delete("/blogs/:id", authenticateToken, deleteBlog);

export default router;
