import jwt from "jsonwebtoken";
import User from "../../../model/user.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../../../controllers/userController.js";

// Mock the dependencies
jest.mock("jsonwebtoken");
jest.mock("../../../model/user.js");

const mockJwt = jwt;
const mockUser = User;

describe("UserController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    const validUserData = {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
    };

    test("should register user with valid data", async () => {
      req.body = validUserData;

      // Mock user not existing
      mockUser.findOne.mockResolvedValue(null);

      // Mock user creation
      const mockNewUser = {
        _id: "userId123",
        ...validUserData,
        role: "user",
        fullName: "John Doe",
        save: jest.fn().mockResolvedValue(true),
      };
      mockUser.mockImplementation(() => mockNewUser);

      // Mock JWT sign
      mockJwt.sign.mockReturnValue("mockToken");

      await registerUser(req, res);

      expect(mockUser.findOne).toHaveBeenCalledWith({
        $or: [{ email: "john@example.com" }, { username: "johndoe" }],
      });
      expect(mockNewUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        token: "mockToken",
        user: {
          id: "userId123",
          firstName: "John",
          lastName: "Doe",
          fullName: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        },
      });
    });

    test("should not register user with existing email", async () => {
      req.body = validUserData;

      // Mock existing user
      mockUser.findOne.mockResolvedValue({ email: "john@example.com" });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User with this email or username already exists",
      });
    });

    test("should handle registration errors", async () => {
      req.body = validUserData;

      mockUser.findOne.mockResolvedValue(null);

      const mockNewUser = {
        save: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      mockUser.mockImplementation(() => mockNewUser);

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error registering user",
        error: "Database error",
      });
    });
  });

  describe("loginUser", () => {
    const loginData = {
      email: "john@example.com",
      password: "password123",
    };

    test("should login user with valid credentials", async () => {
      req.body = loginData;

      const mockUserData = {
        _id: "userId123",
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        role: "user",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      mockJwt.sign.mockReturnValue("mockToken");

      await loginUser(req, res);

      expect(mockUser.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
      });
      expect(mockUserData.comparePassword).toHaveBeenCalledWith("password123");
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "mockToken",
        user: {
          id: "userId123",
          firstName: "John",
          lastName: "Doe",
          fullName: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        },
      });
    });

    test("should not login with invalid email", async () => {
      req.body = loginData;

      mockUser.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    test("should not login with invalid password", async () => {
      req.body = loginData;

      const mockUserData = {
        _id: "userId123",
        email: "john@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    test("should handle login errors", async () => {
      req.body = loginData;

      mockUser.findOne.mockRejectedValue(new Error("Database error"));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error logging in",
        error: "Database error",
      });
    });
  });

  describe("getUserProfile", () => {
    test("should return user profile", async () => {
      req.user = {
        _id: "userId123",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        role: "user",
      };

      await getUserProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        _id: "userId123",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        role: "user",
      });
    });

    test("should return null when user is null", async () => {
      req.user = null;

      await getUserProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});
