import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import programmingImg from "../assets/programming-img.jpg";

function AdminDashboard() {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      navigate("/admin/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    setUser(parsedUser);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [pendingResponse, allResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/blogs/pending", { headers }),
        axios.get("http://localhost:3000/api/admin/blogs", { headers }),
      ]);

      setPendingBlogs(pendingResponse.data);
      setAllBlogs(allResponse.data);
    } catch (err) {
      setError("Failed to fetch blogs");
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        navigate("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (blogId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:3000/api/admin/blogs/${blogId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Blog approved successfully!");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to approve blog");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleReject = async () => {
    if (!selectedBlogId || !rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:3000/api/admin/blogs/${selectedBlogId}/reject`,
        { reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Blog rejected successfully!");
      setShowRejectionModal(false);
      setRejectionReason("");
      setSelectedBlogId(null);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to reject blog");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openRejectionModal = (blogId) => {
    setSelectedBlogId(blogId);
    setShowRejectionModal(true);
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setRejectionReason("");
    setSelectedBlogId(null);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://localhost:3000/api/admin/blogs/${blogToDelete._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(`Blog "${blogToDelete.title}" deleted successfully!`);
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete blog");
      setTimeout(() => setError(""), 3000);
    }
  };

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const closeBlogModal = () => {
    setShowBlogModal(false);
    setSelectedBlog(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/admin/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Blogs
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingBlogs.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Approved Blogs
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {allBlogs.filter((blog) => blog.status === "approved").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Rejected Blogs
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {allBlogs.filter((blog) => blog.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pending"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending Blogs ({pendingBlogs.length})
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Blogs ({allBlogs.length})
              </button>
            </nav>
          </div>

          {/* Blog List */}
          <div className="p-6">
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingBlogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No pending blogs to review
                  </p>
                ) : (
                  pendingBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            By {blog.author.firstName} {blog.author.lastName} (@
                            {blog.author.username})
                          </p>
                          <p className="text-gray-700 text-sm mb-2">
                            {blog.blogDescription}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {blog.category}</span>
                            <span>Created: {formatDate(blog.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => openBlogModal(blog)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-1"
                            title="View full blog"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleApprove(blog._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectionModal(blog._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "all" && (
              <div className="space-y-4">
                {allBlogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No blogs found
                  </p>
                ) : (
                  allBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {blog.title}
                            </h3>
                            {getStatusBadge(blog.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            By {blog.author.firstName} {blog.author.lastName} (@
                            {blog.author.username})
                          </p>
                          <p className="text-gray-700 text-sm mb-2">
                            {blog.blogDescription}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Category: {blog.category}</span>
                            <span>Created: {formatDate(blog.createdAt)}</span>
                            {blog.reviewedAt && (
                              <span>
                                Reviewed: {formatDate(blog.reviewedAt)}
                              </span>
                            )}
                          </div>
                          {blog.rejectionReason && (
                            <p className="text-red-600 text-sm mt-2">
                              Rejection reason: {blog.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => openBlogModal(blog)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                            title="View full blog"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(blog)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                            title="Delete blog"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Blog Post
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this blog post:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeRejectionModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Reject Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Blog Post
                </h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this blog post? This action
                cannot be undone.
              </p>
              {blogToDelete && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {blogToDelete.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    by {blogToDelete.author.firstName}{" "}
                    {blogToDelete.author.lastName}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete Blog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog View Modal */}
      {showBlogModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    By {selectedBlog.author.firstName}{" "}
                    {selectedBlog.author.lastName}
                  </span>
                  <span>•</span>
                  <span>{selectedBlog.category}</span>
                  <span>•</span>
                  <span>{formatDate(selectedBlog.createdAt)}</span>
                  <span>•</span>
                  {getStatusBadge(selectedBlog.status)}
                </div>
              </div>
              <button
                onClick={closeBlogModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Blog Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedBlog.blogDescription}
                </p>
              </div>

              {/* Cover Image */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cover Image
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <img
                    src={
                      selectedBlog.coverImage && selectedBlog.coverImage.data
                        ? `data:${selectedBlog.coverImage.contentType};base64,${selectedBlog.coverImage.data}`
                        : programmingImg
                    }
                    alt={selectedBlog.imgCaption || selectedBlog.title}
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                  {selectedBlog.imgCaption && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      {selectedBlog.imgCaption}
                    </p>
                  )}
                  {(!selectedBlog.coverImage ||
                    !selectedBlog.coverImage.data) && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      No custom cover image uploaded - showing default image
                    </p>
                  )}
                </div>
              </div>

              {/* Blog Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Content
                </h3>
                <div
                  className="prose max-w-none bg-gray-50 p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              </div>

              {/* Review Information */}
              {selectedBlog.reviewedAt && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Review Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Reviewed on {formatDate(selectedBlog.reviewedAt)}
                      {selectedBlog.reviewedBy && (
                        <span>
                          {" "}
                          by {selectedBlog.reviewedBy.firstName}{" "}
                          {selectedBlog.reviewedBy.lastName}
                        </span>
                      )}
                    </p>
                    {selectedBlog.rejectionReason && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {selectedBlog.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            {selectedBlog.status === "pending" && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      closeBlogModal();
                      openRejectionModal(selectedBlog._id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Reject Blog
                  </button>
                  <button
                    onClick={() => {
                      closeBlogModal();
                      handleApprove(selectedBlog._id);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Approve Blog
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
