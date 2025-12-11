#!/usr/bin/env ts-node

/**
 * CSV Generation Script
 *
 * Generates test cases CSV from website exploration data
 * Format: 13 columns as specified
 */

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from './logger'

const logger = new Logger('CSV Generation')

interface TestCase {
	id: string
	suite: string
	title: string
	type: 'Happy Path' | 'Negative' | 'Edge Case'
	priority: 'High' | 'Medium' | 'Low'
	preconditions: string
	steps: string
	expectedResult: string
	testData: string
	status: 'Not Run' | 'Pass' | 'Fail' | 'Flaky'
	executionTime: string
	flakyCount: string
	comments: string
}

/**
 * Generate test cases CSV from exploration data
 */
async function generateTestCasesCSV(
	url: string,
	suiteName: string,
): Promise<void> {
	logger.header('📝 GENERATING TEST CASES CSV')

	logger.info(`Target URL: ${url}`)
	logger.info(`Test Suite: ${suiteName}`)
	logger.progress('Analyzing website structure...')

	// TODO: This will be replaced with actual Playwright agent exploration data
	// For now, we create a template structure

	const testCases: TestCase[] = generateTemplateTestCases(suiteName)

	logger.success(`Generated ${testCases.length} test cases`)

	// Create CSV directory if it doesn't exist
	const csvDir = path.join(process.cwd(), 'test-suites')
	if (!fs.existsSync(csvDir)) {
		fs.mkdirSync(csvDir, { recursive: true })
		logger.progress('Created test-suites directory')
	}

	// Generate CSV content
	const csvPath = path.join(csvDir, `${suiteName}-test-cases. csv`)
	const csvContent = convertToCSV(testCases)

	// Write to file
	fs.writeFileSync(csvPath, csvContent, 'utf-8')

	logger.success(`CSV saved to: ${csvPath}`)

	// Show breakdown
	logger.section('Test Case Breakdown')

	const happy = testCases.filter((tc) => tc.type === 'Happy Path').length
	const negative = testCases.filter((tc) => tc.type === 'Negative').length
	const edge = testCases.filter((tc) => tc.type === 'Edge Case').length

	logger.bullet(`Happy Path: ${happy} cases`)
	logger.bullet(`Negative: ${negative} cases`)
	logger.bullet(`Edge Cases: ${edge} cases`)

	logger.complete(2)
}

/**
 * Convert test cases to CSV format (13 columns)
 */
function convertToCSV(testCases: TestCase[]): string {
	const headers = [
		'Test ID',
		'Test Suite',
		'Test Case Title',
		'Test Type',
		'Priority',
		'Preconditions',
		'Test Steps',
		'Expected Result',
		'Test Data',
		'Status',
		'Execution Time',
		'Flaky Count',
		'Comments',
	]

	let csv = headers.join(',') + '\n'

	testCases.forEach((tc) => {
		const row = [
			tc.id,
			tc.suite,
			escapeCSV(tc.title),
			tc.type,
			tc.priority,
			escapeCSV(tc.preconditions),
			escapeCSV(tc.steps),
			escapeCSV(tc.expectedResult),
			escapeCSV(tc.testData),
			tc.status,
			tc.executionTime,
			tc.flakyCount,
			escapeCSV(tc.comments),
		]

		csv += row.join(',') + '\n'
	})

	return csv
}

/**
 * Escape special characters for CSV
 */
function escapeCSV(value: string): string {
	if (!value) return ''

	// If contains comma, newline, or quote, wrap in quotes and escape existing quotes
	if (value.includes(',') || value.includes('\n') || value.includes('"')) {
		return `"${value.replace(/"/g, '""')}"`
	}

	return value
}

/**
 * Generate template test cases (placeholder until agent integration)
 */
function generateTemplateTestCases(suiteName: string): TestCase[] {
	const testCases: TestCase[] = []

	// Happy Path example
	testCases.push({
		id: 'TC-001',
		suite: suiteName,
		title: 'Valid user flow - Happy path',
		type: 'Happy Path',
		priority: 'High',
		preconditions: 'User account exists, Browser open',
		steps:
			'1. Navigate to homepage\n2. Enter valid credentials\n3. Click submit\n4. Verify success',
		expectedResult: 'User successfully completes the flow',
		testData: 'username: test@example.com, password: Test123!',
		status: 'Not Run',
		executionTime: '',
		flakyCount: '0',
		comments: '',
	})

	// Negative example
	testCases.push({
		id: 'TC-002',
		suite: suiteName,
		title: 'Invalid input - Error handling',
		type: 'Negative',
		priority: 'High',
		preconditions: 'Browser open',
		steps:
			'1. Navigate to homepage\n2. Enter invalid data\n3. Click submit\n4. Verify error message',
		expectedResult: 'Error message displayed: Invalid input',
		testData: 'username: invalid',
		status: 'Not Run',
		executionTime: '',
		flakyCount: '0',
		comments: '',
	})

	// Edge case example
	testCases.push({
		id: 'TC-003',
		suite: suiteName,
		title: 'Empty input fields',
		type: 'Edge Case',
		priority: 'Medium',
		preconditions: 'Browser open',
		steps:
			'1. Navigate to homepage\n2. Leave all fields empty\n3. Click submit\n4. Verify validation',
		expectedResult: 'Validation error: Required fields empty',
		testData: '',
		status: 'Not Run',
		executionTime: '',
		flakyCount: '0',
		comments: '',
	})

	return testCases
}

// CLI Interface
const args = process.argv.slice(2)
const urlIndex = args.indexOf('--url')
const suiteIndex = args.indexOf('--suite')

if (urlIndex === -1 || suiteIndex === -1) {
	logger.error('Missing required arguments')
	logger.info(
		'Usage: ts-node scripts/generate-csv.ts --url <URL> --suite <NAME>',
	)
	process.exit(1)
}

const url: string | undefined = args[urlIndex + 1]
const suite = args[suiteIndex + 1]

generateTestCasesCSV(url as string, suite).catch((error) => {
	logger.error(`Failed to generate CSV: ${error.message}`)
	process.exit(1)
})
