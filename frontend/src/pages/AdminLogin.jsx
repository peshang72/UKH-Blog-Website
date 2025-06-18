import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import ButtonPrimary from "../components/ButtonPrimary";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const API_URL = "http://localhost:3000/api/auth/login";

      const response = await axios.post(API_URL, {
        email,
        password,
      });

      // Check if user is admin
      if (response.data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        setIsLoading(false);
        return;
      }

      // Store authentication token and user data
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials");
      } else if (err.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-blue-900 to-indigo-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="College Logo" className="w-24 mb-6" />
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Admin Portal
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to manage{" "}
            <span className="text-primary font-semibold">My College Voice</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              placeholder="admin@ukh.edu.krd"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          <ButtonPrimary
            type="submit"
            className="w-full py-3 mt-4 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </>
            ) : (
              "Sign In as Admin"
            )}
          </ButtonPrimary>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Not an admin?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Student Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
