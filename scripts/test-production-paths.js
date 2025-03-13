#!/usr/bin/env node

/**
 * DentalHub Critical Paths Testing Script
 * 
 * This script helps track and document testing of critical user paths
 * as specified in the TEST-CRITICAL-PATHS.md document.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CRITICAL_PATHS_FILE = path.join(process.cwd(), '..', 'docs', 'TEST-CRITICAL-PATHS.md');
const RESULTS_FILE = path.join(process.cwd(), 'TEST-RESULTS.md');

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Test result tracking
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  results: []
};

// Main function
async function main() {
  console.log(`${COLORS.bright}${COLORS.blue}DentalHub Critical Paths Test${COLORS.reset}\n`);
  
  try {
    // Read the critical paths document
    if (!fs.existsSync(CRITICAL_PATHS_FILE)) {
      throw new Error(`Critical paths file not found at ${CRITICAL_PATHS_FILE}`);
    }
    
    const content = fs.readFileSync(CRITICAL_PATHS_FILE, 'utf8');
    const paths = parseCriticalPaths(content);
    
    if (paths.length === 0) {
      throw new Error('No critical paths found in the document');
    }
    
    console.log(`${COLORS.green}Found ${paths.length} critical paths to test${COLORS.reset}\n`);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (query) => new Promise((resolve) => rl.question(query, resolve));
    
    // Ask the tester for environment details
    const environment = await question('Enter test environment (e.g., production, staging, local): ');
    const tester = await question('Enter your name (for the test report): ');
    console.log('');
    
    // Test each critical path
    for (const [index, path] of paths.entries()) {
      console.log(`${COLORS.bright}${COLORS.blue}Testing Path ${index + 1}/${paths.length}: ${path.title}${COLORS.reset}`);
      console.log(`${COLORS.cyan}Description: ${path.description}${COLORS.reset}`);
      
      if (path.steps.length > 0) {
        console.log(`${COLORS.cyan}Steps:${COLORS.reset}`);
        path.steps.forEach((step, i) => {
          console.log(`${COLORS.cyan}  ${i + 1}. ${step}${COLORS.reset}`);
        });
      }
      
      console.log('');
      const testResult = await question(`Did this path pass testing? (y/n/s for skip): `);
      
      let status = '';
      let notes = '';
      
      if (testResult.toLowerCase() === 'y') {
        status = 'passed';
        testResults.passed++;
        console.log(`${COLORS.green}✓ Path marked as PASSED${COLORS.reset}`);
      } else if (testResult.toLowerCase() === 'n') {
        status = 'failed';
        testResults.failed++;
        notes = await question('Enter notes about what failed: ');
        console.log(`${COLORS.red}✗ Path marked as FAILED${COLORS.reset}`);
      } else {
        status = 'skipped';
        testResults.skipped++;
        notes = await question('Enter reason for skipping: ');
        console.log(`${COLORS.yellow}⏭️ Path marked as SKIPPED${COLORS.reset}`);
      }
      
      testResults.total++;
      testResults.results.push({
        title: path.title,
        description: path.description,
        steps: path.steps,
        status,
        notes,
        tester,
        environment,
        timestamp: new Date().toISOString()
      });
      
      console.log('');
    }
    
    // Generate test report
    generateTestReport(tester, environment);
    
    console.log(`${COLORS.green}Test report generated: ${RESULTS_FILE}${COLORS.reset}`);
    console.log(`\n${COLORS.bright}${COLORS.blue}Test Summary:${COLORS.reset}`);
    console.log(`${COLORS.green}Passed: ${testResults.passed}${COLORS.reset}`);
    console.log(`${COLORS.red}Failed: ${testResults.failed}${COLORS.reset}`);
    console.log(`${COLORS.yellow}Skipped: ${testResults.skipped}${COLORS.reset}`);
    console.log(`${COLORS.cyan}Total: ${testResults.total}${COLORS.reset}`);
    
    rl.close();
  } catch (error) {
    console.error(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  }
}

// Parse the critical paths from the markdown document
function parseCriticalPaths(content) {
  const paths = [];
  
  // Split the content by headers
  const lines = content.split('\n');
  let currentPath = null;
  let inStepsList = false;
  
  for (const line of lines) {
    // Check for heading level 2 (##)
    if (line.startsWith('## ')) {
      // If we already have a current path, add it to the list
      if (currentPath) {
        paths.push(currentPath);
      }
      
      // Start a new path
      currentPath = {
        title: line.substring(3).trim(),
        description: '',
        steps: []
      };
      
      inStepsList = false;
    } 
    // Check for heading level 3 (###)
    else if (line.startsWith('### ') && line.toLowerCase().includes('step')) {
      inStepsList = true;
    }
    // Add description or steps
    else if (currentPath) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.length > 0) {
        if (inStepsList && trimmedLine.startsWith('- ')) {
          // Add step
          currentPath.steps.push(trimmedLine.substring(2).trim());
        } else if (!inStepsList && !line.startsWith('#')) {
          // Add to description (but not headers)
          if (currentPath.description.length > 0) {
            currentPath.description += ' ' + trimmedLine;
          } else {
            currentPath.description = trimmedLine;
          }
        }
      }
    }
  }
  
  // Add the last path if there is one
  if (currentPath) {
    paths.push(currentPath);
  }
  
  return paths;
}

// Generate markdown test report
function generateTestReport(tester, environment) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];
  
  let report = `# DentalHub Critical Paths Test Report\n\n`;
  report += `**Generated:** ${dateStr} at ${timeStr}\n`;
  report += `**Environment:** ${environment}\n`;
  report += `**Tester:** ${tester}\n\n`;
  
  // Overall summary
  report += `## Summary\n\n`;
  report += `- **Total Paths:** ${testResults.total}\n`;
  report += `- **Passed:** ${testResults.passed}\n`;
  report += `- **Failed:** ${testResults.failed}\n`;
  report += `- **Skipped:** ${testResults.skipped}\n\n`;
  
  // Calculate pass rate
  const passRate = testResults.total > 0 ? (testResults.passed / testResults.total * 100).toFixed(1) : 0;
  report += `**Pass Rate:** ${passRate}%\n\n`;
  
  // Critical path test results
  report += `## Test Results\n\n`;
  
  // First, failed paths
  if (testResults.failed > 0) {
    report += `### Failed Paths ❌\n\n`;
    
    for (const result of testResults.results.filter(r => r.status === 'failed')) {
      report += `#### ${result.title}\n\n`;
      report += `${result.description}\n\n`;
      
      if (result.steps.length > 0) {
        report += `**Steps:**\n\n`;
        result.steps.forEach((step, i) => {
          report += `${i + 1}. ${step}\n`;
        });
        report += '\n';
      }
      
      report += `**Notes:** ${result.notes}\n\n`;
      report += `**Tested By:** ${result.tester} at ${new Date(result.timestamp).toLocaleString()}\n\n`;
      report += `---\n\n`;
    }
  }
  
  // Passed paths
  if (testResults.passed > 0) {
    report += `### Passed Paths ✅\n\n`;
    
    for (const result of testResults.results.filter(r => r.status === 'passed')) {
      report += `#### ${result.title}\n\n`;
      report += `${result.description}\n\n`;
      
      if (result.steps.length > 0) {
        report += `**Steps:**\n\n`;
        result.steps.forEach((step, i) => {
          report += `${i + 1}. ${step}\n`;
        });
        report += '\n';
      }
      
      report += `**Tested By:** ${result.tester} at ${new Date(result.timestamp).toLocaleString()}\n\n`;
      report += `---\n\n`;
    }
  }
  
  // Skipped paths
  if (testResults.skipped > 0) {
    report += `### Skipped Paths ⏭️\n\n`;
    
    for (const result of testResults.results.filter(r => r.status === 'skipped')) {
      report += `#### ${result.title}\n\n`;
      report += `${result.description}\n\n`;
      
      if (result.steps.length > 0) {
        report += `**Steps:**\n\n`;
        result.steps.forEach((step, i) => {
          report += `${i + 1}. ${step}\n`;
        });
        report += '\n';
      }
      
      report += `**Reason for Skipping:** ${result.notes}\n\n`;
      report += `**Tested By:** ${result.tester} at ${new Date(result.timestamp).toLocaleString()}\n\n`;
      report += `---\n\n`;
    }
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  if (testResults.failed > 0) {
    report += `- **High Priority:** Fix the ${testResults.failed} failed paths before release.\n`;
  }
  
  if (testResults.skipped > 0) {
    report += `- **Medium Priority:** Complete testing for the ${testResults.skipped} skipped paths.\n`;
  }
  
  if (passRate < 95) {
    report += `- **Important:** Current pass rate (${passRate}%) is below the recommended 95% threshold for production.\n`;
  } else {
    report += `- **Good:** Current pass rate (${passRate}%) meets or exceeds the recommended threshold for production.\n`;
  }
  
  // Write report to file
  fs.writeFileSync(RESULTS_FILE, report, 'utf8');
}

// Run the script
main().catch(err => {
  console.error(`${COLORS.red}Fatal error: ${err.message}${COLORS.reset}`);
  process.exit(1);
});