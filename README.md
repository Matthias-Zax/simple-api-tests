# Corporate Actions API Tests

This project contains automated API tests for the Corporate Actions API using Playwright. The tests are written in TypeScript and follow a structured approach to test different endpoints of the API.

## Project Structure

```
can-api-tests/
├── .github/
│   └── workflows/           # GitHub Actions workflow definitions
│       ├── main.yml        # Main test workflow
│       ├── smoke.yml       # Smoke test workflow
│       └── performance.yml # Performance test workflow
├── config/
│   └── environment.config.ts    # Environment configurations
├── test-data/
│   ├── corporate-actions.data.ts # Test data for all test cases
│   ├── interfaces/
│   │   └── api-interfaces.ts    # TypeScript interfaces for API requests/responses
│   └── validation.ts           # Test data validation helpers
├── tests/
│   ├── fixtures/
│   │   └── test-fixtures.ts    # Custom test fixtures
│   ├── helpers/
│   │   └── api-helpers.ts      # Common API helper functions
│   └── corporate-actions/
│       ├── search.spec.ts      # Tests for search endpoints
│       ├── details.spec.ts     # Tests for details endpoints
│       ├── history.spec.ts     # Tests for history endpoints
│       ├── management.spec.ts  # Tests for management endpoints
│       └── error-scenarios.spec.ts  # Tests for error scenarios
├── scripts/
│   └── analyze-performance.js  # Performance analysis script
├── swaggerfile/
│   └── can-swagger.yml        # API documentation
├── playwright.config.ts       # Playwright configuration
└── package.json              # Project dependencies
```

## Test Case Naming Convention

Test cases follow a structured naming pattern:
```
T[1|4]_Feature_TestData_ExpectedResult [@tag]
```

Where:
- **T1**: Positive test cases
- **T4**: Negative test cases (error scenarios)
- **Feature**: The specific feature being tested (e.g., SearchCorporateActions)
- **TestData**: The type of data being used (e.g., ValidFilters, InvalidIsin)
- **ExpectedResult**: The expected outcome (e.g., ReturnsFilteredList, Returns400)
- **@tag**: Optional tags for test categorization (e.g., @smoke, @performance)

Examples:
- `T1_SearchCorporateActions_ValidFilters_ReturnsFilteredList @smoke`
- `T4_SearchCorporateActions_InvalidIsin_Returns400`

## Continuous Integration

### GitHub Actions Workflows

#### 1. Main Workflow
Runs on:
- Push to main/develop branches
- Pull requests
- Daily schedule
- Manual trigger

Features:
- Parallel test execution by test group
- Test results artifact upload
- Automated test report generation
- Environment variable handling

#### 2. Smoke Tests
Runs on:
- Every 6 hours
- Manual trigger

Features:
- Runs critical path tests
- Automatic issue creation on failure
- Priority labeling
- Failure notifications

#### 3. Performance Tests
Runs on:
- Weekly schedule (Mondays)
- Manual trigger

Features:
- Response time monitoring
- Performance threshold checking
- Trend analysis
- Automated reporting

### Setting Up CI/CD

1. Configure GitHub Secrets:
```bash
# Required secrets
API_BASE_URL=your_api_url
API_USERNAME=your_username
API_PASSWORD=your_password
API_TOKEN=your_token
```

2. Tag Tests for Different Workflows:
```typescript
// Smoke test
test('T1_Search_Basic @smoke', async () => {
    // Test implementation
});

// Performance test
test('T1_Search_Performance @performance', async () => {
    // Performance test implementation
});
```

3. Configure Test Groups:
Edit `.github/workflows/main.yml` to modify test groups:
```yaml
strategy:
  matrix:
    test-group: [search, details, history, management, error-scenarios]
```

## Test Categories

### 1. API Interface Tests
- Request/response structure validation
- Field type verification
- Enum value validation
- Optional field handling

### 2. Functional Tests
- Basic CRUD operations
- Business logic validation
- Edge case handling
- Error scenarios

### 3. Performance Tests
- Response time benchmarking
- Load handling
- Resource usage monitoring
- Threshold validation

### 4. Security Tests
- Authentication
- Authorization
- Input validation
- Error handling

## Performance Analysis

