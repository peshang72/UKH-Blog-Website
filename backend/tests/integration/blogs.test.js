import request from "supertest";
import app from "../../server.js";
import User from "../../model/user.js";
import Blog from "../../model/blog.js";
import {
  createTestUser,
  createTestAdmin,
  createTestBlog,
  generateToken,
} from "../helpers/testHelpers.js";

describe("Blog Endpoints", () => {
  let testUser, testAdmin, userToken, adminToken;

  beforeEach(async () => {
    // Create test users
    testUser = await createTestUser({
      firstName: "Blog",
      lastName: "User",
      username: "bloguser",
      email: "bloguser@example.com",
      password: "password123",
    });

    testAdmin = await createTestAdmin({
      firstName: "Blog",
      lastName: "Admin",
      username: "blogadmin",
      email: "blogadmin@example.com",
      password: "admin123",
    });

    userToken = generateToken(testUser._id.toString());
    adminToken = generateToken(testAdmin._id.toString());
  });

  describe("GET /api/blogs", () => {
    test("should get all approved blogs", async () => {
      // Create test blogs
      await createTestBlog(testUser._id, {
        title: "Approved Blog 1",
        status: "approved",
      });
      await createTestBlog(testUser._id, {
        title: "Approved Blog 2",
        status: "approved",
      });
      await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });

      const response = await request(app).get("/api/blogs").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2); // Only approved blogs
      expect(response.body[0].status).toBe("approved");
    });

    test("should return empty array when no blogs exist", async () => {
      const response = await request(app).get("/api/blogs").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("GET /api/blogs/:id", () => {
    test("should get specific blog by id", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Specific Blog",
        status: "approved",
      });

      const response = await request(app)
        .get(`/api/blogs/${blog._id}`)
        .expect(200);

      expect(response.body.title).toBe("Specific Blog");
      expect(response.body._id).toBe(blog._id.toString());
    });

    test("should return 404 for non-existent blog", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .get(`/api/blogs/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("Blog not found");
    });
  });

  describe("POST /api/post-blog", () => {
    test("should create blog with valid data and token", async () => {
      const blogData = {
        title: "New Test Blog",
        "blog-description": "This is a test blog description",
        content: "This is the main content of the test blog post.",
        category: "Technology",
        "img-caption": "Test image caption",
      };

      const response = await request(app)
        .post("/api/post-blog")
        .set("Authorization", `Bearer ${userToken}`)
        .send(blogData)
        .expect(201);

      expect(response.body.message).toBe("Blog created successfully");
      expect(response.body.blog).toBeDefined();
      expect(response.body.blog.title).toBe(blogData.title);
      expect(response.body.blog.author).toBe(testUser._id.toString());

      // Verify blog was created in database
      const blog = await Blog.findOne({ title: blogData.title });
      expect(blog).toBeTruthy();
    });

    test("should not create blog without authentication", async () => {
      const blogData = {
        title: "Unauthorized Blog",
        "blog-description": "This should not be created",
        content: "Content",
        category: "Technology",
      };

      const response = await request(app)
        .post("/api/post-blog")
        .send(blogData)
        .expect(401);

      expect(response.body.message).toBe("Access token required");
    });

    test("should validate required fields", async () => {
      const incompleteData = {
        title: "Incomplete Blog",
        // missing required fields
      };

      const response = await request(app)
        .post("/api/post-blog")
        .set("Authorization", `Bearer ${userToken}`)
        .send(incompleteData)
        .expect(500);

      expect(response.body.message).toBe("Error creating blog");
    });
  });

  describe("PUT /api/blogs/:id", () => {
    test("should update own blog", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Original Title",
        status: "approved",
      });

      const updateData = {
        title: "Updated Title",
        blogDescription: "Updated description",
      };

      const response = await request(app)
        .put(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe("Blog updated successfully");
      expect(response.body.blog.title).toBe(updateData.title);
    });

    test("should not update other users blog", async () => {
      const otherUser = await createTestUser({
        firstName: "Other",
        lastName: "User",
        username: "otheruser",
        email: "other@example.com",
        password: "password123",
      });

      const blog = await createTestBlog(otherUser._id, {
        title: "Other User Blog",
        status: "approved",
      });

      const updateData = {
        title: "Hacked Title",
      };

      const response = await request(app)
        .put(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.message).toBe("Access denied");
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    test("should delete own blog", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Blog to Delete",
        status: "approved",
      });

      const response = await request(app)
        .delete(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.message).toBe("Blog deleted successfully");

      // Verify blog was deleted
      const deletedBlog = await Blog.findById(blog._id);
      expect(deletedBlog).toBeNull();
    });

    test("should not delete other users blog", async () => {
      const otherUser = await createTestUser({
        firstName: "Other",
        lastName: "User",
        username: "otheruser",
        email: "other@example.com",
        password: "password123",
      });

      const blog = await createTestBlog(otherUser._id, {
        title: "Other User Blog",
        status: "approved",
      });

      const response = await request(app)
        .delete(`/api/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe("Access denied");
    });
  });

  describe("Admin Endpoints", () => {
    describe("GET /api/admin/blogs", () => {
      test("should get all blogs for admin", async () => {
        await createTestBlog(testUser._id, {
          title: "Approved Blog",
          status: "approved",
        });
        await createTestBlog(testUser._id, {
          title: "Pending Blog",
          status: "pending",
        });

        const response = await request(app)
          .get("/api/admin/blogs")
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2); // All blogs
      });

      test("should not allow non-admin access", async () => {
        const response = await request(app)
          .get("/api/admin/blogs")
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);

        expect(response.body.message).toBe("Admin access required");
      });
    });

    describe("PUT /api/admin/blogs/:id/approve", () => {
      test("should approve pending blog", async () => {
        const blog = await createTestBlog(testUser._id, {
          title: "Pending Blog",
          status: "pending",
        });

        const response = await request(app)
          .put(`/api/admin/blogs/${blog._id}/approve`)
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.message).toBe("Blog approved successfully");
        expect(response.body.blog.status).toBe("approved");
      });
    });
  });
});
