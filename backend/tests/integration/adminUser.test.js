import request from "supertest";
import app from "../../server.js";
import User from "../../model/user.js";
import {
  createTestUser,
  createTestAdmin,
  generateToken,
} from "../helpers/testHelpers.js";

describe("Admin User Management", () => {
  let testUser, testAdmin, userToken, adminToken;

  beforeEach(async () => {
    // Create test users
    testUser = await createTestUser({
      firstName: "Regular",
      lastName: "User",
      username: "regularuser",
      email: "regular@example.com",
      password: "password123",
    });

    testAdmin = await createTestAdmin({
      firstName: "Admin",
      lastName: "User",
      username: "adminuser",
      email: "admin@example.com",
      password: "admin123",
    });

    userToken = generateToken(testUser._id.toString());
    adminToken = generateToken(testAdmin._id.toString());
  });

  describe("Admin User Creation", () => {
    test("should create admin user with correct role", async () => {
      const adminData = {
        firstName: "New",
        lastName: "Admin",
        username: "newadmin",
        email: "newadmin@example.com",
        password: "admin123",
        role: "admin",
      };

      const newAdmin = new User(adminData);
      await newAdmin.save();

      expect(newAdmin.role).toBe("admin");
      expect(newAdmin.firstName).toBe("New");
      expect(newAdmin.lastName).toBe("Admin");
      expect(newAdmin.email).toBe("newadmin@example.com");

      // Verify password is hashed
      expect(newAdmin.password).not.toBe("admin123");
      expect(newAdmin.password.length).toBeGreaterThan(20); // Hashed password should be longer
    });

    test("should validate admin user creation with required fields", async () => {
      const incompleteAdminData = {
        firstName: "Incomplete",
        // Missing required fields
      };

      const newAdmin = new User(incompleteAdminData);

      await expect(newAdmin.save()).rejects.toThrow();
    });

    test("should prevent duplicate admin usernames", async () => {
      const duplicateAdminData = {
        firstName: "Duplicate",
        lastName: "Admin",
        username: testAdmin.username, // Same username as existing admin
        email: "duplicate@example.com",
        password: "admin123",
        role: "admin",
      };

      const duplicateAdmin = new User(duplicateAdminData);

      await expect(duplicateAdmin.save()).rejects.toThrow();
    });

    test("should prevent duplicate admin emails", async () => {
      const duplicateAdminData = {
        firstName: "Duplicate",
        lastName: "Admin",
        username: "duplicateadmin",
        email: testAdmin.email, // Same email as existing admin
        password: "admin123",
        role: "admin",
      };

      const duplicateAdmin = new User(duplicateAdminData);

      await expect(duplicateAdmin.save()).rejects.toThrow();
    });
  });

  describe("GET /api/auth/users (Admin only)", () => {
    test("should allow admin to get all users", async () => {
      const response = await request(app)
        .get("/api/auth/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2); // At least testUser and testAdmin

      // Check if both user types are included
      const userRoles = response.body.map((user) => user.role);
      expect(userRoles).toContain("user");
      expect(userRoles).toContain("admin");
    });

    test("should not allow regular user to get all users", async () => {
      const response = await request(app)
        .get("/api/auth/users")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe("Admin access required");
    });

    test("should not allow unauthenticated access to users list", async () => {
      const response = await request(app).get("/api/auth/users").expect(401);

      expect(response.body.message).toBe("Access token required");
    });

    test("should return user data without sensitive information", async () => {
      const response = await request(app)
        .get("/api/auth/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Check that passwords are not included in response
      response.body.forEach((user) => {
        expect(user.password).toBeUndefined();
        expect(user.firstName).toBeDefined();
        expect(user.lastName).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.username).toBeDefined();
        expect(user.role).toBeDefined();
      });
    });
  });

  describe("Admin Authentication", () => {
    test("should authenticate admin user with correct credentials", async () => {
      const loginData = {
        email: testAdmin.email,
        password: "admin123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.role).toBe("admin");
      expect(response.body.user.email).toBe(testAdmin.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be in response
    });

    test("should not authenticate admin with incorrect password", async () => {
      const loginData = {
        email: testAdmin.email,
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
      expect(response.body.token).toBeUndefined();
    });

    test("should not authenticate with non-existent admin email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "admin123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
      expect(response.body.token).toBeUndefined();
    });
  });

  describe("Admin Role Verification", () => {
    test("should correctly identify admin role in middleware", async () => {
      // This test verifies that the requireAdmin middleware works correctly
      const response = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // If we get here, it means the admin middleware passed
      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should reject non-admin users in admin middleware", async () => {
      const response = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe("Admin access required");
    });

    test("should handle invalid tokens in admin endpoints", async () => {
      const response = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", "Bearer invalidtoken")
        .expect(403);

      expect(response.body.message).toBe("Invalid or expired token");
    });

    test("should handle missing authorization header", async () => {
      const response = await request(app).get("/api/admin/blogs").expect(401);

      expect(response.body.message).toBe("Access token required");
    });
  });

  describe("Admin User Profile Management", () => {
    test("should allow admin to access their own profile", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.firstName).toBe(testAdmin.firstName);
      expect(response.body.lastName).toBe(testAdmin.lastName);
      expect(response.body.email).toBe(testAdmin.email);
      expect(response.body.role).toBe("admin");
      expect(response.body.password).toBeUndefined();
    });

    test("should allow regular user to access their own profile", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.firstName).toBe(testUser.firstName);
      expect(response.body.lastName).toBe(testUser.lastName);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.role).toBe("user");
      expect(response.body.password).toBeUndefined();
    });
  });

  describe("Admin User Data Integrity", () => {
    test("should maintain admin role after user operations", async () => {
      // Verify admin role is preserved
      const adminFromDb = await User.findById(testAdmin._id);
      expect(adminFromDb.role).toBe("admin");

      // Simulate some operations that shouldn't change the role
      await User.findByIdAndUpdate(testAdmin._id, {
        firstName: "Updated Admin",
      });

      const updatedAdmin = await User.findById(testAdmin._id);
      expect(updatedAdmin.role).toBe("admin");
      expect(updatedAdmin.firstName).toBe("Updated Admin");
    });

    test("should hash admin password correctly", async () => {
      const plainPassword = "newadminpassword";
      const adminData = {
        firstName: "Password",
        lastName: "Test",
        username: "passwordtest",
        email: "passwordtest@example.com",
        password: plainPassword,
        role: "admin",
      };

      const newAdmin = new User(adminData);
      await newAdmin.save();

      // Password should be hashed
      expect(newAdmin.password).not.toBe(plainPassword);
      expect(newAdmin.password.length).toBeGreaterThan(20);

      // Should be able to authenticate with original password
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: "passwordtest@example.com",
          password: plainPassword,
        })
        .expect(200);

      expect(loginResponse.body.user.role).toBe("admin");
    });

    test("should validate admin email format", async () => {
      const invalidEmailData = {
        firstName: "Invalid",
        lastName: "Email",
        username: "invalidemail",
        email: "", // Empty email - this will fail validation
        password: "admin123",
        role: "admin",
      };

      const invalidAdmin = new User(invalidEmailData);

      await expect(invalidAdmin.save()).rejects.toThrow();
    });
  });

  describe("Admin System Integration", () => {
    test("should allow admin to perform all admin operations", async () => {
      // Test that admin can access all admin endpoints
      const endpoints = [
        "/api/admin/blogs",
        "/api/admin/blogs/pending",
        "/api/auth/users",
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      }
    });

    test("should prevent regular user from accessing any admin endpoint", async () => {
      const adminEndpoints = [
        "/api/admin/blogs",
        "/api/admin/blogs/pending",
        "/api/auth/users",
      ];

      for (const endpoint of adminEndpoints) {
        const response = await request(app)
          .get(endpoint)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);

        expect(response.body.message).toBe("Admin access required");
      }
    });
  });
});
