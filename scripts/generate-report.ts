#!/usr/bin/env ts-node

/**
 * Report Generation Script
 *
 * Generates HTML/PDF test execution report
 */

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from './logger'

const logger = new Logger('Report Generation')

/**
 * Generate test execution report
 */
async function generateReport(): Promise<void> {
	logger.header('📊 GENERATING TEST REPORT')

	logger.progress('Creating HTML report...')

	const resultsPath = path.join(process.cwd(), 'test-results', 'results.json')

	if (!fs.existsSync(resultsPath)) {
		logger.error('Test results not found')
		return
	}

	const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))

	// Calculate stats
	let totalTests = 0
	let passed = 0
	let failed = 0

	results.suites?.forEach((suite: any) => {
		suite.specs?.forEach((spec: any) => {
			totalTests++
			if (spec.ok) passed++
			else failed++
		})
	})

	const passRate =
		totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : '0'

	// Generate HTML report
	const reportDir = path.join(process.cwd(), 'reports')
	if (!fs.existsSync(reportDir)) {
		fs.mkdirSync(reportDir, { recursive: true })
	}

	const timestamp = new Date()
		.toISOString()
		.replace(/[:.]/g, '-')
		.substring(0, 19)
	const reportPath = path.join(reportDir, `test-report-${timestamp}.html`)

	const htmlContent = generateHTMLReport({
		totalTests,
		passed,
		failed,
		passRate,
		timestamp,
		results,
	})

	fs.writeFileSync(reportPath, htmlContent, 'utf-8')

	logger.success(`HTML report generated: ${reportPath}`)

	logger.section('Report Summary')
	logger.bullet(`Total Tests: ${totalTests}`)
	logger.bullet(`✓ Passed: ${passed}`)
	logger.bullet(`✗ Failed: ${failed}`)
	logger.bullet(`Success Rate: ${passRate}%`)

	logger.complete(9)
}

/**
 * Generate HTML report content
 */
function generateHTMLReport(data: any): string {
	return `<!DOCTYPE html>
<html>
<head>
  <title>Test Execution Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    . summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stat { display: inline-block; margin: 10px 20px 10px 0; }
    . stat . value { font-size: 32px; font-weight: bold; }
    .stat .label { color: #666; }
    . pass { color: #28a745; }
    .fail { color: #dc3545; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
    th { background-color: #f8f9fa; font-weight: 600; }
    .status-pass { color: #28a745; font-weight: bold; }
    .status-fail { color: #dc3545; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🧪 Test Execution Report</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <div class="stat">
      <div class="value">${data.totalTests}</div>
      <div class="label">Total Tests</div>
    </div>
    <div class="stat">
      <div class="value pass">${data.passed}</div>
      <div class="label">Passed</div>
    </div>
    <div class="stat">
      <div class="value fail">${data.failed}</div>
      <div class="label">Failed</div>
    </div>
    <div class="stat">
      <div class="value">${data.passRate}%</div>
      <div class="label">Success Rate</div>
    </div>
  </div>
  
  <p><strong>Generated: </strong> ${data.timestamp}</p>
  
  <h2>Test Results</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case</th>
        <th>Status</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      ${generateTestRows(data.results)}
    </tbody>
  </table>
</body>
</html>`
}

/**
 * Generate table rows for tests
 */
function generateTestRows(results: any): string {
	let rows = ''

	results.suites?.forEach((suite: any) => {
		suite.specs?.forEach((spec: any) => {
			const status = spec.ok ? 'PASS' : 'FAIL'
			const statusClass = spec.ok ? 'status-pass' : 'status-fail'
			const duration = spec.tests[0]?.results[0]?.duration || 0

			rows += `
      <tr>
        <td>${spec.title}</td>
        <td class="${statusClass}">${status}</td>
        <td>${(duration / 1000).toFixed(2)}s</td>
      </tr>`
		})
	})

	return rows
}

// Execute
generateReport().catch((error) => {
	logger.error(`Failed to generate report: ${error.message}`)
	process.exit(1)
})
