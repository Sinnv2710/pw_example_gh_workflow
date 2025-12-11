#!/usr/bin/env ts-node

/**
 * AI-Powered JSON Test Cases Generation Script
 *
 * Generates intelligent test cases using OpenRouter AI (Amazon Nova 2 Lite)
 * Outputs to: test-suites/{suiteName}-test-cases.json
 */

import * as fs from 'fs'
import * as path from 'path'
import { chromium } from '@playwright/test'
import { Logger } from './logger'
import fetch from 'node-fetch'

const logger = new Logger('AI Test Generation')

interface PageElement {
    type: 'input' | 'button' | 'link' | 'text'
    label?: string
    placeholder?: string
    locator: string
    name?: string
    inputType?: string
    required?: boolean
}

interface ExplorationData {
    url: string
    title: string
    screenshot: string
    elements: PageElement[]
    forms: any[]
    pageStructure: {
        forms: number
        tables: number
        headings: string[]
        mainText: string
    }
    html: string
}

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

interface TestSuiteJSON {
    name: string
    url: string
    description: string
    timestamp: string
    positiveCases: TestCase[]
    negativeCases: TestCase[]
    edgeCases: TestCase[]
}

/**
 * Explore website dynamically using Playwright
 */
async function exploreWebsite(url: string): Promise<ExplorationData> {
    logger.progress(`🌐 Launching browser to explore: ${url}`)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    })
    const page = await context.newPage()

    try {
        // Try with networkidle first, but with longer timeout
        await page
            .goto(url, { waitUntil: 'networkidle', timeout: 60000 })
            .catch(async (error) => {
                logger.warn(`Network idle timeout, falling back to domcontentloaded...`)
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
            })

        // Wait for dynamic content
        await page.waitForTimeout(3000)

        logger.success(`✓ Page loaded: ${page.url()}`)

        // Take screenshot for AI visual context
        const screenshotPath = path.join(process.cwd(), 'temp-screenshot.png')
        await page.screenshot({ path: screenshotPath, fullPage: false, timeout: 10000 })
        const screenshot = fs.readFileSync(screenshotPath, { encoding: 'base64' })

        const pageData = await page.evaluate(() => {
            const inputs = Array.from(
                document.querySelectorAll('input, textarea, select'),
            ).map((el: any, idx) => ({
                type: 'input' as const,
                label:
                    el.getAttribute('aria-label') ||
                    el.getAttribute('placeholder') ||
                    el.getAttribute('title') ||
                    el.name ||
                    el.id ||
                    `input-${idx}`,
                placeholder: el.placeholder || '',
                locator:
                    el.id
                        ? `#${el.id}`
                        : el.name
                        ? `[name="${el.name}"]`
                        : `input:nth-of-type(${idx + 1})`,
                name: el.name || '',
                inputType: el.type || 'text',
                required: el.required || false,
            }))

            const buttons = Array.from(
                document.querySelectorAll('button, [type="submit"], [role="button"]'),
            ).map((el: any, idx) => ({
                type: 'button' as const,
                label: el.textContent?.trim() || el.value || el.getAttribute('aria-label') || `button-${idx}`,
                locator:
                    el.id
                        ? `#${el.id}`
                        : el.textContent?.trim()
                        ? `button:has-text("${el.textContent.trim()}")`
                        : `button:nth-of-type(${idx + 1})`,
                name: el.name || '',
            }))

            const links = Array.from(document.querySelectorAll('a[href]'))
                .slice(0, 15)
                .map((el: any) => ({
                    type: 'link' as const,
                    label: el.textContent?.trim() || '',
                    locator: `a:has-text("${el.textContent?.trim()}")`,
                    href: el.href,
                }))

            const forms = Array.from(document.querySelectorAll('form')).map(
                (form: any) => ({
                    id: form.id || '',
                    action: form.action || '',
                    inputs: form.querySelectorAll('input').length,
                    buttons: form.querySelectorAll('button').length,
                }),
            )

            const pageStructure = {
                forms: document.querySelectorAll('form').length,
                tables: document.querySelectorAll('table').length,
                headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(
                    (h: any) => h.textContent?.trim(),
                ),
                mainText:
                    document.querySelector('main, [role="main"], .content')?.textContent?.substring(0, 500) || '',
            }

            return {
                url: window.location.href,
                title: document.title,
                inputs,
                buttons,
                links,
                forms,
                pageStructure,
                html: document.body.innerHTML.substring(0, 3000),
            }
        })

        await browser.close()
        fs.unlinkSync(screenshotPath) // Cleanup

        logger.success(`✓ Website exploration complete`)
        logger.info(`  - Inputs: ${pageData.inputs.length}`)
        logger.info(`  - Buttons: ${pageData.buttons.length}`)
        logger.info(`  - Links: ${pageData.links.length}`)
        logger.info(`  - Forms: ${pageData.forms.length}`)

        return {
            url,
            title: pageData.title,
            screenshot,
            elements: [...pageData.inputs, ...pageData.buttons],
            forms: pageData.forms,
            pageStructure: pageData.pageStructure,
            html: pageData.html,
        }
    } catch (error: any) {
        await browser.close()
        logger.error(`Failed to explore website: ${error.message}`)
        throw error
    }
}

