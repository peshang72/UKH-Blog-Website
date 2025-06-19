import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Test configuration
export const options = {
  // Load test: gradually ramp up to 50 users over 5 minutes, maintain for 10 minutes, then ramp down
  stages: [
    { duration: "5m", target: 50 }, // Ramp up to 50 users
    { duration: "10m", target: 50 }, // Stay at 50 users
    { duration: "5m", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% of requests should be below 2s
    http_req_failed: ["rate<0.05"], // Error rate should be less than 5%
    errors: ["rate<0.1"], // Custom error rate
  },
};

const BASE_URL = "http://localhost:3000/api";

// Test data
const testUser = {
  username: `testuser_${Math.random().toString(36).substring(7)}`,
  email: `test_${Math.random().toString(36).substring(7)}@example.com`,
  password: "testpassword123",
  firstName: "Test",
  lastName: "User",
};

let authToken = "";

export function setup() {
  // Register a test user for authenticated requests
  const registerResponse = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify(testUser),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (registerResponse.status === 201) {
    // Login to get auth token
    const loginResponse = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (loginResponse.status === 200) {
      const loginData = JSON.parse(loginResponse.body);
      return { token: loginData.token };
    }
  }

  return { token: null };
}

export default function (data) {
  const token = data.token;

  // Test scenarios with different weights
  const scenario = Math.random();

  if (scenario < 0.4) {
    // 40% - Test public blog endpoints
    testPublicEndpoints();
  } else if (scenario < 0.7) {
    // 30% - Test authenticated endpoints
    if (token) {
      testAuthenticatedEndpoints(token);
    } else {
      testPublicEndpoints();
    }
  } else {
    // 30% - Test authentication endpoints
    testAuthEndpoints();
  }

  sleep(1); // Wait 1 second between iterations
}

function testPublicEndpoints() {
  // Test getting all blogs
  const blogsResponse = http.get(`${BASE_URL}/blogs`);
  const blogsSuccess = check(blogsResponse, {
    "GET /blogs status is 200": (r) => r.status === 200,
    "GET /blogs response time < 1000ms": (r) => r.timings.duration < 1000,
  });

  if (!blogsSuccess) {
    errorRate.add(1);
  }

  // If we got blogs, test getting a specific blog
  if (blogsResponse.status === 200) {
    try {
      const blogs = JSON.parse(blogsResponse.body);
      if (blogs.blogs && blogs.blogs.length > 0) {
        const blogId = blogs.blogs[0]._id;
        const blogResponse = http.get(`${BASE_URL}/blogs/${blogId}`);
        const blogSuccess = check(blogResponse, {
          "GET /blogs/:id status is 200": (r) => r.status === 200,
          "GET /blogs/:id response time < 500ms": (r) =>
            r.timings.duration < 500,
        });

        if (!blogSuccess) {
          errorRate.add(1);
        }
      }
    } catch (e) {
      errorRate.add(1);
    }
  }
}

function testAuthenticatedEndpoints(token) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Test getting user profile
  const profileResponse = http.get(`${BASE_URL}/auth/profile`, { headers });
  const profileSuccess = check(profileResponse, {
    "GET /auth/profile status is 200": (r) => r.status === 200,
    "GET /auth/profile response time < 500ms": (r) => r.timings.duration < 500,
  });

  if (!profileSuccess) {
    errorRate.add(1);
  }

  // Test getting user's blogs
  const userBlogsResponse = http.get(`${BASE_URL}/user/blogs`, { headers });
  const userBlogsSuccess = check(userBlogsResponse, {
    "GET /user/blogs status is 200": (r) => r.status === 200,
    "GET /user/blogs response time < 1000ms": (r) => r.timings.duration < 1000,
  });

  if (!userBlogsSuccess) {
    errorRate.add(1);
  }

  // Test creating a blog post
  const blogData = {
    title: `Performance Test Blog ${Date.now()}`,
    content: "This is a test blog post created during performance testing.",
    category: "Technology",
    tags: ["performance", "testing", "k6"],
  };

  const createBlogResponse = http.post(
    `${BASE_URL}/post-blog`,
    JSON.stringify(blogData),
    { headers }
  );
  const createBlogSuccess = check(createBlogResponse, {
    "POST /post-blog status is 201": (r) => r.status === 201,
    "POST /post-blog response time < 1500ms": (r) => r.timings.duration < 1500,
  });

  if (!createBlogSuccess) {
    errorRate.add(1);
  }
}

function testAuthEndpoints() {
  // Test user registration
  const newUser = {
    username: `loadtest_${Math.random().toString(36).substring(7)}`,
    email: `loadtest_${Math.random().toString(36).substring(7)}@example.com`,
    password: "testpassword123",
    firstName: "Load",
    lastName: "Test",
  };

  const registerResponse = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify(newUser),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const registerSuccess = check(registerResponse, {
    "POST /auth/register status is 201": (r) => r.status === 201,
    "POST /auth/register response time < 1000ms": (r) =>
      r.timings.duration < 1000,
  });

  if (!registerSuccess) {
    errorRate.add(1);
  }

  // Test user login
  const loginResponse = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: newUser.email,
      password: newUser.password,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const loginSuccess = check(loginResponse, {
    "POST /auth/login status is 200": (r) => r.status === 200,
    "POST /auth/login response time < 500ms": (r) => r.timings.duration < 500,
    "POST /auth/login returns token": (r) => {
      if (r.status === 200) {
        const body = JSON.parse(r.body);
        return body.token !== undefined;
      }
      return false;
    },
  });

  if (!loginSuccess) {
    errorRate.add(1);
  }
}

export function teardown(data) {
  // Cleanup could be added here if needed
  console.log("Load test completed");
}