### Script Usage
```bash
# Basic usage with default settings
node scripts/analyze-performance.js

# Custom configuration
node scripts/analyze-performance.js --threshold 2000 --directory test-results --output performance-results
```

### Command Line Options
- `--threshold <ms>`: Performance threshold in milliseconds (default: 2000)
- `--directory <path>`: Test results directory (default: test-results)
- `--output <path>`: Output directory (default: performance-results)

### Output Files

#### 1. Summary JSON (`summary.json`)
```json
{
  "timestamp": "2025-01-13T14:03:47+01:00",
  "totalTests": 100,
  "passedThreshold": 95,
  "failedThreshold": 5,
  "slowestEndpoints": [
    {
      "endpoint": "SearchCorporateActions",
      "time": 2500,
      "test": "T1_SearchCorporateActions_LargeDataset_ReturnsFilteredList"
    }
  ],
  "endpointStats": {
    "SearchCorporateActions": {
      "count": 50,
      "averageTime": 1200,
      "fastest": 500,
      "slowest": 2500
    }
  }
}
```

#### 2. Detailed Report (`detailed-report.md`)
- Overall test statistics
- List of slowest endpoints
- Per-endpoint performance metrics
- Historical trends
- Threshold violations

### Integration with CI/CD

The script is automatically run as part of the performance workflow:
```yaml
- name: Analyze Performance Results
  run: |
    node scripts/analyze-performance.js --threshold ${{ env.PERFORMANCE_THRESHOLD_MS }}
```

### Performance Metrics

1. **Response Times**
   - Average response time per endpoint
   - Fastest and slowest responses
   - Response time distribution

2. **Threshold Analysis**
   - Number of tests exceeding threshold
   - Percentage of passing tests
   - Trend analysis over time

3. **Endpoint Statistics**
   - Per-endpoint performance metrics
   - Identification of problematic endpoints
   - Historical performance data

4. **Reporting**
   - Automated report generation
   - Performance trends visualization
   - Threshold violation alerts

### Best Practices

1. **Setting Thresholds**
   - Base thresholds on historical data
   - Consider endpoint complexity
   - Account for network latency
   - Set different thresholds for different endpoints

2. **Monitoring**
   - Regular performance test execution
   - Trend analysis over time
   - Alert on significant changes
   - Track seasonal patterns

3. **Optimization**
   - Focus on slowest endpoints
   - Investigate threshold violations
   - Monitor resource usage
   - Track performance regressions

## Environment Setup

### Local Development
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Set up environment variables
export TEST_ENV=development
export API_USERNAME=your_username
export API_PASSWORD=your_password

# Run tests
npm test
```

### CI Environment
```bash
# Install dependencies
npm ci

# Install Playwright with dependencies
npx playwright install --with-deps

# Run specific test group
npm test tests/corporate-actions/search.spec.ts
```

## Test Execution

### Running Tests Locally

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/corporate-actions/search.spec.ts

# Run tests with specific tag
npm test -- --grep "@smoke"

# Run tests in UI mode
npm test -- --ui

# Run tests with specific configuration
TEST_ENV=development npm test
```

### Running in CI

```bash
# Trigger manual workflow run
gh workflow run main.yml

# Run smoke tests
gh workflow run smoke.yml

# Run performance tests
gh workflow run performance.yml
```

## Monitoring and Reporting

### Test Reports
- Available in GitHub Actions artifacts
- Generated after each test run
- Includes failure details and screenshots
- Performance metrics and trends

### Performance Monitoring
- Response time tracking
- Threshold violations
- Trend analysis
- Weekly performance reports

### Error Tracking
- Automatic issue creation
- Priority labeling
- Failure notifications
- Error pattern analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add or update tests following conventions
4. Update documentation
5. Submit a pull request

### Pull Request Guidelines
- Include test plan
- Add appropriate tags
- Update relevant documentation
- Follow code style guidelines
- Include performance considerations

## Recent Updates

- Added GitHub Actions workflows
- Enhanced test categorization with tags
- Improved performance monitoring
- Added automated reporting
- Enhanced documentation
- Added contribution guidelines
- Improved error handling and reporting

## Support

- Report issues via GitHub Issues
- Join discussions in GitHub Discussions
- Review wiki for common problems
- Contact team for urgent issues
