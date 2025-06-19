import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Stress test configuration - push beyond normal capacity
export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Ramp up to 100 users
    { duration: "5m", target: 100 }, // Stay at 100 users
    { duration: "2m", target: 200 }, // Ramp up to 200 users
    { duration: "5m", target: 200 }, // Stay at 200 users
    { duration: "2m", target: 300 }, // Ramp up to 300 users
    { duration: "5m", target: 300 }, // Stay at 300 users
    { duration: "10m", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"], // 95% of requests should be below 5s (more lenient for stress test)
    http_req_failed: ["rate<0.1"], // Error rate should be less than 10%
    errors: ["rate<0.2"], // Custom error rate - more lenient
  },
};

const BASE_URL = "http://localhost:3000/api";

export default function () {
  // Focus on the most critical endpoints under stress
  const scenario = Math.random();

  if (scenario < 0.6) {
    // 60% - Test public blog endpoints (most common usage)
    testPublicEndpoints();
  } else if (scenario < 0.8) {
    // 20% - Test authentication (critical for user experience)
    testAuthEndpoints();
  } else {
    // 20% - Test blog creation (write operations under stress)
    testBlogCreation();
  }

  sleep(Math.random() * 2); // Random sleep between 0-2 seconds
}

function testPublicEndpoints() {
  // Test getting all blogs - most accessed endpoint
  const blogsResponse = http.get(`${BASE_URL}/blogs`);
  const success = check(blogsResponse, {
    "GET /blogs status is 200": (r) => r.status === 200,
    "GET /blogs response time < 3000ms": (r) => r.timings.duration < 3000,
  });

  if (!success) {
    errorRate.add(1);
  }
}

function testAuthEndpoints() {
  // Test login with high frequency
  const loginData = {
    email: "test@example.com",
    password: "testpassword123",
  };

  const loginResponse = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify(loginData),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const success = check(loginResponse, {
    "POST /auth/login response time < 2000ms": (r) => r.timings.duration < 2000,
    "POST /auth/login status is 200 or 401": (r) =>
      r.status === 200 || r.status === 401,
  });

  if (!success) {
    errorRate.add(1);
  }
}

function testBlogCreation() {
  // Test user registration under stress
  const newUser = {
    username: `stresstest_${Math.random().toString(36).substring(7)}`,
    email: `stress_${Math.random().toString(36).substring(7)}@example.com`,
    password: "testpassword123",
    firstName: "Stress",
    lastName: "Test",
  };

  const registerResponse = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify(newUser),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const success = check(registerResponse, {
    "POST /auth/register response time < 3000ms": (r) =>
      r.timings.duration < 3000,
    "POST /auth/register status is 201 or 400": (r) =>
      r.status === 201 || r.status === 400,
  });

  if (!success) {
    errorRate.add(1);
  }
}
