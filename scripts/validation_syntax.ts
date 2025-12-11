#!/usr/bin/env ts-node

/**
 * AI Test Verification & Auto-Fix Script
 * 
 * Uses LLM to verify generated test code and automatically fix issues:
 * - Syntax errors
 * - Invalid locators
 * - Missing assertions
 * - Incorrect Playwright API usage
 * - Logic errors
 */

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from './logger'

const logger = new Logger('AI Test Verification')
const fetch = require('node-fetch')

interface VerificationResult {
  hasIssues: boolean
  issues: Array<{
    line: number
    severity: 'error' | 'warning' | 'info'
    issue: string
    suggestion: string
  }>
  fixedCode: string
  explanation: string
}

/**
 * Verify and fix test code using AI
 */
async function verifyAndFixTests(testFilePath: string): Promise<VerificationResult> {
  logger.progress(`🔍 Analyzing test file: ${testFilePath}`)

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable not set')
  }

  // Read the generated test file
  const testCode = fs.readFileSync(testFilePath, 'utf-8')
  const lineCount = testCode.split('\n').length

  logger.info(`Test file: ${lineCount} lines`)

  const prompt = `You are a senior Playwright automation engineer. Review this test code and provide fixes in STRICT JSON format.

**Test Code (${lineCount} lines):**

\`\`\`typescript
${testCode}
\`\`\`

**Review for:**
1. Syntax errors (quotes, semicolons, brackets)
2. Invalid Playwright API usage
3. Broken locators (prefer getByRole, getByTestId over CSS selectors)
4. Missing assertions (add expect() checks)
5. Race conditions (use waitForSelector, not waitForTimeout)

**CRITICAL FORMATTING RULES:**
- In the "fixedCode" field, use \\n for newlines (JavaScript string escape)
- Escape all quotes inside strings: \\" for double quotes, \\' for single quotes
- Example: "fixedCode": "import { test } from '@playwright/test'\\n\\ntest('example', async () => {\\n  await page.click('.btn')\\n})"

**Output ONLY this JSON:**

{
  "hasIssues": true,
  "issues": [
    {
      "line": 25,
      "severity": "error",
      "issue": "Description",
      "suggestion": "Fix suggestion"
    }
  ],
  "fixedCode": "import { test, expect } from '@playwright/test'\\n\\ntest.describe('Suite', () => {\\n  // Fixed code with \\\\n for newlines\\n})",
  "explanation": "Summary of fixes"
}`

  try {
    logger.progress('🤖 Sending code to AI for review...')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/playwright-test-generator',
        'X-Title': 'Playwright Test Verifier',
      },
      body: JSON.stringify({
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 16000,
        temperature: 0.2,
        response_format: { type: 'json_object' },
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
    const debugPath = path.join(process.cwd(), 'ai-verification-debug.txt')
    fs.writeFileSync(debugPath, aiResponse, 'utf-8')

    // Extract JSON - handle multiple formats
    let jsonText = aiResponse.trim()
    
    // Remove markdown code blocks if present
    const markdownMatch = jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/s)
    if (markdownMatch) {
      jsonText = markdownMatch[1].trim()
      logger.info('Extracted JSON from markdown')
    }
    
    // Handle reasoning tags
    if (jsonText.includes('<think>')) {
      const thinkMatch = jsonText.match(/<\/think>\s*(\{[\s\S]*\})/s)
      if (thinkMatch) {
        jsonText = thinkMatch[1].trim()
        logger.info('Extracted JSON after reasoning')
      }
    }

    // Extract JSON object if wrapped in text
    const objectMatch = jsonText.match(/\{[\s\S]*\}/s)
    if (objectMatch) {
      jsonText = objectMatch[0]
    }

    let result: VerificationResult
    try {
      // Direct parse - AI should have properly escaped newlines
      result = JSON.parse(jsonText)
      logger.info('✓ Parsed JSON successfully')
    } catch (parseError: any) {
      logger.warn(`Initial parse failed: ${parseError.message}`)
      logger.progress('Attempting to fix JSON formatting...')
      
      // The AI returned actual newlines instead of \n - let's fix it
      // This is a common issue with AI models
      try {
        // Strategy: Parse as-is and let Node.js handle the multiline string
        // by using a more lenient parser or fixing the fixedCode field
        
        // Extract parts of JSON
        const issuesMatch = jsonText.match(/"issues":\s*\[([\s\S]*?)\]/s)
        const hasIssuesMatch = jsonText.match(/"hasIssues":\s*(true|false)/s)
        const explanationMatch = jsonText.match(/"explanation":\s*"([^"]+)"/s)
        const fixedCodeMatch = jsonText.match(/"fixedCode":\s*"([\s\S]*?)"\s*,?\s*"explanation"/s)
        
        if (!fixedCodeMatch) {
          throw new Error('Could not extract fixedCode field')
        }
        
        // Rebuild JSON with proper escaping
        const fixedCodeRaw = fixedCodeMatch[1]
        const fixedCodeEscaped = fixedCodeRaw
          .replace(/\\/g, '\\\\') // Escape backslashes
          .replace(/"/g, '\\"')   // Escape quotes
          .replace(/\n/g, '\\n')  // Escape newlines
          .replace(/\t/g, '\\t')  // Escape tabs
          .replace(/\r/g, '\\r')  // Escape carriage returns
        
        const rebuiltJson = `{
  "hasIssues": ${hasIssuesMatch?.[1] || 'false'},
  "issues": ${issuesMatch?.[0] || '[]'},
  "fixedCode": "${fixedCodeEscaped}",
  "explanation": "${explanationMatch?.[1] || 'Fixed code'}"
}`
        
        result = JSON.parse(rebuiltJson)
        logger.success('✓ Fixed and parsed JSON successfully')
        
        // Save the fixed JSON for reference
        fs.writeFileSync('ai-verification-fixed.json', rebuiltJson, 'utf-8')
        logger.info('Fixed JSON saved to: ai-verification-fixed.json')
        
      } catch (secondError: any) {
        logger.error('Failed to fix JSON formatting')
        logger.warn(`Error: ${secondError.message}`)
        
        // Save for inspection
        fs.writeFileSync('ai-verification-raw.txt', jsonText, 'utf-8')
        logger.info('Raw response saved to: ai-verification-raw.txt')
        
        throw new Error('Could not parse AI response. Check ai-verification-debug.txt and ai-verification-raw.txt')
      }
    }

    // Validate and sanitize result
    result.hasIssues = result.hasIssues ?? false
    result.issues = result.issues || []
    result.explanation = result.explanation || 'No explanation provided'
    
    if (!result.fixedCode || result.fixedCode.trim() === '') {
      logger.warn('No fixed code provided, using original')
      result.fixedCode = testCode
      result.hasIssues = false
    }

    // Convert escaped newlines back to actual newlines for file writing
    if (result.fixedCode.includes('\\n')) {
      result.fixedCode = result.fixedCode
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
    }

    logger.success(`✓ Verification complete`)

    return result
  } catch (error: any) {
    logger.error(`Verification failed: ${error.message}`)
    throw error
  }
}