/**
 * Generate test cases using OpenRouter AI (Amazon Nova 2 Lite)
 */
async function generateTestCasesWithAI(
    explorationData: ExplorationData,
    suiteName: string,
): Promise<TestSuiteJSON> {
    logger.progress(`🤖 Generating test cases with AI (Amazon Nova 2 Lite)...`)

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
        logger.error('OPENROUTER_API_KEY environment variable not set')
        logger.info('Get your free API key at: https://openrouter.ai/keys')
        logger.info('Then set: export OPENROUTER_API_KEY="sk-or-v1-..."')
        throw new Error('Missing OPENROUTER_API_KEY')
    }

    const inputs = explorationData.elements.filter((e) => e.type === 'input')
    const buttons = explorationData.elements.filter((e) => e.type === 'button')

    const prompt = `You are a senior QA automation engineer with 10+ years of experience. Analyze this web page and design a comprehensive test strategy.

**Your Task:**
1. **ANALYZE** the page structure and complexity
2. **REASON** about what needs testing based on:
   - Number and types of inputs (${inputs.length} detected)
   - Number of buttons/actions (${buttons.length} detected)
   - Forms detected: ${explorationData.forms.length}
   - Business logic you can infer from the page
3. **DESIGN** as many test cases as YOU think are necessary for thorough coverage
4. **PRIORITIZE** critical paths vs nice-to-have tests

**Page Analysis Data:**

**URL:** ${explorationData.url}
**Title:** ${explorationData.title}

**Page Structure:**
${JSON.stringify(explorationData.pageStructure, null, 2)}

**Detected Input Elements (${inputs.length}):**
${JSON.stringify(inputs.slice(0, 20).map(i => ({
    label: i.label,
    type: i.inputType,
    locator: i.locator,
    required: i.required
})), null, 2)}

**Detected Buttons (${buttons.length}):**
${JSON.stringify(buttons.slice(0, 15).map(b => ({
    label: b.label,
    locator: b.locator
})), null, 2)}

**HTML Context (first 2000 chars for understanding):**
${explorationData.html.substring(0, 2000)}

---

**Instructions:**

Think step-by-step like an experienced QA engineer:

1. **What is this page for?** (Login? Form? Dashboard? E-commerce?)
2. **What are the critical user flows?** (Happy paths that MUST work)
3. **What could go wrong?** (Validation, errors, edge cases)
4. **What security risks exist?** (XSS, injection, authentication bypass)
5. **What accessibility concerns?** (Screen readers, keyboard navigation)
6. **What performance/UX issues?** (Slow loading, race conditions)

Based on your analysis, generate **AS MANY TEST CASES AS NEEDED** to ensure quality. This could be:
- Simple page with 1 form → 5-8 tests
- Complex form with 10+ fields → 15-25 tests
- Dashboard with multiple widgets → 20-40 tests
- E-commerce checkout → 30-50 tests

**Test Categories to Consider:**

**Positive Tests (Happy Paths):**
- Valid flows with correct data
- Successful submissions
- Expected navigation
- Feature demonstrations

**Negative Tests:**
- Invalid inputs (wrong format, type, range)
- Required field validation
- Empty submissions
- Incorrect credentials
- Server error scenarios
- Network failures

**Edge Cases:**
- Boundary values (min/max, 0, -1, MAX_INT)
- Special characters: !@#$%^&*()_+-=[]{}|;:',.<>?
- Unicode/emoji: 你好🚀
- Very long strings (use placeholder: "{{LARGE_STRING_500}}")
- XSS: <script>alert('XSS')</script>
- SQL injection: ' OR '1'='1
- HTML injection: <img src=x onerror=alert(1)>
- Path traversal: ../../etc/passwd
- Concurrent actions (double-click, rapid submit)
- Session/token expiry

**Accessibility Tests:**
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader compatibility
- Focus management
- ARIA labels

**Performance/UX Tests:**
- Page load time
- Form auto-save
- Loading states
- Error recovery

**CRITICAL RULES:**
- Use ACTUAL locators from the detected elements above
- Generate REALISTIC test data appropriate for field types:
  - Email: testuser@example.com, invalid@, @domain.com
  - Password: Test123!@#, 123, verylongpassword123456789
  - Phone: +1-555-0100, 123, abc123
  - Date: 2024-01-15, 99/99/9999, 2024-13-45
  - Number: 42, -1, 0, 999999999, 0.5
- For large inputs, use: "{{LARGE_STRING_500}}" or "{{LARGE_STRING_1000}}"
- NO JavaScript code in JSON (.repeat(), functions, template literals)
- Provide detailed step descriptions
- Include expected results and preconditions

**Output valid JSON in this structure:**

{
  "name": "${suiteName}",
  "url": "${explorationData.url}",
  "description": "AI-designed comprehensive test suite based on page analysis",
  "timestamp": "${new Date().toISOString()}",
  "analysis": {
    "pageType": "Describe what this page does",
    "complexity": "Simple|Medium|Complex",
    "criticalFlows": ["List critical user flows"],
    "riskAreas": ["List high-risk areas to test"],
    "recommendedTestCount": "Your reasoning for number of tests"
  },
  "positiveCases": [
    {
      "id": "TC-POS-001",
      "suite": "${suiteName}",
      "title": "Descriptive title explaining what is being tested",
      "type": "Happy Path",
      "priority": "High",
      "preconditions": "Specific preconditions needed",
      "steps": [
        {"order": 1, "description": "Detailed action description", "action": "navigate|fill|click|check|select|wait|assert_visible|assert_text|assert_url", "locator": "actual_locator", "value": "actual_value"}
      ],
      "expectedResult": "Clear, measurable expected outcome",
      "testData": {"key": "value"},
      "status": "Not Run",
      "comments": "Why this test is important"
    }
  ],
  "negativeCases": [],
  "edgeCases": []
}

**Use your expert judgment to determine the right amount of coverage. Quality > Quantity, but be thorough!**`

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/playwright-test-generator',
                'X-Title': 'Playwright AI Test Generator',
            },
            body: JSON.stringify({
                model: 'amazon/nova-lite-v1',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior QA automation engineer. Analyze pages deeply and design comprehensive test strategies. Use your reasoning to determine appropriate test coverage.'
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 12000, // Increased to allow more test cases
                temperature: 0.7, // Higher for more creative test scenarios
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
        }

        const data: any = await response.json()
        let aiResponse = data.choices[0]?.message?.content || ''

        logger.info(`AI Response received (${aiResponse.length} chars)`)

        // Save raw response for debugging
        const debugPath = path.join(process.cwd(), 'ai-response-debug.txt')
        fs.writeFileSync(debugPath, aiResponse, 'utf-8')

        // Extract JSON
        let jsonText = aiResponse.trim()
        
        const jsonMatch = jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/)
        if (jsonMatch) {
            jsonText = jsonMatch[1].trim()
        }
        
        const objectMatch = jsonText.match(/\{[\s\S]*\}/)
        if (objectMatch) {
            jsonText = objectMatch[0]
        }

        // Clean up any JavaScript expressions
        logger.progress('Cleaning up JSON...')
        
        // Remove any .repeat() calls
        jsonText = jsonText.replace(/"[a-z]"\.repeat\(\d+\)/gi, '"{{LARGE_STRING_500}}"')
        
        // Try to parse
        let testSuite: any
        try {
            testSuite = JSON.parse(jsonText)
        } catch (parseError: any) {
            logger.error(`JSON Parse Error: ${parseError.message}`)
            logger.warn('Attempting to fix common JSON issues...')
            
            jsonText = jsonText
                .replace(/,(\s*[}\]])/g, '$1')
                .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
                .replace(/:\s*'([^']*)'/g, ': "$1"')
            
            try {
                testSuite = JSON.parse(jsonText)
                logger.success('✓ JSON fixed and parsed successfully!')
            } catch (secondError: any) {
                const posMatch = secondError.message.match(/position (\d+)/)
                const pos = posMatch ? parseInt(posMatch[1]) : 0
                const snippet = jsonText.substring(Math.max(0, pos - 100), pos + 100)
                logger.warn(`Problematic area:\n${snippet}`)
                
                fs.writeFileSync('ai-response-cleaned.txt', jsonText, 'utf-8')
                
                throw new Error('AI generated invalid JSON. Check ai-response-debug.txt and ai-response-cleaned.txt')
            }
        }

        // Show AI's analysis
        if (testSuite.analysis) {
            logger.section('AI Analysis')
            logger.bullet(`Page Type: ${testSuite.analysis.pageType || 'Unknown'}`)
            logger.bullet(`Complexity: ${testSuite.analysis.complexity || 'Unknown'}`)
            if (testSuite.analysis.criticalFlows) {
                logger.bullet(`Critical Flows: ${testSuite.analysis.criticalFlows.join(', ')}`)
            }
            if (testSuite.analysis.recommendedTestCount) {
                logger.bullet(`Reasoning: ${testSuite.analysis.recommendedTestCount}`)
            }
        }

        // Post-process: Replace placeholders
        const processTestCases = (cases: TestCase[]) => {
            if (!cases) return
            cases.forEach(testCase => {
                testCase.steps.forEach(step => {
                    if (step.value === '{{LARGE_STRING_500}}') {
                        step.value = 'a'.repeat(500)
                    }
                    if (step.value === '{{LARGE_STRING_1000}}') {
                        step.value = 'a'.repeat(1000)
                    }
                })
                if (testCase.testData) {
                    Object.keys(testCase.testData).forEach(key => {
                        if (testCase.testData[key] === '{{LARGE_STRING_500}}') {
                            testCase.testData[key] = 'a'.repeat(500)
                        }
                    })
                }
            })
        }

        testSuite.positiveCases = testSuite.positiveCases || []
        testSuite.negativeCases = testSuite.negativeCases || []
        testSuite.edgeCases = testSuite.edgeCases || []

        processTestCases(testSuite.positiveCases)
        processTestCases(testSuite.negativeCases)
        processTestCases(testSuite.edgeCases)

        const totalCases =
            testSuite.positiveCases.length +
            testSuite.negativeCases.length +
            testSuite.edgeCases.length

        if (totalCases === 0) {
            throw new Error('AI generated 0 test cases')
        }

        logger.success(`✓ AI designed ${totalCases} test cases based on analysis`)
        logger.bullet(`  ✓ Positive: ${testSuite.positiveCases.length}`)
        logger.bullet(`  ✗ Negative: ${testSuite.negativeCases.length}`)
        logger.bullet(`  ⚠ Edge: ${testSuite.edgeCases.length}`)

        return testSuite
    } catch (error: any) {
        logger.error(`AI generation failed: ${error.message}`)
        throw error
    }
}

