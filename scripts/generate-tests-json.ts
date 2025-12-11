#!/usr/bin/env ts-node

/**
 * JSON Test Cases Generation Script
 *
 * Generates test cases in JSON format from website exploration data
 * Outputs to: test-suites/{suiteName}-test-cases.json
 */

import * as fs from 'fs'
import * as path from 'path'
import { chromium } from '@playwright/test'
import { Logger } from './logger'

const logger = new Logger('JSON Generation')

interface PageElement {
	type: 'input' | 'button' | 'link' | 'text'
	label?: string
	placeholder?: string
	locator: string
	name?: string
}

interface ExplorationData {
	url: string
	title: string
	elements: PageElement[]
	forms: any[]
}

interface TestCase {
	id: string
	suite: string
	title: string
	type: 'Happy Path' | 'Negative' | 'Edge Case'
	priority: 'High' | 'Medium' | 'Low'
	preconditions: string
	steps: TestStep[]
	expectedResult: string
	testData: Record<string, any>
	status: 'Not Run' | 'Pass' | 'Fail' | 'Flaky'
	comments: string
}

interface TestStep {
	order: number
	description: string
	action: string
	locator?: string
	value?: string
}

/**
 * Explore website dynamically using Playwright
 */
async function exploreWebsite(url: string): Promise<ExplorationData> {
	logger.progress(`🌐 Launching browser to explore: ${url}`)

	const browser = await chromium.launch()
	const page = await browser.newPage()

	await page.goto(url, { waitUntil: 'networkidle' })

	const pageData = await page.evaluate((): any => {
		const inputs = Array.from(
			document.querySelectorAll('input, textarea, select'),
		).map((el) => ({
			type: 'input',
			label:
				(el as any).getAttribute('aria-label') ||
				(el as any).getAttribute('placeholder') ||
				'',
			placeholder: (el as any).placeholder || '',
			locator: `#${(el as any).id}` || `.${(el as any).className}`,
			name: (el as any).name || '',
		}))

		const buttons = Array.from(
			document.querySelectorAll('button, [type="submit"]'),
		).map((el) => ({
			type: 'button',
			label: (el as any).textContent?.trim() || '',
			locator: `text=${(el as any).textContent?.trim()}`,
			name: (el as any).name || '',
		}))

		const forms = Array.from(document.querySelectorAll('form')).map(
			(form) => ({
				id: (form as any).id || '',
				inputs: (form as any).querySelectorAll('input').length,
				buttons: (form as any).querySelectorAll('button').length,
			}),
		)

		return {
			url: (window as any).location.href,
			title: (document as any).title,
			inputs,
			buttons,
			forms,
		}
	})

	await browser.close()
	logger.success(`✓ Website exploration complete`)

	return {
		url,
		title: pageData.title,
		elements: [...pageData.inputs, ...pageData.buttons],
		forms: pageData.forms,
	}
}

/**
 * Generate dynamic test cases from exploration data
 */
function generateDynamicTestCases(
	suiteName: string,
	explorationData: ExplorationData,
): TestCase[] {
	const testCases: TestCase[] = []

	const inputs = explorationData.elements.filter((el) => el.type === 'input')
	const buttons = explorationData.elements.filter((el) => el.type === 'button')

	// TC-001: Happy Path - Fill all inputs and submit
	if (inputs.length > 0 && buttons.length > 0) {
		const fillSteps: TestStep[] = inputs.map((input, idx) => ({
			order: idx + 1,
			description: `Enter valid data into "${input.label || input.placeholder}"`,
			action: 'fill',
			locator: input.locator,
			value: `test_value_${idx}`,
		}))

		const clickStep: TestStep = {
			order: inputs.length + 1,
			description: `Click "${buttons[0].label}" button`,
			action: 'click',
			locator: buttons[0].locator,
		}

		const steps = [...fillSteps, clickStep]

		const testData: Record<string, any> = {}
		inputs.forEach((input, idx) => {
			testData[input.name || `input_${idx}`] = `test_value_${idx}`
		})

		testCases.push({
			id: 'TC-001',
			suite: suiteName,
			title: `Valid flow - Fill ${inputs.length} input(s) and submit`,
			type: 'Happy Path',
			priority: 'High',
			preconditions: `Browser open, navigated to ${explorationData.title}`,
			steps,
			expectedResult: 'Form submitted successfully, success page displayed',
			testData,
			status: 'Not Run',
			comments: `Generated from ${inputs.length} detected inputs`,
		})
	}

	// TC-002: Negative - Empty inputs
	if (inputs.length > 0 && buttons.length > 0) {
		testCases.push({
			id: 'TC-002',
			suite: suiteName,
			title: 'Negative - Submit with empty inputs',
			type: 'Negative',
			priority: 'High',
			preconditions: `Browser open, navigated to ${explorationData.title}`,
			steps: [
				{
					order: 1,
					description: `Leave all ${inputs.length} input(s) empty`,
					action: 'wait',
					value: '500',
				},
				{
					order: 2,
					description: `Click "${buttons[0].label}" button`,
					action: 'click',
					locator: buttons[0].locator,
				},
			],
			expectedResult: 'Validation error shown for required fields',
			testData: { allFieldsEmpty: true },
			status: 'Not Run',
			comments: 'Validates required field handling',
		})
	}

	// TC-003: Edge Case - Special characters
	if (inputs.length > 0) {
		const firstInput = inputs[0]
		testCases.push({
			id: 'TC-003',
			suite: suiteName,
			title: 'Edge Case - Special characters in input',
			type: 'Edge Case',
			priority: 'Medium',
			preconditions: `Browser open, navigated to ${explorationData.title}`,
			steps: [
				{
					order: 1,
					description: `Enter special characters into "${firstInput.label || firstInput.placeholder}"`,
					action: 'fill',
					locator: firstInput.locator,
					value: '<script>alert(1)</script>',
				},
				{
					order: 2,
					description: 'Click submit',
					action: 'click',
					locator: buttons[0]?.locator || 'button[type="submit"]',
				},
			],
			expectedResult: 'Input sanitized or error shown, no XSS vulnerability',
			testData: {
				[firstInput.name || 'input']: '<script>alert(1)</script>',
			},
			status: 'Not Run',
			comments: 'Security: XSS prevention check',
		})
	}

	return testCases
}

