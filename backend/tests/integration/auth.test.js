import request from "supertest";
import app from "../../server.js";
import User from "../../model/user.js";
import { createTestUser, generateToken } from "../helpers/testHelpers.js";

describe("Authentication Endpoints", () => {
  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const userData = {
        firstName: "New",
        lastName: "User",
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.username).toBe(userData.username);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
    });

    test("should not register user with existing email", async () => {
      // Create a user first
      await createTestUser({
        firstName: "Existing",
        lastName: "User",
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      });

      const userData = {
        firstName: "New",
        lastName: "User",
        username: "newuser",
        email: "existing@example.com", // same email
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    test("should not register user with existing username", async () => {
      // Create a user first
      await createTestUser({
        firstName: "Existing",
        lastName: "User",
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      });

      const userData = {
        firstName: "New",
        lastName: "User",
        username: "existinguser", // same username
        email: "new@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });

    test("should validate required fields", async () => {
      const incompleteData = {
        username: "testuser",
        // missing required fields
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(incompleteData)
        .expect(500); // Server error due to validation

      expect(response.body.message).toBe("Error registering user");
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login with valid credentials", async () => {
      // Create a test user
      const user = await createTestUser({
        firstName: "Login",
        lastName: "User",
        username: "loginuser",
        email: "login@example.com",
        password: "password123",
      });

      const loginData = {
        email: "login@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    test("should not login with invalid email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    test("should not login with invalid password", async () => {
      // Create a test user
      await createTestUser({
        firstName: "Login",
        lastName: "User",
        username: "loginuser",
        email: "login@example.com",
        password: "password123",
      });

      const loginData = {
        email: "login@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("GET /api/auth/profile", () => {
    test("should get user profile with valid token", async () => {
      // Create a test user
      const user = await createTestUser({
        firstName: "Profile",
        lastName: "User",
        username: "profileuser",
        email: "profile@example.com",
        password: "password123",
      });

      const token = generateToken(user._id.toString());

      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
      expect(response.body.email).toBe(user.email);
      expect(response.body.username).toBe(user.username);
    });

    test("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.message).toBe("Access token required");
    });

    test("should not get profile with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalidtoken")
        .expect(403);

      expect(response.body.message).toBe("Invalid or expired token");
    });
  });
});