/**
 * Main function
 */
async function generateTestCasesJSON(url: string, suiteName: string): Promise<void> {
    logger.header('🤖 AI-POWERED TEST GENERATION')

    logger.info(`Target URL: ${url}`)
    logger.info(`Test Suite: ${suiteName}`)
    logger.info('')

    try {
        // Step 1: Explore website
        const explorationData = await exploreWebsite(url)

        // Step 2: Generate test cases with AI
        const testSuite = await generateTestCasesWithAI(explorationData, suiteName)

        // Step 3: Save to JSON
        const jsonDir = path.join(process.cwd(), 'test-suites')
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true })
        }

        const normalizedName = suiteName.replace(/\s+/g, '_')
        const jsonPath = path.join(jsonDir, `${normalizedName}-test-cases.json`)
        fs.writeFileSync(jsonPath, JSON.stringify(testSuite, null, 2), 'utf-8')

        logger.success(`✓ Test suite saved to: ${jsonPath}`)

        // Show summary
        logger.section('Summary')
        logger.bullet(`Suite: ${testSuite.name}`)
        logger.bullet(`URL: ${testSuite.url}`)
        logger.bullet(`Total Cases: ${(testSuite.positiveCases?.length || 0) + (testSuite.negativeCases?.length || 0) + (testSuite.edgeCases?.length || 0)}`)
        logger.bullet(`  ✓ Positive: ${testSuite.positiveCases?.length || 0}`)
        logger.bullet(`  ✗ Negative: ${testSuite.negativeCases?.length || 0}`)
        logger.bullet(`  ⚠ Edge: ${testSuite.edgeCases?.length || 0}`)

        logger.complete(2)
    } catch (error: any) {
        logger.error(`Failed to generate test cases: ${error.message}`)
        throw error
    }
}

// CLI Interface
const args = process.argv.slice(2)
const urlIndex = args.indexOf('--url')
const suiteIndex = args.indexOf('--suite')

if (urlIndex === -1 || suiteIndex === -1) {
    logger.error('Missing required arguments')
    logger.info('Usage: ts-node scripts/generate-tests-json.ts --url <URL> --suite <NAME>')
    logger.info('')
    logger.info('Example:')
    logger.info('  npm run generate:json -- --url "https://practice.expandtesting.com/login" --suite "Login_Page"')
    logger.info('')
    logger.info('Required: Set OPENROUTER_API_KEY environment variable')
    logger.info('  export OPENROUTER_API_KEY="sk-or-v1-YOUR-KEY-HERE"')
    logger.info('  Get free key at: https://openrouter.ai/keys')
    process.exit(1)
}

const url: string = args[urlIndex + 1]
const suite: string = args[suiteIndex + 1]

if (!url || !suite) {
    logger.error('URL and suite name are required')
    process.exit(1)
}

generateTestCasesJSON(url, suite).catch((error: Error) => {
    logger.error(`Failed: ${error.message}`)
    process.exit(1)
})
