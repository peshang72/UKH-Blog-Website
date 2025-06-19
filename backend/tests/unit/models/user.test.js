import User from "../../../model/user.js";

describe("User Model", () => {
  describe("User Creation", () => {
    test("should create a valid user", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe("user"); // default role
      expect(savedUser.createdAt).toBeDefined();
    });

    test("should hash password before saving", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser2",
        email: "test2@example.com",
        password: "password123",
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password.length).toBeGreaterThan(20); // bcrypt hash length
    });

    test("should set default role to user", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser3",
        email: "test3@example.com",
        password: "password123",
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.role).toBe("user");
    });

    test("should create virtual fullName field", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.fullName).toBe("John Doe");
    });
  });

  describe("User Validation", () => {
    test("should require firstName", async () => {
      const userData = {
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    test("should require lastName", async () => {
      const userData = {
        firstName: "Test",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    test("should require username", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    test("should require email", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        password: "password123",
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    test("should require password", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
      };

      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    test("should enforce unique username", async () => {
      const userData1 = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test1@example.com",
        password: "password123",
      };

      const userData2 = {
        firstName: "Another",
        lastName: "User",
        username: "testuser", // same username
        email: "test2@example.com",
        password: "password123",
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    test("should enforce unique email", async () => {
      const userData1 = {
        firstName: "Test",
        lastName: "User",
        username: "testuser1",
        email: "test@example.com",
        password: "password123",
      };

      const userData2 = {
        firstName: "Another",
        lastName: "User",
        username: "testuser2",
        email: "test@example.com", // same email
        password: "password123",
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    test("should validate username length", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "ab", // too short (min 3)
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test("should validate password length", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
        password: "12345", // too short (min 6)
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe("User Methods", () => {
    test("should compare password correctly", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = new User(userData);
      const savedUser = await user.save();

      const isMatch = await savedUser.comparePassword("password123");
      expect(isMatch).toBe(true);

      const isNotMatch = await savedUser.comparePassword("wrongpassword");
      expect(isNotMatch).toBe(false);
    });
  });
});
