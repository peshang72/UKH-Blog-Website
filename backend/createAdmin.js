import mongoose from "mongoose";
import User from "./model/user.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ubw_blog"
    );
    console.log("Connected to MongoDB");

    // Check if admin already exists by email or username
    const existingAdminByEmail = await User.findOne({
      email: "admin@ukh.edu.krd",
    });
    const existingAdminByUsername = await User.findOne({ username: "admin" });

    if (existingAdminByEmail) {
      console.log("Admin user with email admin@ukh.edu.krd already exists");
      console.log("Current admin details:");
      console.log(
        `- Name: ${existingAdminByEmail.firstName} ${existingAdminByEmail.lastName}`
      );
      console.log(`- Username: ${existingAdminByUsername.username}`);
      console.log(`- Email: ${existingAdminByEmail.email}`);
      console.log(`- Role: ${existingAdminByEmail.role}`);
      process.exit(0);
    }

    if (existingAdminByUsername) {
      console.log(
        "Username 'admin' is already taken. Creating admin with different username..."
      );

      // Create admin user with different username
      const adminUser = new User({
        firstName: "Admin",
        lastName: "User",
        username: "admin_user", // Different username
        email: "admin@ukh.edu.krd",
        password: "admin123", // This will be hashed automatically
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created successfully!");
      console.log("Email: admin@ukh.edu.krd");
      console.log("Username: admin_user");
      console.log("Password: admin123");
      console.log(
        "\n⚠️  IMPORTANT: Change these credentials after first login!"
      );
    } else {
      // Create admin user with original username
      const adminUser = new User({
        firstName: "Admin",
        lastName: "User",
        username: "admin",
        email: "admin@ukh.edu.krd",
        password: "admin123", // This will be hashed automatically
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created successfully!");
      console.log("Email: admin@ukh.edu.krd");
      console.log("Username: admin");
      console.log("Password: admin123");
      console.log(
        "\n⚠️  IMPORTANT: Change these credentials after first login!"
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
