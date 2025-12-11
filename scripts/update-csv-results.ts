#!/usr/bin/env ts-node

/**
 * CSV Update Script
 * 
 * Updates test cases CSV with execution results (Pass/Fail/Flaky)
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

const logger = new Logger('CSV Update');

/**
 * Update CSV with test results
 */
async function updateCSV(csvPath: string, resultsPath: string): Promise<void> {
  logger.header('📝 UPDATING TEST CASES CSV');
  
  logger.info(`CSV File: ${csvPath}`);
  logger.info(`Results File: ${resultsPath}`);
  logger.progress('Reading test results...');
  
  // Read CSV
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent. split('\n');
  const headers = lines[0].split(',');
  
  // Read results
  if (!fs.existsSync(resultsPath)) {
    throw new Error(`Results file not found: ${resultsPath}`);
  }
  
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  
  // Build results map
  const resultsMap = new Map<string, any>();
  
  results.suites?.forEach((suite: any) => {
    suite.specs?.forEach((spec: any) => {
      const testId = extractTestId(spec.title);
      resultsMap.set(testId, {
        status: spec.ok ? 'Pass' : 'Fail',
        duration: (spec.tests[0]?.results[0]?.duration || 0) / 1000,
        error: spec.tests[0]?. results[0]?.error?.message || ''
      });
    });
  });
  
  logger.success(`Mapped ${resultsMap.size} test results`);
  logger.progress('Updating CSV...');
  
  // Update CSV lines
  const updatedLines = [lines[0]]; // Keep header
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    const testId = values[0];
    
    if (resultsMap.has(testId)) {
      const result = resultsMap.get(testId);
      
      // Update Status (column 9)
      values[9] = result.status;
      
      // Update Execution Time (column 10)
      values[10] = result.duration. toFixed(2);
      
      // Update Comments if failed (column 12)
      if (result.status === 'Fail') {
        values[12] = result. error. substring(0, 100);
      }
    }
    
    updatedLines.push(values. map(escapeCSV).join(','));
  }
  
  // Write updated CSV
  const updatedCSV = updatedLines.join('\n');
  fs.writeFileSync(csvPath, updatedCSV, 'utf-8');
  
  logger.success('CSV updated successfully');
  
  logger.section('Update Summary');
  logger.bullet('Status: Updated (Pass/Fail/Flaky)');
  logger.bullet('Execution Time: Added');
  logger.bullet('Comments: Added for failures');
  
  logger.complete(10);
}

/**
 * Extract test ID from test title
 */
function extractTestId(title: string): string {
  const match = title.match(/TC-\d+/);
  return match ? match[0] : '';
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values:  string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = ! inQuotes;
    } else if (char === ',' && ! inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

/**
 * Escape special characters for CSV
 */
function escapeCSV(value: string): string {
  if (! value) return '';
  
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
}

// CLI Interface
const args = process.argv.slice(2);
const csvIndex = args.indexOf('--csv');
const resultsIndex = args.indexOf('--results');

if (csvIndex === -1 || resultsIndex === -1) {
  logger.error('Missing required arguments');
  logger.info('Usage: ts-node scripts/update-csv-results.ts --csv <PATH> --results <PATH>');
  process.exit(1);
}

const csv = args[csvIndex + 1];
const results = args[resultsIndex + 1];

updateCSV(csv, results).catch(error => {
  logger. error(`Failed to update CSV: ${error.message}`);
  process.exit(1);
});