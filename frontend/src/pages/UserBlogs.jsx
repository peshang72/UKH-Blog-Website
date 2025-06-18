import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

function UserBlogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserBlogs();
  }, [navigate]);

  const fetchUserBlogs = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:3000/api/user/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserBlogs(response.data);
    } catch (err) {
      setError("Failed to fetch your blogs");
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
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
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };

    const statusText = {
      pending: "Pending Review",
      approved: "Published",
      rejected: "Rejected",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}
      >
        {statusText[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <BackButton className="mb-5 mt-7 ml-10" route="/" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Blog Posts
          </h1>
          <p className="text-gray-600">
            Track the status of your submitted blog posts
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900">Total Posts</h3>
            <p className="text-3xl font-bold text-blue-600">
              {userBlogs.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900">Published</h3>
            <p className="text-3xl font-bold text-green-600">
              {userBlogs.filter((blog) => blog.status === "approved").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {userBlogs.filter((blog) => blog.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6">
            {userBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start sharing your thoughts with the community!
                </p>
                <button
                  onClick={() => navigate("/post-blog")}
                  className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Your First Blog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {blog.title}
                          </h3>
                          {getStatusBadge(blog.status)}
                        </div>
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {blog.blogDescription}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            {blog.category}
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {formatDate(blog.createdAt)}
                          </span>
                          {blog.reviewedAt && (
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Reviewed {formatDate(blog.reviewedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {blog.status === "rejected" && blog.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-1">
                          Rejection Reason:
                        </h4>
                        <p className="text-red-700 text-sm">
                          {blog.rejectionReason}
                        </p>
                      </div>
                    )}

                    {blog.status === "approved" && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => navigate(`/blog-post/${blog._id}`)}
                          className="text-primary hover:text-primary-600 font-medium text-sm"
                        >
                          View Published Post →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserBlogs;
