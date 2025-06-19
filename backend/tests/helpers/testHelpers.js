import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../model/user.js";
import Blog from "../../model/blog.js";

// Helper to create a test user
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    role: "user",
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

// Helper to create an admin user
export const createTestAdmin = async (userData = {}) => {
  const defaultAdmin = {
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  };

  const admin = new User({ ...defaultAdmin, ...userData });
  await admin.save();
  return admin;
};

// Helper to generate JWT token
export const generateToken = (userId, role = "user") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "test-jwt-secret-key", {
    expiresIn: "1h",
  });
};

// Helper to create a test blog
export const createTestBlog = async (authorId, blogData = {}) => {
  const defaultBlog = {
    title: "Test Blog Title",
    blogDescription: "This is a test blog description",
    content:
      "This is the main content of the test blog post. It contains detailed information about the topic.",
    author: authorId,
    category: "Technology",
    imgCaption: "Test image caption",
    status: "approved",
  };

  const blog = new Blog({ ...defaultBlog, ...blogData });
  await blog.save();
  return blog;
};

// Helper to hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};
