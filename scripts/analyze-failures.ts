#!/usr/bin/env ts-node

/**
 * Failure Analysis Script
 * 
 * Analyzes test failures from trace files and execution logs
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

const logger = new Logger('Failure Analysis');

interface FailureInfo {
  testId: string;
  testName:  string;
  errorMessage: string;
  rootCause: string;
  traceFile: string;
  screenshot: string;
  suggestions: string[];
}

/**
 * Analyze test failures
 */
async function analyzeFailures(): Promise<void> {
  logger.header('🔍 ANALYZING TEST FAILURES');
  
  logger.progress('Reading test results...');
  
  const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
  
  if (!fs.existsSync(resultsPath)) {
    logger.warn('No test results found');
    return;
  }
  
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const failures: FailureInfo[] = [];
  
  // Parse failures
  results.suites?. forEach((suite: any) => {
    suite.specs?.forEach((spec: any) => {
      if (! spec.ok) {
        failures.push({
          testId: spec.title,
          testName: spec. title,
          errorMessage: spec.tests[0]?.results[0]?.error?.message || 'Unknown error',
          rootCause: identifyRootCause(spec),
          traceFile: spec. tests[0]?.results[0]?.attachments?. find((a: any) => a.name === 'trace')?.path || '',
          screenshot: spec.tests[0]?.results[0]?. attachments?.find((a: any) => a.name === 'screenshot')?.path || '',
          suggestions: generateSuggestions(spec)
        });
      }
    });
  });
  
  logger.success(`Found ${failures.length} failed tests`);
  
  if (failures.length === 0) {
    logger.success('No failures to analyze ✓');
    return;
  }
  
  // Generate analysis report
  const analysisDir = path.join(process.cwd(), 'analysis');
  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const reportPath = path.join(analysisDir, `failure-analysis-${timestamp}.md`);
  const reportContent = generateAnalysisReport(failures, timestamp);
  
  fs.writeFileSync(reportPath, reportContent, 'utf-8');
  
  logger.success(`Analysis report generated: ${reportPath}`);
  
  logger.section('Failure Summary');
  failures.forEach((failure, index) => {
    logger.bullet(`${index + 1}. ${failure.testName}`);
    logger.bullet(`Root Cause: ${failure.rootCause}`, 2);
  });
  
  logger.complete(7);
}

/**
 * Identify root cause of failure
 */
function identifyRootCause(spec: any): string {
  const error = spec.tests[0]?. results[0]?.error?. message || '';
  
  if (error.includes('Timeout') || error.includes('waiting for')) {
    return 'Timeout - Element not found or page load slow';
  } else if (error.includes('locator') || error.includes('selector')) {
    return 'Selector Issue - Element locator incorrect or element not present';
  } else if (error.includes('expect')) {
    return 'Assertion Failure - Expected condition not met';
  } else if (error.includes('Navigation')) {
    return 'Navigation Issue - Page navigation failed';
  } else {
    return 'Unknown - Requires manual investigation';
  }
}

/**
 * Generate fix suggestions
 */
function generateSuggestions(spec: any): string[] {
  const error = spec.tests[0]?. results[0]?.error?.message || '';
  const suggestions: string[] = [];
  
  if (error.includes('Timeout')) {
    suggestions.push('Increase timeout value');
    suggestions.push('Add explicit wait for element');
    suggestions.push('Check if element is dynamically loaded');
  } else if (error.includes('locator') || error.includes('selector')) {
    suggestions.push('Update selector in locator file');
    suggestions.push('Use fallback selector');
    suggestions.push('Add data-testid to element');
  } else if (error.includes('expect')) {
    suggestions.push('Review expected vs actual values');
    suggestions.push('Check test data validity');
    suggestions.push('Verify page state before assertion');
  }
  
  return suggestions;
}

/**
 * Generate markdown analysis report
 */
function generateAnalysisReport(failures: FailureInfo[], timestamp: string): string {
  let report = `# Test Failure Analysis Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  report += `**Total Failures:** ${failures.length}\n\n`;
  report += `---\n\n`;
  
  failures.forEach((failure, index) => {
    report += `## ${index + 1}. ${failure. testName}\n\n`;
    report += `**Test ID:** ${failure.testId}\n\n`;
    report += `**Root Cause:** ${failure.rootCause}\n\n`;
    report += `**Error Message:**\n\`\`\`\n${failure.errorMessage}\n\`\`\`\n\n`;
    
    if (failure. screenshot) {
      report += `**Screenshot:** \`${failure.screenshot}\`\n\n`;
    }
    
    if (failure.traceFile) {
      report += `**Trace File:** \`${failure.traceFile}\`\n\n`;
    }
    
    report += `**Suggested Fixes:**\n`;
    failure.suggestions.forEach(suggestion => {
      report += `- ${suggestion}\n`;
    });
    
    report += `\n---\n\n`;
  });
  
  return report;
}

// Execute
analyzeFailures().catch(error => {
  logger.error(`Failed to analyze failures: ${error. message}`);
  process.exit(1);
});