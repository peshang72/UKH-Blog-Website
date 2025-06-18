import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import logo from "../assets/logo.png";
import ButtonPrimary from "../components/ButtonPrimary";

function Login() {
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
      // API endpoint - replace with your actual backend URL
      const API_URL = "http://localhost:3000/api/auth/login";

      // Send POST request using Axios
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      // Handle successful login
      console.log("Login successful:", response.data);

      // 1. Store authentication token (JWT)
      localStorage.setItem("authToken", response.data.token);

      // 2. Store user data (optional)
      localStorage.setItem("userData", JSON.stringify(response.data.user));

      // 3. Redirect to home page
      navigate("/");
    } catch (err) {
      // Handle different error types
      if (err.response) {
        // Server responded with error status (4xx, 5xx)
        setError(err.response.data.message || "Invalid credentials");
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error. Please try again.");
      } else {
        // Other errors
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[url('../../public/campusImg.png')] bg-cover min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="College Logo" className="w-24 mb-6 " />
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back to <span className="text-primary">My College</span>{" "}
            Voice
          </h1>
          <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
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
              College Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              placeholder="student@ukh.edu.krd"
              pattern=".*@ukh\.edu\.krd$"
              title="Email must end with @ukh.edu.krd"
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

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-primary bg-gray-50 border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot Password?
            </Link>
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
              "Sign In"
            )}
          </ButtonPrimary>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            New to our community?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
