#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-t, --threshold <ms>', 'Performance threshold in milliseconds', parseInt)
  .option('-d, --directory <path>', 'Test results directory', 'test-results')
  .option('-o, --output <path>', 'Output directory', 'performance-results')
  .parse(process.argv);

const options = program.opts();

// Create output directory if it doesn't exist
if (!fs.existsSync(options.output)) {
  fs.mkdirSync(options.output, { recursive: true });
}

// Performance analysis results
const results = {
  totalTests: 0,
  passedThreshold: 0,
  failedThreshold: 0,
  slowestEndpoints: [],
  averageResponseTime: 0,
  testsByEndpoint: {},
  trends: {},
};

// Read test results
function analyzeResults(directory) {
  const files = fs.readdirSync(directory);
  const testResults = [];

  files.forEach(file => {
    if (file.endsWith('.json') && !file.includes('summary')) {
      const filePath = path.join(directory, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (content.suites) {
        processTestSuites(content.suites);
      }
    }
  });

  calculateMetrics();
  generateReport();
}

function processTestSuites(suites) {
  suites.forEach(suite => {
    if (suite.specs) {
      suite.specs.forEach(spec => {
        if (spec.tests) {
          spec.tests.forEach(test => {
            if (test.results) {
              processTestResults(test);
            }
          });
        }
      });
    }
    if (suite.suites) {
      processTestSuites(suite.suites);
    }
  });
}

function processTestResults(test) {
  if (!test.title.includes('@performance')) {
    return;
  }

  results.totalTests++;
  const duration = test.results[0].duration;
  const endpoint = extractEndpoint(test.title);

  // Track by endpoint
  if (!results.testsByEndpoint[endpoint]) {
    results.testsByEndpoint[endpoint] = {
      count: 0,
      totalDuration: 0,
      slowest: 0,
      fastest: Infinity,
    };
  }

  const endpointStats = results.testsByEndpoint[endpoint];
  endpointStats.count++;
  endpointStats.totalDuration += duration;
  endpointStats.slowest = Math.max(endpointStats.slowest, duration);
  endpointStats.fastest = Math.min(endpointStats.fastest, duration);

  // Check threshold
  if (duration > options.threshold) {
    results.failedThreshold++;
  } else {
    results.passedThreshold++;
  }

  // Track for slowest endpoints
  results.slowestEndpoints.push({
    endpoint,
    time: duration,
    test: test.title,
  });
}

function extractEndpoint(title) {
  // Extract endpoint from test title using regex or string manipulation
  const match = title.match(/T[14]_([^_]+)/);
  return match ? match[1] : 'Unknown';
}

function calculateMetrics() {
  // Sort slowest endpoints
  results.slowestEndpoints.sort((a, b) => b.time - a.time);
  results.slowestEndpoints = results.slowestEndpoints.slice(0, 5);

  // Calculate averages
  Object.keys(results.testsByEndpoint).forEach(endpoint => {
    const stats = results.testsByEndpoint[endpoint];
    stats.averageTime = stats.totalDuration / stats.count;
  });
}

function generateReport() {
  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: results.totalTests,
    passedThreshold: results.passedThreshold,
    failedThreshold: results.failedThreshold,
    slowestEndpoints: results.slowestEndpoints,
    endpointStats: results.testsByEndpoint,
  };

  // Write summary to file
  fs.writeFileSync(
    path.join(options.output, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );

  // Generate detailed report
  const reportContent = generateDetailedReport(summary);
  fs.writeFileSync(
    path.join(options.output, 'detailed-report.md'),
    reportContent
  );

  // Exit with error if there are failures
  if (results.failedThreshold > 0) {
    console.error(`❌ ${results.failedThreshold} tests exceeded the threshold of ${options.threshold}ms`);
    process.exit(1);
  }

  console.log(`✅ All ${results.totalTests} tests passed performance thresholds`);
}

function generateDetailedReport(summary) {
  return `# Performance Test Report
Generated: ${summary.timestamp}

## Summary
- Total Tests: ${summary.totalTests}
- Passed Threshold: ${summary.passedThreshold}
- Failed Threshold: ${summary.failedThreshold}
- Threshold: ${options.threshold}ms

## Slowest Endpoints
${summary.slowestEndpoints.map(e => `- ${e.endpoint}: ${e.time}ms (${e.test})`).join('\n')}

## Endpoint Statistics
${Object.entries(summary.endpointStats).map(([endpoint, stats]) => `
### ${endpoint}
- Count: ${stats.count}
- Average Time: ${Math.round(stats.averageTime)}ms
- Fastest: ${stats.fastest}ms
- Slowest: ${stats.slowest}ms
`).join('\n')}
`;
}

// Run analysis
try {
  analyzeResults(options.directory);
} catch (error) {
  console.error('Error analyzing performance results:', error);
  process.exit(1);
}
