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
│   ├── corporate-actions.data.ts # Test data for API tests
│   ├── db/
│   │   └── corporate-actions.db.ts # Test data for DB tests
│   ├── interfaces/
│   │   └── api-interfaces.ts    # TypeScript interfaces
│   └── validation.ts           # Test data validation helpers
├── tests/
│   ├── api/                   # API Tests
│   │   └── corporate-actions/
│   │       ├── search.spec.ts      # Search endpoint tests
│   │       ├── management.spec.ts  # Management endpoint tests
│   │       └── error-scenarios.spec.ts  # Error scenario tests
│   ├── db/                    # Database Tests
│   │   └── corporate-actions/
│   │       └── db.spec.ts         # Database operations tests
│   ├── fixtures/
│   │   ├── test-fixtures.ts    # Common test fixtures
│   │   └── db-fixtures.ts      # Database test fixtures
│   ├── helpers/
│   │   ├── api-helpers.ts      # API helper functions
│   │   └── db-helper.ts        # Database helper functions
│   └── gui/                    # GUI Tests
│       ├── pages/              # Page Object Models
│       │   ├── base.page.ts    # Base page with common functionality
│       │   ├── corporate-actions-search.page.ts
│       │   └── corporate-actions-details.page.ts
│       └── corporate-actions/ # Test specifications
│           ├── basic-search.spec.ts
│           └── search.spec.ts
├── scripts/
│   └── analyze-performance.js  # Performance analysis script
├── swaggerfile/
│   └── can-swagger.yml        # API documentation
├── playwright.config.ts       # Playwright configuration
└── package.json              # Project dependencies
```

## Test Organization

### API Tests (`tests/api/`)
- REST API endpoint testing
- Request/response validation
- Error handling
- Performance testing
- Integration testing

### Database Tests (`tests/db/`)
- Direct database operations
- Data integrity checks
- Transaction testing
- Performance testing
- Schema validation

### GUI Tests (`tests/gui/`)
- Web interface testing
- Page Object Model pattern
- Basic and advanced search
- Results verification
- Navigation flow
- Data consistency

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-org/can-api-tests.git
cd can-api-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Configure environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your API endpoints and credentials.

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

## Database Testing

### Prerequisites
1. IBM Informix Client SDK
   - Download from [IBM Informix Client SDK](https://www.ibm.com/support/pages/node/317083)
   - Install the SDK appropriate for your operating system
   - Add the following environment variables:
     ```bash
     INFORMIXDIR=C:\Program Files\IBM Informix Client-SDK
     PATH=%INFORMIXDIR%\bin;%PATH%
     ```

2. Node.js Dependencies
   ```bash
   npm install
   ```

### Database Configuration
1. Create a `.env` file in the project root:
```bash
# Informix Connection Settings
DB_SERVER=your_server_name
DB_HOST=localhost
DB_PORT=9088
DB_NAME=corporate_actions
DB_USER=informix
DB_PASSWORD=your_password
```

2. Configure `sqlhosts` file:
   - Location: `%INFORMIXDIR%\etc\sqlhosts`
   - Add your server configuration:
     ```
     your_server_name    onsoctcp    localhost    9088
     ```

### Running Database Tests
```bash
# Run all DB tests
npx playwright test tests/db

# Run specific DB test file
npx playwright test tests/db/corporate-actions/db.spec.ts

# Run specific test case
npx playwright test -g "T1_DB_GetCorporateAction_ValidId"
```

### Database Helper Features
The `DatabaseHelper` class (`tests/helpers/db-helper.ts`) provides:

1. Connection Management
   ```typescript
   const db = DatabaseHelper.getInstance();
   ```

2. Query Execution
   ```typescript
   // Query multiple rows
   const results = await db.query<YourType>(
     'SELECT * FROM your_table WHERE condition = ?',
     ['value']
   );

   // Query single row
   const result = await db.queryOne<YourType>(
     'SELECT * FROM your_table WHERE id = ?',
     [1]
   );
   ```

3. Data Modification
   ```typescript
   await db.execute(
     'INSERT INTO your_table (col1, col2) VALUES (?, ?)',
     ['value1', 'value2']
   );
   ```

4. Transaction Management
   ```typescript
   try {
     await db.beginTransaction();
     // ... perform operations
     await db.commitTransaction();
   } catch (error) {
     await db.rollbackTransaction();
     throw error;
   }
   ```

5. Test Data Management
   ```typescript
   // Clean tables
   await db.cleanup(['table1', 'table2']);

   // Seed test data
   await db.seedTestData('your_table', [
     { col1: 'value1', col2: 'value2' },
     { col1: 'value3', col2: 'value4' }
   ]);
   ```

### Best Practices

1. Connection Management
   - Use singleton pattern via `getInstance()`
   - Close connections after test completion
   - Handle connection errors gracefully

2. Transaction Safety
   - Always use transactions for data modifications
   - Implement proper error handling and rollback
   - Clean up test data after tests

3. Query Parameters
   - Use parameterized queries to prevent SQL injection
   - Never concatenate values directly into SQL strings
   - Handle NULL values appropriately

4. Error Handling
   - Catch and log database errors
   - Implement proper cleanup in error scenarios
   - Use meaningful error messages

5. Test Data
   - Use isolated test data
   - Clean up before and after tests
   - Use meaningful test data values

### Troubleshooting

1. Connection Issues
   - Verify Informix Client SDK installation
   - Check environment variables
   - Validate sqlhosts configuration
   - Confirm server accessibility

2. Permission Issues
   - Verify database user permissions
   - Check table access rights
   - Validate connection credentials

3. Data Type Issues
   - Use appropriate TypeScript types
   - Handle date/time conversions properly
   - Consider BLOB/CLOB data handling

4. Performance Issues
   - Use connection pooling
   - Implement proper indexing
   - Optimize query patterns
   - Clean up resources properly

### Common Error Solutions

1. "Cannot connect to database"
   - Check if Informix server is running
   - Verify connection string parameters
   - Confirm network connectivity
   - Check firewall settings

2. "Invalid credential"
   - Verify username and password
   - Check user permissions
   - Confirm database exists

3. "Transaction errors"
   - Check transaction isolation level
   - Verify lock timeout settings
   - Handle deadlock scenarios

## GUI Tests

The project includes automated GUI tests using Playwright. These tests verify the functionality of the Corporate Actions web interface.

### Test Structure

```
tests/gui/
├── pages/                    # Page Object Models
│   ├── base.page.ts         # Base page with common functionality
│   ├── corporate-actions-search.page.ts
│   └── corporate-actions-details.page.ts
└── corporate-actions/       # Test specifications
    ├── basic-search.spec.ts
    └── search.spec.ts
