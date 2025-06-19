# Backend Testing Guide

This guide covers comprehensive testing strategies and procedures for the UBW Blog backend system.

## 🧪 Testing Stack

### Core Testing Tools

- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library for API testing
- **MongoDB Memory Server** - In-memory MongoDB for isolated testing
- **Babel** - JavaScript transpiler for ES modules support

### Testing Types Implemented

1. **Unit Tests** - Individual function testing
2. **Integration Tests** - API endpoint testing
3. **Model Tests** - Database model validation
4. **Authentication Tests** - Security and authorization testing

## 📁 Test Structure

```
backend/
├── tests/
│   ├── setup.js                    # Jest configuration and database setup
│   ├── helpers/
│   │   └── testHelpers.js          # Reusable test utilities
│   ├── unit/
│   │   ├── models/
│   │   │   ├── user.test.js        # User model tests
│   │   │   └── blog.test.js        # Blog model tests
│   │   └── controllers/
│   │       ├── userController.test.js  # User controller tests
│   │       └── blogController.test.js  # Blog controller tests
│   └── integration/
│       ├── auth.test.js            # Authentication endpoint tests
│       ├── blogs.test.js           # Blog endpoint tests
│       └── admin.test.js           # Admin functionality tests
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Test Environment

Ensure you have the `.env.test` file with test configurations:

```env
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-testing
MONGODB_URI=mongodb://localhost:27017/ubw_blog_test
PORT=3001
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## 📊 Test Coverage

### Current Test Coverage Areas

#### User Management

- ✅ User registration validation
- ✅ User login authentication
- ✅ Password hashing and comparison
- ✅ JWT token generation and validation
- ✅ User profile retrieval
- ✅ Duplicate user prevention

#### Blog Management

- ✅ Blog creation with authentication
- ✅ Blog retrieval (public and private)
- ✅ Blog updates by author
- ✅ Blog deletion by author
- ✅ Authorization checks
- ✅ Admin blog management

#### Security & Authorization

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Protected route testing
- ✅ Admin-only functionality
- ✅ User ownership validation

#### Database Operations

- ✅ Model validation
- ✅ Required field enforcement
- ✅ Unique constraint testing
- ✅ Data persistence verification

## 🛠️ Testing Methodologies

### 1. Test-Driven Development (TDD)

- Write tests before implementing features
- Red-Green-Refactor cycle
- Ensures comprehensive test coverage

### 2. Behavior-Driven Development (BDD)

- Tests describe expected behavior
- Clear test descriptions using `describe` and `test`
- User story-focused testing

### 3. Isolated Testing

- Each test runs in isolation
- Database reset between tests
- No dependencies between tests

### 4. Mocking Strategy

- Mock external dependencies
- Mock database calls in unit tests
- Use real database for integration tests

## 📋 Test Procedures

### Running Different Test Types

#### Unit Tests

```bash
# Test individual functions and methods
npm run test:unit

# Test specific model
npm test -- --testPathPattern="user.test.js"

# Test specific controller
npm test -- --testPathPattern="userController.test.js"
```

#### Integration Tests

```bash
# Test API endpoints end-to-end
npm run test:integration

# Test specific endpoint group
npm test -- --testPathPattern="auth.test.js"
```

#### Coverage Analysis

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### Continuous Integration

```bash
# Run tests in CI environment
NODE_ENV=test npm test

# Run tests with coverage threshold
npm run test:coverage -- --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

## 🔧 Test Utilities

### Helper Functions

The `testHelpers.js` file provides utilities for:

- Creating test users and admins
- Generating JWT tokens
- Creating test blog posts
- Hashing passwords

### Database Management

- Automatic database cleanup between tests
- In-memory MongoDB for fast testing
- Isolated test environment

## 📈 Performance Testing

### ✅ **K6 Performance Testing Implemented**

The project now includes comprehensive K6 performance tests using **MongoDB Atlas database** for realistic performance metrics.

#### Quick Performance Test

```bash
# Ensure main server is running (uses Atlas database)
npm start

# Run 30-second benchmark with 10 users (tests Atlas database)
k6 run backend/tests/performance/simple-benchmark.js
```

#### Available Test Types

- **Simple Benchmark**: 30s, 10 users - Quick health check
- **Load Test**: 20min, up to 50 users - Normal expected load
- **Stress Test**: 31min, up to 300 users - Find breaking points
- **Spike Test**: 8min, spike to 1400 users - Traffic surge resilience

#### Atlas Database Testing

🎓 **University Project**: Performance tests use the **actual MongoDB Atlas database**:

- **Main Server**: Port 3000 (actual blog application)
- **Atlas Database**: `cluster0.hhqpcvv.mongodb.net/University-Blog-Website`
- **Configuration**: Loaded from `.env` file
- **Real-World Testing**: Includes network latency and cloud database performance

#### Recent Performance Results (Atlas Database)

✅ **Simple Benchmark Results**:

- **Requests/Second**: ~23 req/s (realistic for cloud database)
- **Response Time**: avg 428ms, p95 617ms (includes network latency)
- **Success Rate**: 100% (0% errors)
- **Load Capacity**: Good performance with 10 concurrent users testing real Atlas database

### Alternative Load Testing Tools

For additional testing, consider:

- **Artillery** - Load testing toolkit
- **Apache Bench (ab)** - HTTP server benchmarking
- **wrk** - Modern HTTP benchmarking tool

Example Artillery configuration:

```yaml
config:
  target: "http://localhost:3000" # Note: port 3000 tests Atlas database
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Blog API Load Test"
    requests:
      - get:
          url: "/api/blogs"
```

## 🐛 Debugging Tests

### Common Issues

1. **Database Connection Errors**

   - Ensure MongoDB is running
   - Check test database configuration

2. **JWT Token Issues**

   - Verify JWT_SECRET in test environment
   - Check token expiration settings

3. **Async Test Problems**
   - Use `async/await` properly
   - Handle promise rejections

### Debug Commands

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- backend/tests/integration/auth.test.js

# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📝 Writing New Tests

### Test Structure Template

```javascript
describe("Feature Name", () => {
  describe("Specific Functionality", () => {
    test("should perform expected behavior", async () => {
      // Arrange
      const testData = {
        /* test data */
      };

      // Act
      const result = await functionUnderTest(testData);

      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Best Practices

1. **Clear Test Names** - Describe what the test does
2. **Arrange-Act-Assert** - Structure tests clearly
3. **One Assertion Per Test** - Keep tests focused
4. **Clean Test Data** - Use fresh data for each test
5. **Mock External Dependencies** - Isolate the code under test

## 🔍 Test Automation

### Pre-commit Hooks (Optional)

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit test hook
npx husky add .husky/pre-commit "npm test"
```

### GitHub Actions (Optional)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
      - run: npm test
```

## 📊 Test Metrics

### Coverage Goals

- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

### Test Quality Metrics

- Test execution time < 30 seconds
- No flaky tests (inconsistent results)
- Clear test failure messages
- Comprehensive edge case coverage

## 🎯 Next Steps

### Recommended Enhancements

1. **Add Performance Tests** - Response time validation
2. **Security Testing** - SQL injection, XSS prevention
3. **Contract Testing** - API contract validation
4. **Visual Regression Testing** - UI consistency (if applicable)
5. **Chaos Engineering** - System resilience testing

### Monitoring and Reporting

- Set up test result dashboards
- Implement test trend analysis
- Configure failure notifications
- Track test coverage over time

---

This testing guide provides a comprehensive framework for maintaining high-quality, reliable backend code through automated testing.
