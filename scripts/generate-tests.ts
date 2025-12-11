#!/usr/bin/env ts-node

/**
 * Test Specification Generation Script
 * 
 * Generates Playwright test specs from CSV test cases
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

const logger = new Logger('Test Generation');

/**
 * Generate test spec file from CSV
 */
async function generateTestSpecs(suiteName: string, csvPath: string): Promise<void> {
  logger.header('🧪 GENERATING TEST SPECIFICATIONS');
  
  logger.info(`Test Suite: ${suiteName}`);
  logger.info(`CSV File: ${csvPath}`);
  logger.progress('Creating Playwright test specs...');
  
  // Read CSV file
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const testCases = parseCSV(csvContent);
  
  // Create test-cases directory
  const testCasesDir = path.join(process.cwd(), 'tests', 'test-cases');
  if (!fs.existsSync(testCasesDir)) {
    fs.mkdirSync(testCasesDir, { recursive: true });
  }
  
  // Generate test content
  const testContent = generateTestContent(suiteName, testCases);
  const testPath = path.join(testCasesDir, `${suiteName}.spec.ts`);
  
  fs.writeFileSync(testPath, testContent, 'utf-8');
  
  logger.success(`Generated test spec: tests/test-cases/${suiteName}.spec.ts`);
  logger.bullet(`Created ${testCases.length} test cases`);
  
  logger.complete(5);
}

/**
 * Parse CSV content into test case objects
 */
function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const testCases: any[] = [];
  
  for (let i = 1; i < lines. length; i++) {
    if (! lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    const testCase: any = {};
    
    headers.forEach((header, index) => {
      testCase[header. trim()] = values[index]?.replace(/^"|"$/g, '').trim();
    });
    
    testCases.push(testCase);
  }
  
  return testCases;
}

/**
 * Generate test file content
 */
function generateTestContent(suiteName: string, testCases: any[]): string {
  const className = capitalize(suiteName) + 'Page';
  
  let content = `import { test, expect } from '@playwright/test';
import { ${className} } from '../pages/${className}';

/**
 * ${suiteName} Test Suite
 * 
 * Auto-generated from CSV test cases
 */
test.describe('${suiteName} Tests', () => {
  let ${suiteName}Page: ${className};

  test.beforeEach(async ({ page }) => {
    ${suiteName}Page = new ${className}(page);
    await ${suiteName}Page.goto();
  });

`;

  testCases.forEach(tc => {
    content += `
  test('${tc['Test ID']}:  ${tc['Test Case Title']}', async ({ page }) => {
    // Test Type:  ${tc['Test Type']}
    // Priority: ${tc['Priority']}
    
    // TODO:  Implement test steps: 
    // ${tc['Test Steps']?. replace(/\\n/g, '\n    // ')}
    
    // Expected Result: ${tc['Expected Result']}
  });
`;
  });

  content += '});\n';
  
  return content;
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// CLI Interface
const args = process.argv.slice(2);
const suiteIndex = args. indexOf('--suite');
const csvIndex = args.indexOf('--csv');

if (suiteIndex === -1 || csvIndex === -1) {
  logger.error('Missing required arguments');
  logger.info('Usage: ts-node scripts/generate-tests.ts --suite <NAME> --csv <PATH>');
  process.exit(1);
}

const suite = args[suiteIndex + 1];
const csv = args[csvIndex + 1];

generateTestSpecs(suite, csv).catch(error => {
  logger.error(`Failed to generate test specs: ${error.message}`);
  process.exit(1);
});