```

### Running GUI Tests

```bash
# Run all GUI tests
npx playwright test tests/gui --project=gui-tests

# Run specific test file
npx playwright test tests/gui/corporate-actions/basic-search.spec.ts --project=gui-tests

# Run tests with headed browser (visual mode)
npx playwright test tests/gui --project=gui-tests --headed

# Run tests and show report
npx playwright show-report
```

### Page Objects

The tests use the Page Object Model pattern to improve maintainability and reusability:

- **BasePage**: Common functionality for all pages
  - Navigation methods
  - Element interaction helpers
  - Waiting utilities

- **CorporateActionsSearchPage**: Search functionality
  - Basic and advanced search
  - Filtering and pagination
  - Results handling
  - Export functionality

- **CorporateActionsDetailsPage**: Details view
  - General information display
  - Position details
  - Message history
  - Status management

### Test Categories

1. **Basic Search Tests**
   - Simple search queries
   - Results verification
   - Navigation flow
   - Data consistency

2. **Advanced Search Tests**
   - Date range filtering
   - Status filtering
   - CAEV type filtering
   - Pagination
   - Export functionality

### Best Practices

1. **Test Organization**
   - One test file per feature area
   - Clear test descriptions
   - Logical test grouping

2. **Page Objects**
   - Encapsulated selectors
   - Reusable methods
   - Clear documentation
   - Type-safe interfaces

3. **Assertions**
   - Meaningful error messages
   - Complete verification
   - State validation

4. **Performance**
   - Efficient selectors
   - Smart waiting strategies
   - Resource cleanup

### Troubleshooting

Common issues and solutions:

1. **Test Timeouts**
   - Increase timeout in playwright.config.ts
   - Check network conditions
   - Verify element selectors

2. **Selector Issues**
   - Use Playwright Inspector to debug
   - Verify DOM structure
   - Update page objects if UI changes

3. **State Management**
   - Clear application state before tests
   - Handle loading states properly
   - Manage test data appropriately

### Maintenance

To keep tests reliable:

1. Regularly update page objects when UI changes
2. Review and update selectors
3. Maintain test data consistency
4. Monitor test execution times
5. Update documentation with changes

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

## Test Execution

### Running Tests Locally

```bash
# Run all tests
npm test

# Run specific test files
npm test tests/corporate-actions/search.spec.ts

# Run tests with specific tag
npm test -- --grep "@smoke"

# Run tests in UI mode
npm test -- --ui

# Run tests with specific configuration
TEST_ENV=development npm test
```

### Debug Tests
```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode with UI
npm run test:debug tests/corporate-actions/search.spec.ts
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
- HTML reports are generated automatically after test runs
- Reports include:
  - Test results summary
  - Test execution time
  - Screenshots of failures
  - Trace viewer for debugging
  - Network requests log
  - Console logs

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

## Troubleshooting

#### Common Issues
1. **API Connection Issues**
   - Check if the API is accessible
   - Verify environment variables
   - Check network/proxy settings

2. **Authentication Failures**
   - Verify API credentials in `.env`
   - Check token expiration
   - Ensure correct environment is set

3. **Test Failures**
   - Check test data validity
   - Verify API response structure
   - Review test logs for errors

#### Debug Logs
Enable debug logs for more detailed output:
```bash
# Enable Playwright debug logs
DEBUG=pw:api npm test

# Enable all debug logs
DEBUG=* npm test
```

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and run tests:
```bash
npm test
```

3. Create a pull request with:
   - Clear description of changes
   - Test results
   - Any relevant documentation updates

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
