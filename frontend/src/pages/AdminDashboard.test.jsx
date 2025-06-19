import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("AdminDashboard Component", () => {
  const mockBlogs = [
    {
      _id: "1",
      title: "Pending Blog",
      status: "pending",
      author: {
        firstName: "John",
        lastName: "Doe",
      },
      category: "Technology",
      blogDescription: "Test description",
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      _id: "2",
      title: "Approved Blog",
      status: "approved",
      author: {
        firstName: "Jane",
        lastName: "Smith",
      },
      category: "Design",
      blogDescription: "Another description",
      createdAt: "2023-02-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    // Mock localStorage
    localStorage.setItem("authToken", "admin-token");
    localStorage.setItem(
      "userData",
      JSON.stringify({
        role: "admin",
        firstName: "Admin",
        lastName: "User",
      })
    );

    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes("pending")) {
        return Promise.resolve({ data: [mockBlogs[0]] });
      } else {
        return Promise.resolve({ data: mockBlogs });
      }
    });

    // Clear mocks
    vi.clearAllMocks();
  });

  const renderDashboard = async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  };

  it("approves a pending blog", async () => {
    axios.put.mockResolvedValue({ data: {} });
    await renderDashboard();

    // Wait for pending blog to appear
    await screen.findByText("Pending Blog");

    // Click approve button
    const approveButtons = await screen.findAllByText("Approve");
    fireEvent.click(approveButtons[0]);

    // Verify API call
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:3000/api/admin/blogs/1/approve",
        {},
        { headers: { Authorization: "Bearer admin-token" } }
      );
    });
  });

  it("rejects a blog with reason", async () => {
    axios.put.mockResolvedValue({ data: {} });
    await renderDashboard();

    // Wait for pending blog to appear
    await screen.findByText("Pending Blog");

    // Click reject button
    const rejectButtons = await screen.findAllByText("Reject");
    fireEvent.click(rejectButtons[0]);

    // Wait for modal to appear
    await screen.findByText("Reject Blog Post");

    // Enter rejection reason
    fireEvent.change(screen.getByPlaceholderText("Enter rejection reason..."), {
      target: { value: "Not relevant" },
    });

    // Submit rejection
    fireEvent.click(screen.getByText("Reject Blog"));

    // Verify API call
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:3000/api/admin/blogs/1/reject",
        { reason: "Not relevant" },
        { headers: { Authorization: "Bearer admin-token" } }
      );
    });
  });

  it("deletes a blog", async () => {
    axios.delete.mockResolvedValue({ data: {} });
    await renderDashboard();

    // Switch to all blogs tab
    fireEvent.click(screen.getByText("All Blogs (2)"));
    await screen.findByText("Approved Blog");

    // Find all delete buttons - [0] is for pending blog, [1] is for approved blog
    const deleteButtons = await screen.findAllByText("Delete");
    fireEvent.click(deleteButtons[1]); // Click the second button (approved blog)

    // Confirm deletion
    await screen.findByText("Delete Blog Post");
    fireEvent.click(screen.getByText("Delete Blog"));

    // Verify API call for blog ID "2"
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3000/api/admin/blogs/2",
        { headers: { Authorization: "Bearer admin-token" } }
      );
    });
  });
});
