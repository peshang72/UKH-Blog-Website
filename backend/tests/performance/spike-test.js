import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Spike test configuration - sudden traffic spikes
export const options = {
  stages: [
    { duration: "10s", target: 100 }, // Fast ramp-up to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "10s", target: 1400 }, // Spike to 1400 users
    { duration: "3m", target: 1400 }, // Stay at 1400 users
    { duration: "10s", target: 100 }, // Quick drop to 100 users
    { duration: "3m", target: 100 }, // Recovery at 100 users
    { duration: "10s", target: 0 }, // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<10000"], // 95% of requests should be below 10s (very lenient for spike test)
    http_req_failed: ["rate<0.2"], // Error rate should be less than 20%
    errors: ["rate<0.3"], // Custom error rate - very lenient for spike conditions
  },
};

const BASE_URL = "http://localhost:3000/api";

export default function () {
  // During spike tests, focus on the most critical read operations
  const scenario = Math.random();

  if (scenario < 0.8) {
    // 80% - Test public blog endpoints (most likely to be hit during traffic spikes)
    testCriticalReadEndpoints();
  } else {
    // 20% - Test authentication (users trying to login during high traffic)
    testAuthenticationSpike();
  }

  sleep(Math.random() * 0.5); // Short random sleep (0-0.5 seconds) to simulate real user behavior
}

function testCriticalReadEndpoints() {
  // Test the most critical read endpoint
  const blogsResponse = http.get(`${BASE_URL}/blogs`);
  const success = check(blogsResponse, {
    "GET /blogs responds": (r) => r.status !== 0, // Just check if we get any response
    "GET /blogs response time < 8000ms": (r) => r.timings.duration < 8000,
    "GET /blogs status is 200 or 503": (r) =>
      r.status === 200 || r.status === 503, // 503 is acceptable during spikes
  });

  if (!success) {
    errorRate.add(1);
  }

  // If the blogs endpoint is working, try to get a specific blog
  if (blogsResponse.status === 200) {
    try {
      const blogs = JSON.parse(blogsResponse.body);
      if (blogs.blogs && blogs.blogs.length > 0) {
        const blogId = blogs.blogs[0]._id;
        const blogResponse = http.get(`${BASE_URL}/blogs/${blogId}`);
        check(blogResponse, {
          "GET /blogs/:id responds during spike": (r) => r.status !== 0,
          "GET /blogs/:id response time < 5000ms": (r) =>
            r.timings.duration < 5000,
        });
      }
    } catch (e) {
      // Ignore parsing errors during spike - server might be overwhelmed
    }
  }
}

function testAuthenticationSpike() {
  // Test login during spike conditions
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
    "POST /auth/login responds during spike": (r) => r.status !== 0,
    "POST /auth/login response time < 5000ms": (r) => r.timings.duration < 5000,
    "POST /auth/login status acceptable": (r) =>
      r.status === 200 || r.status === 401 || r.status === 503,
  });

  if (!success) {
    errorRate.add(1);
  }
}