/**
 * Convert test cases to JSON format with proper structure
 */
interface TestSuiteJSON {
	name: string
	url: string
	description: string
	timestamp: string
	positiveCases: TestCase[]
	negativeCases: TestCase[]
	edgeCases: TestCase[]
}

function convertToJSON(
	suiteName: string,
	url: string,
	testCases: TestCase[],
): TestSuiteJSON {
	return {
		name: suiteName,
		url: url,
		description: `Automated test suite for ${suiteName}`,
		timestamp: new Date().toISOString(),
		positiveCases: testCases.filter((tc) => tc.type === 'Happy Path'),
		negativeCases: testCases.filter((tc) => tc.type === 'Negative'),
		edgeCases: testCases.filter((tc) => tc.type === 'Edge Case'),
	}
}

/**
 * Generate test cases JSON from website exploration
 */
async function generateTestCasesJSON(
	url: string,
	suiteName: string,
): Promise<void> {
	logger.header('📝 GENERATING TEST CASES JSON')

	logger.info(`Target URL: ${url}`)
	logger.info(`Test Suite: ${suiteName}`)

	// Explore website dynamically
	const explorationData = await exploreWebsite(url)

	logger.info(`Page Title: ${explorationData.title}`)
	logger.info(`Detected Elements: ${explorationData.elements.length}`)
	logger.info(
		`  - Inputs: ${explorationData.elements.filter((e) => e.type === 'input').length}`,
	)
	logger.info(
		`  - Buttons: ${explorationData.elements.filter((e) => e.type === 'button').length}`,
	)

	// Generate dynamic test cases
	const testCases = generateDynamicTestCases(suiteName, explorationData)

	logger.success(`Generated ${testCases.length} dynamic test cases`)

	// Convert to JSON structure
	const jsonSuite = convertToJSON(suiteName, url, testCases)

	// Create test-suites directory
	const jsonDir = path.join(process.cwd(), 'test-suites')
	if (!fs.existsSync(jsonDir)) {
		fs.mkdirSync(jsonDir, { recursive: true })
		logger.progress('Created test-suites directory')
	}

	// Write JSON file
	const normalizedName = suiteName.replace(/\s+/g, '_')
	const jsonPath = path.join(jsonDir, `${normalizedName}-test-cases.json`)
	fs.writeFileSync(jsonPath, JSON.stringify(jsonSuite, null, 2), 'utf-8')

	logger.success(`JSON saved to: ${jsonPath}`)

	// Show breakdown
	logger.section('Test Case Breakdown')
	logger.bullet(`Happy Path: ${jsonSuite.positiveCases.length} cases`)
	logger.bullet(`Negative: ${jsonSuite.negativeCases.length} cases`)
	logger.bullet(`Edge Cases: ${jsonSuite.edgeCases.length} cases`)

	logger.complete(2)
}

// CLI Interface
const args = process.argv.slice(2)
const urlIndex = args.indexOf('--url')
const suiteIndex = args.indexOf('--suite')

if (urlIndex === -1 || suiteIndex === -1) {
	logger.error('Missing required arguments')
	logger.info('Usage: ts-node scripts/generate-tests-json.ts --url <URL> --suite <NAME>')
	process.exit(1)
}

const url: string | undefined = args[urlIndex + 1]
const suite = args[suiteIndex + 1]

generateTestCasesJSON(url as string, suite).catch((error: Error) => {
	logger.error(`Failed to generate JSON: ${error.message}`)
	process.exit(1)
})