/**
 * Main function
 */
async function main(testFilePath: string, autoFix: boolean = true): Promise<void> {
  logger.header('🔍 AI TEST VERIFICATION & AUTO-FIX')

  if (!fs.existsSync(testFilePath)) {
    logger.error(`Test file not found: ${testFilePath}`)
    process.exit(1)
  }

  const backupPath = testFilePath.replace('.spec.ts', '.spec.original.ts')
  const debugPath = path.join(process.cwd(), 'ai-verification-debug.txt')

  try {
    // Backup original file
    fs.copyFileSync(testFilePath, backupPath)
    logger.info(`📋 Backup created: ${backupPath}`)

    // Verify and fix
    const result = await verifyAndFixTests(testFilePath)

    // Display results
    logger.section('Verification Results')

    if (result.hasIssues) {
      logger.warn(`⚠️  Found ${result.issues.length} issues`)
      logger.info('')

      // Group issues by severity
      const errors = result.issues.filter(i => i.severity === 'error')
      const warnings = result.issues.filter(i => i.severity === 'warning')
      const infos = result.issues.filter(i => i.severity === 'info')

      if (errors.length > 0) {
        logger.section('Errors')
        errors.forEach(issue => {
          logger.bullet(`Line ${issue.line}: ${issue.issue}`)
          logger.info(`  → ${issue.suggestion}`)
        })
      }

      if (warnings.length > 0) {
        logger.section('Warnings')
        warnings.forEach(issue => {
          logger.bullet(`Line ${issue.line}: ${issue.issue}`)
          logger.info(`  → ${issue.suggestion}`)
        })
      }

      if (infos.length > 0) {
        logger.section('Improvements')
        infos.forEach(issue => {
          logger.bullet(`Line ${issue.line}: ${issue.issue}`)
          logger.info(`  → ${issue.suggestion}`)
        })
      }
    } else {
      logger.success('✅ No issues found - code looks good!')
    }

    logger.section('AI Explanation')
    logger.info(result.explanation)

    // Apply fixes if enabled
    if (autoFix && result.hasIssues) {
      logger.section('Applying Fixes')
      fs.writeFileSync(testFilePath, result.fixedCode, 'utf-8')
      logger.success(`✓ Fixed code written to: ${testFilePath}`)
      
      // Check if there were critical errors
      const hasCriticalErrors = result.issues.some(i => i.severity === 'error')
      
      if (hasCriticalErrors) {
        logger.warn(`⚠️  Critical errors were found and fixed`)
        logger.info(`📋 Original backup kept at: ${backupPath}`)
        logger.info(`   Review the changes before deleting the backup`)
      } else {
        // Only minor issues - safe to remove
        logger.success(`✓ All issues fixed successfully`)
        logger.progress(`🧹 Cleaning up backup file...`)
        fs.unlinkSync(backupPath)
        logger.success(`✓ Backup removed: ${backupPath}`)
      }
    } else if (!autoFix && result.hasIssues) {
      logger.warn('Auto-fix disabled. Review issues manually.')
      logger.info('To apply fixes, run with --fix flag')
    } else {
      // No issues found - remove backup
      logger.progress(`🧹 Cleaning up backup file...`)
      fs.unlinkSync(backupPath)
      logger.success(`✓ Backup removed (no issues found)`)
    }

    // Clean up debug file if verification was successful
    if (fs.existsSync(debugPath)) {
      logger.progress(`🧹 Cleaning up debug file...`)
      fs.unlinkSync(debugPath)
      logger.success(`✓ Debug file removed`)
    }

    logger.section('Summary')
    logger.bullet(`Total Issues: ${result.issues.length}`)
    logger.bullet(`  Errors: ${result.issues.filter(i => i.severity === 'error').length}`)
    logger.bullet(`  Warnings: ${result.issues.filter(i => i.severity === 'warning').length}`)
    logger.bullet(`  Info: ${result.issues.filter(i => i.severity === 'info').length}`)
    logger.bullet(`Auto-fix: ${autoFix ? 'Enabled' : 'Disabled'}`)
    logger.bullet(`Backup: ${fs.existsSync(backupPath) ? 'Kept (review needed)' : 'Removed'}`)

    logger.complete(1)
  } catch (error: any) {
    logger.error(`Verification failed: ${error.message}`)
    
    // Keep backup on failure
    if (fs.existsSync(backupPath)) {
      logger.warn(`⚠️  Backup preserved due to error: ${backupPath}`)
      logger.info(`   You can restore with: cp ${backupPath} ${testFilePath}`)
    }
    
    throw error
  }
}

// CLI
const args = process.argv.slice(2)
const fileIndex = args.indexOf('--file')
const autoFix = !args.includes('--no-fix')

if (fileIndex === -1) {
  logger.error('Missing required argument')
  logger.info('Usage: ts-node scripts/verify-and-fix-tests.ts --file <PATH> [--no-fix]')
  logger.info('')
  logger.info('Example:')
  logger.info('  npm run verify:tests -- --file "tests/test-cases/Login_Page.spec.ts"')
  logger.info('  npm run verify:tests -- --file "tests/test-cases/Login_Page.spec.ts" --no-fix')
  process.exit(1)
}

const testFile = args[fileIndex + 1]

if (!testFile) {
  logger.error('Test file path is required')
  process.exit(1)
}

main(testFile, autoFix).catch((error) => {
  logger.error(`Failed: ${error.message}`)
  process.exit(1)
})