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

describe("Admin Functions", () => {
  let testUser, testAdmin, userToken, adminToken;

  beforeEach(async () => {
    // Create test users
    testUser = await createTestUser({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "testuser@example.com",
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

  describe("Admin Authentication & Authorization", () => {
    test("should allow admin access to admin endpoints", async () => {
      const response = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test("should deny non-admin access to admin endpoints", async () => {
      const response = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe("Admin access required");
    });

    test("should deny unauthenticated access to admin endpoints", async () => {
      const response = await request(app).get("/api/admin/blogs").expect(401);

      expect(response.body.message).toBe("Access token required");
    });
  });

  describe("GET /api/admin/blogs/pending", () => {
    test("should get all pending blogs for admin", async () => {
      // Create test blogs with different statuses
      await createTestBlog(testUser._id, {
        title: "Pending Blog 1",
        status: "pending",
      });
      await createTestBlog(testUser._id, {
        title: "Pending Blog 2",
        status: "pending",
      });
      await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });

      const response = await request(app)
        .get("/api/admin/blogs/pending")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2); // Only pending blogs
      expect(response.body.every((blog) => blog.status === "pending")).toBe(
        true
      );
    });

    test("should return empty array when no pending blogs exist", async () => {
      await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });

      const response = await request(app)
        .get("/api/admin/blogs/pending")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    test("should populate author information", async () => {
      await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });

      const response = await request(app)
        .get("/api/admin/blogs/pending")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body[0].author).toBeDefined();
      expect(response.body[0].author.firstName).toBe(testUser.firstName);
      expect(response.body[0].author.email).toBe(testUser.email);
    });
  });

  describe("GET /api/admin/blogs", () => {
    test("should get all blogs with different statuses", async () => {
      await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });
      await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });
      await createTestBlog(testUser._id, {
        title: "Rejected Blog",
        status: "rejected",
      });

      const response = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });

    test("should filter blogs by status when status query provided", async () => {
      await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });
      await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });

      const response = await request(app)
        .get("/api/admin/blogs?status=approved")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe("approved");
    });
  });

  describe("PUT /api/admin/blogs/:id/approve", () => {
    test("should approve a pending blog", async () => {
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
      expect(response.body.blog.reviewedBy).toBeDefined();
      expect(response.body.blog.reviewedAt).toBeDefined();

      // Verify in database
      const updatedBlog = await Blog.findById(blog._id);
      expect(updatedBlog.status).toBe("approved");
      expect(updatedBlog.reviewedBy.toString()).toBe(testAdmin._id.toString());
    });

    test("should not approve already reviewed blog", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });

      const response = await request(app)
        .put(`/api/admin/blogs/${blog._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.message).toBe("Blog has already been reviewed");
    });

    test("should return 404 for non-existent blog", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .put(`/api/admin/blogs/${nonExistentId}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.message).toBe("Blog not found");
    });
  });

  describe("PUT /api/admin/blogs/:id/reject", () => {
    test("should reject a pending blog with reason", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });

      const rejectionReason = "Content does not meet quality standards";

      const response = await request(app)
        .put(`/api/admin/blogs/${blog._id}/reject`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: rejectionReason })
        .expect(200);

      expect(response.body.message).toBe("Blog rejected successfully");
      expect(response.body.blog.status).toBe("rejected");
      expect(response.body.blog.rejectionReason).toBe(rejectionReason);
      expect(response.body.blog.reviewedBy).toBeDefined();
      expect(response.body.blog.reviewedAt).toBeDefined();

      // Verify in database
      const updatedBlog = await Blog.findById(blog._id);
      expect(updatedBlog.status).toBe("rejected");
      expect(updatedBlog.rejectionReason).toBe(rejectionReason);
      expect(updatedBlog.reviewedBy.toString()).toBe(testAdmin._id.toString());
    });

    test("should reject blog without reason (default reason)", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });

      const response = await request(app)
        .put(`/api/admin/blogs/${blog._id}/reject`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({})
        .expect(200);

      expect(response.body.message).toBe("Blog rejected successfully");
      expect(response.body.blog.status).toBe("rejected");
      expect(response.body.blog.rejectionReason).toBe("No reason provided");
    });

    test("should not reject already reviewed blog", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });

      const response = await request(app)
        .put(`/api/admin/blogs/${blog._id}/reject`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: "Test rejection" })
        .expect(400);

      expect(response.body.message).toBe("Blog has already been reviewed");
    });
  });

  describe("DELETE /api/admin/blogs/:id", () => {
    test("should allow admin to delete any blog", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Blog to Delete",
        status: "approved",
      });

      const response = await request(app)
        .delete(`/api/admin/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe("Blog deleted successfully");
      expect(response.body.deletedBlog.id).toBe(blog._id.toString());

      // Verify blog was deleted from database
      const deletedBlog = await Blog.findById(blog._id);
      expect(deletedBlog).toBeNull();
    });

    test("should return 404 when trying to delete non-existent blog", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/api/admin/blogs/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.message).toBe("Blog not found");
    });

    test("should not allow regular user to use admin delete endpoint", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Blog to Delete",
        status: "approved",
      });

      const response = await request(app)
        .delete(`/api/admin/blogs/${blog._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe("Admin access required");
    });
  });

  describe("Admin Blog Management Workflow", () => {
    test("should handle complete blog approval workflow", async () => {
      // Create pending blog
      const blog = await createTestBlog(testUser._id, {
        title: "Workflow Test Blog",
        status: "pending",
      });

      // Admin gets pending blogs
      const pendingResponse = await request(app)
        .get("/api/admin/blogs/pending")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(pendingResponse.body).toHaveLength(1);
      expect(pendingResponse.body[0].title).toBe("Workflow Test Blog");

      // Admin approves the blog
      const approveResponse = await request(app)
        .put(`/api/admin/blogs/${blog._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(approveResponse.body.blog.status).toBe("approved");

      // Verify no pending blogs remain
      const noPendingResponse = await request(app)
        .get("/api/admin/blogs/pending")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(noPendingResponse.body).toHaveLength(0);

      // Verify blog appears in approved blogs
      const approvedResponse = await request(app)
        .get("/api/admin/blogs?status=approved")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(approvedResponse.body).toHaveLength(1);
      expect(approvedResponse.body[0].status).toBe("approved");
    });

    test("should handle complete blog rejection workflow", async () => {
      // Create pending blog
      const blog = await createTestBlog(testUser._id, {
        title: "Rejection Test Blog",
        status: "pending",
      });

      const rejectionReason = "Inappropriate content";

      // Admin rejects the blog
      const rejectResponse = await request(app)
        .put(`/api/admin/blogs/${blog._id}/reject`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: rejectionReason })
        .expect(200);

      expect(rejectResponse.body.blog.status).toBe("rejected");
      expect(rejectResponse.body.blog.rejectionReason).toBe(rejectionReason);

      // Verify blog appears in rejected blogs
      const rejectedResponse = await request(app)
        .get("/api/admin/blogs?status=rejected")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(rejectedResponse.body).toHaveLength(1);
      expect(rejectedResponse.body[0].status).toBe("rejected");
      expect(rejectedResponse.body[0].rejectionReason).toBe(rejectionReason);
    });

    test("should handle admin deletion of any blog", async () => {
      // Create blogs with different statuses
      const pendingBlog = await createTestBlog(testUser._id, {
        title: "Pending Blog",
        status: "pending",
      });
      const approvedBlog = await createTestBlog(testUser._id, {
        title: "Approved Blog",
        status: "approved",
      });

      // Admin deletes pending blog
      await request(app)
        .delete(`/api/admin/blogs/${pendingBlog._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Admin deletes approved blog
      await request(app)
        .delete(`/api/admin/blogs/${approvedBlog._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Verify no blogs remain
      const allBlogsResponse = await request(app)
        .get("/api/admin/blogs")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(allBlogsResponse.body).toHaveLength(0);
    });
  });

  describe("Admin Blog Data Validation", () => {
    test("should populate reviewer information correctly", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Review Test Blog",
        status: "pending",
      });

      const response = await request(app)
        .put(`/api/admin/blogs/${blog._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.blog.reviewedBy).toBeDefined();
      expect(response.body.blog.reviewedBy.firstName).toBe(testAdmin.firstName);
      expect(response.body.blog.reviewedBy.lastName).toBe(testAdmin.lastName);
      expect(response.body.blog.reviewedBy.username).toBe(testAdmin.username);
    });

    test("should set reviewedAt timestamp correctly", async () => {
      const blog = await createTestBlog(testUser._id, {
        title: "Timestamp Test Blog",
        status: "pending",
      });

      const beforeTime = new Date();

      const response = await request(app)
        .put(`/api/admin/blogs/${blog._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const afterTime = new Date();
      const reviewedAt = new Date(response.body.blog.reviewedAt);

      expect(reviewedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(reviewedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    test("should remove rejection reason when approving previously rejected blog", async () => {
      // Create a blog and reject it first
      const blog = await createTestBlog(testUser._id, {
        title: "Rejection Removal Test",
        status: "pending",
      });

      // First reject it
      await request(app)
        .put(`/api/admin/blogs/${blog._id}/reject`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: "Initial rejection" })
        .expect(200);

      // Change status back to pending for approval test
      await Blog.findByIdAndUpdate(blog._id, { status: "pending" });

      // Now approve it
      const approveResponse = await request(app)
        .put(`/api/admin/blogs/${blog._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(approveResponse.body.blog.status).toBe("approved");
      expect(approveResponse.body.blog.rejectionReason).toBeUndefined();

      // Verify in database
      const updatedBlog = await Blog.findById(blog._id);
      expect(updatedBlog.rejectionReason).toBeUndefined();
    });
  });
});
