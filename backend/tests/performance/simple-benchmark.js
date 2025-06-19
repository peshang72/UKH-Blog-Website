import http from "k6/http";
import { check } from "k6";

// Simple benchmark - quick performance check
export const options = {
  vus: 10, // 10 virtual users
  duration: "30s", // for 30 seconds
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95% of requests should be below 1s
    http_req_failed: ["rate<0.01"], // Error rate should be less than 1%
  },
};

const BASE_URL = "http://localhost:3000/api";

export default function () {
  // Simple test of the most common endpoint
  const response = http.get(`${BASE_URL}/blogs`);

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "response has content": (r) => r.body.length > 0,
  });
}
