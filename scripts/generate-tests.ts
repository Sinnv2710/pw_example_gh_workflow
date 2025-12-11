#!/usr/bin/env ts-node

/**
 * Test Generation Script
 *
 * Generates Playwright test specs from JSON test cases
 */

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from './logger'

const logger = new Logger('Test Generation')

interface TestStep {
  order: number
  description: string
  action: string
  locator?: string
  value?: string
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

interface TestSuite {
  name: string
  url: string
  description: string
  timestamp: string
  testCases: TestCase[]
}

/**
 * Parse JSON test cases file
 */
function loadTestCases(jsonPath: string): TestSuite {
  logger.progress(`📖 Loading test cases from: ${jsonPath}`)

  if (!fs.existsSync(jsonPath)) {
    logger.error(`File not found: ${jsonPath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(jsonPath, 'utf-8')
  const testSuite: TestSuite = JSON.parse(content)

  logger.success(`✓ Loaded ${testSuite.testCases.length} test cases`)
  return testSuite
}

/**
 * Map step action to Playwright code
 */
function mapActionToPlaywright(step: TestStep): string {
  const { action, locator, value } = step

  switch (action.toLowerCase()) {
    case 'fill':
      return `await page.locator('${locator}').fill('${value}')`
    case 'click':
      return `await page.locator('${locator}').click()`
    case 'check':
      return `await page.locator('${locator}').check()`
    case 'uncheck':
      return `await page.locator('${locator}').uncheck()`
    case 'select':
      return `await page.locator('${locator}').selectOption('${value}')`
    case 'type':
      return `await page.locator('${locator}').type('${value}')`
    case 'wait':
      return `await page.waitForTimeout(${value})`
    case 'navigate':
      return `await page.goto('${value}')`
    case 'assert_visible':
      return `await expect(page.locator('${locator}')).toBeVisible()`
    case 'assert_text':
      return `await expect(page.locator('${locator}')).toContainText('${value}')`
    case 'assert_url':
      return `await expect(page).toHaveURL('${value}')`
    default:
      return `// TODO: Implement action: ${action}`
  }
}

/**
 * Generate test file content from test cases
 */
function generateTestContent(testSuite: TestSuite): string {
  const importSection = `import { test, expect } from '@playwright/test'
import { BasePage } from '../pages/BasePage'

test.describe('${testSuite.name} - Test Suite', () => {
  let basePage: BasePage

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    await page.goto('${testSuite.url}')
  })

`

  const testCases = testSuite.testCases.map((tc) => {
    const steps = tc.steps
      .sort((a, b) => a.order - b.order)
      .map((step) => {
        const action = mapActionToPlaywright(step)
        return `    console.log('${step.order}. ${step.description}')\n    ${action}`
      })
      .join('\n\n')

    return `  test('${tc.id} - ${tc.title}', async ({ page }) => {
    // Type: ${tc.type} | Priority: ${tc.priority}
    // Preconditions: ${tc.preconditions}
    
${steps}

    // Expected Result: ${tc.expectedResult}
    console.log('✓ Test completed: ${tc.expectedResult}')
  })
`
  })

  const closingSection = `})`

  return importSection + testCases.join('\n') + closingSection
}

/**
 * Generate test spec files from JSON test cases
 */
async function generateTestSpecs(
  jsonPath: string,
  suiteName: string,
): Promise<void> {
  logger.header('🧪 GENERATING TEST SPECIFICATIONS')

  // Load test cases from JSON
  const testSuite = loadTestCases(jsonPath)

  logger.info(`Suite: ${testSuite.name}`)
  logger.info(`URL: ${testSuite.url}`)
  logger.info(`Test Cases: ${testSuite.testCases.length}`)

  // Generate test content
  const testContent = generateTestContent(testSuite)

  // Create test directory
  const testDir = path.join(process.cwd(), 'tests', 'test-cases')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
    logger.progress('Created tests/test-cases directory')
  }

  // Write test file
  const testFile = path.join(testDir, `${suiteName}.spec.ts`)
  fs.writeFileSync(testFile, testContent, 'utf-8')

  logger.success(`✓ Test spec generated: ${testFile}`)

  // Show breakdown
  logger.section('Test Case Breakdown')
  const happy = testSuite.testCases.filter((tc) => tc.type === 'Happy Path').length
  const negative = testSuite.testCases.filter((tc) => tc.type === 'Negative').length
  const edge = testSuite.testCases.filter((tc) => tc.type === 'Edge Case').length

  logger.bullet(`Happy Path: ${happy} cases`)
  logger.bullet(`Negative: ${negative} cases`)
  logger.bullet(`Edge Cases: ${edge} cases`)

  logger.complete(2)
}

// CLI Interface
const args = process.argv.slice(2)
const jsonIndex = args.indexOf('--json')
const suiteIndex = args.indexOf('--suite')

if (jsonIndex === -1 || suiteIndex === -1) {
  logger.error('Missing required arguments')
  logger.info('Usage: ts-node scripts/generate-tests.ts --json <PATH> --suite <NAME>')
  process.exit(1)
}

const jsonPath: string | undefined = args[jsonIndex + 1]
const suite = args[suiteIndex + 1]

generateTestSpecs(jsonPath as string, suite).catch((error) => {
  logger.error(`Failed to generate tests: ${error.message}`)
  process.exit(1)
})
