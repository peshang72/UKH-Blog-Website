# Performance Testing Guide

This directory contains performance tests for the UBW Blog backend API using K6.

## Prerequisites

### Install K6

**Ubuntu/Debian:**

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**macOS:**

```bash
brew install k6
```

**Windows:**

```bash
choco install k6
```

## Test Types

### 1. Simple Benchmark (`simple-benchmark.js`)

- **Purpose**: Quick performance check
- **Duration**: 30 seconds
- **Users**: 10 concurrent users
- **Use case**: Regular health checks, development testing

```bash
k6 run backend/tests/performance/simple-benchmark.js
```

### 2. Load Test (`load-test.js`)

- **Purpose**: Test normal expected load
- **Duration**: 20 minutes total
- **Users**: Gradually scales to 50 concurrent users
- **Use case**: Validate performance under expected traffic

```bash
# First, ensure main server is running:
npm start

# Then run the load test (tests Atlas database):
npm run test:performance
# or
k6 run backend/tests/performance/load-test.js
```

### 3. Stress Test (`stress-test.js`)

- **Purpose**: Find breaking points
- **Duration**: 31 minutes total
- **Users**: Scales up to 300 concurrent users
- **Use case**: Determine system limits and failure modes

```bash
# First, ensure main server is running:
npm start

# Then run the stress test (tests Atlas database):
npm run test:stress
# or
k6 run backend/tests/performance/stress-test.js
```

### 4. Spike Test (`spike-test.js`)

- **Purpose**: Test sudden traffic spikes
- **Duration**: 8 minutes total
- **Users**: Sudden spike to 1400 users
- **Use case**: Test system resilience to traffic surges

```bash
# First, ensure main server is running:
npm start

# Then run the spike test (tests Atlas database):
npm run test:spike
# or
k6 run backend/tests/performance/spike-test.js
```

## Before Running Tests

### 🎓 **University Project Setup - Testing Real Atlas Database**

Performance tests are configured to test the **actual blog system** with MongoDB Atlas database for authentic performance metrics.

1. **Start the main blog server:**

   ```bash
   npm start
   # or
   cd backend && npm run server
   ```

   This server:

   - Runs on port **3000** (main application server)
   - Uses **MongoDB Atlas** database from `.env`
   - Connects to your real cloud database: `cluster0.hhqpcvv.mongodb.net`
   - Provides realistic performance testing with network latency

2. **Ensure stable internet connection** (for Atlas connectivity)

3. **Verify server is running:**
   ```bash
   curl http://localhost:3000/api/blogs
   ```

### Quick Test Setup

For the simple benchmark test:

```bash
# Ensure main server is running on port 3000
npm start

# Run the quick test (tests Atlas database)
k6 run backend/tests/performance/simple-benchmark.js
```

## Test Scenarios

Each test covers different scenarios:

- **Public endpoints**: `/api/blogs`, `/api/blogs/:id`
- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Protected endpoints**: `/api/auth/profile`, `/api/user/blogs`
- **Blog operations**: `/api/post-blog`

## Understanding Results

### Key Metrics

- **http_req_duration**: Response time
- **http_req_failed**: Failed request rate
- **http_reqs**: Total requests per second
- **vus**: Active virtual users
- **iterations**: Completed test iterations

### Thresholds

- **Load Test**: 95% of requests < 2s, error rate < 5%
- **Stress Test**: 95% of requests < 5s, error rate < 10%
- **Spike Test**: 95% of requests < 10s, error rate < 20%

### Sample Output

```
     ✓ GET /blogs status is 200
     ✓ GET /blogs response time < 1000ms

     checks.........................: 100.00% ✓ 1234      ✗ 0
     data_received..................: 1.2 MB  41 kB/s
     data_sent......................: 123 kB  4.1 kB/s
     http_req_duration..............: avg=245ms    min=123ms med=234ms max=567ms p(90)=345ms p(95)=456ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 1234
     http_reqs......................: 1234    41.13/s
     iterations.....................: 1234    41.13/s
     vus............................: 10      min=10     max=50
     vus_max........................: 50      min=50     max=50
```

## Performance Optimization Tips

### Backend Optimizations

1. **Database Indexing**

   - Add indexes for frequently queried fields
   - Use compound indexes for complex queries

2. **Caching**

   - Implement Redis for session storage
   - Cache frequently accessed blog posts
   - Use HTTP caching headers

3. **Connection Pooling**

   - Configure MongoDB connection pool size
   - Optimize database connection settings

4. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Use middleware like `express-rate-limit`

### Example Optimizations

```javascript
// Add to server.js
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

## Alternative Performance Testing Tools

### 1. Apache Bench (ab)

```bash
# Simple load test (tests Atlas database)
ab -n 1000 -c 10 http://localhost:3000/api/blogs
```

### 2. Artillery

```bash
npm install -g artillery
artillery quick --count 10 --num 100 http://localhost:3000/api/blogs
```

### 3. wrk

```bash
# Install wrk first (tests Atlas database)
wrk -t12 -c400 -d30s http://localhost:3000/api/blogs
```

### 4. JMeter

- GUI-based tool
- Good for complex test scenarios
- Requires Java installation

## Monitoring During Tests

1. **System Resources**:

   ```bash
   htop  # Monitor CPU and memory
   iotop # Monitor disk I/O
   ```

2. **Node.js Performance**:

   ```bash
   node --inspect server.js  # Enable debugging
   ```

3. **MongoDB Performance**:
   ```bash
   mongotop  # Monitor MongoDB operations
   mongostat # MongoDB statistics
   ```

## Continuous Integration

Add performance tests to your CI pipeline:

```yaml
# .github/workflows/performance.yml
name: Performance Tests
on:
  schedule:
    - cron: "0 2 * * *" # Run daily at 2 AM
  workflow_dispatch:

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm run server &
      - run: sleep 10
      - run: k6 run backend/tests/performance/load-test.js
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure backend server is running
2. **High Error Rates**: Check server logs for errors
3. **Slow Response Times**: Monitor system resources
4. **Test Timeouts**: Adjust test thresholds or server capacity

### Debug Mode

Run tests with debug output:

```bash
k6 run --http-debug backend/tests/performance/load-test.js
```
