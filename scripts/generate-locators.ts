#!/usr/bin/env ts-node

/**
 * Locator Generation Script
 *
 * Generates centralized locator files from exploration data
 */

import * as fs from 'fs'
import * as path from 'path'
import { Logger } from './logger'

const logger = new Logger('Locator Generation')

/**
 * Generate locator file for a page
 */
async function generateLocatorFile(suiteName: string): Promise<void> {
	logger.header('🔑 GENERATING LOCATOR FILES')

	logger.info(`Test Suite: ${suiteName}`)
	logger.progress('Creating centralized locators...')

	// Create locators directory
	const locatorsDir = path.join(process.cwd(), 'locators')
	if (!fs.existsSync(locatorsDir)) {
		fs.mkdirSync(locatorsDir, { recursive: true })
	}

	// Generate locator content
	const locatorContent = generateLocatorContent(suiteName)
	const locatorPath = path.join(locatorsDir, `${suiteName}.locators.ts`)

	fs.writeFileSync(locatorPath, locatorContent, 'utf-8')

	logger.success(`Created: locators/${suiteName}.locators.ts`)

	// Update index.ts
	updateLocatorIndex(suiteName)

	logger.complete(3)
}

/**
 * Generate locator file content
 */
function generateLocatorContent(pageName: string): string {
	const constantName = pageName.toUpperCase() + '_LOCATORS'

	return `/**
 * ${pageName} Page Locators
 * 
 * Centralized locator definitions for ${pageName} page
 * Auto-generated - Update selectors here when website changes
 */

export const ${constantName} = {
  INPUTS: {
    EXAMPLE_INPUT: {
      primary: '#example-input',
      fallback: 'input[name="example"]',
      dataTestId: '[data-testid="example-input"]',
      description: 'Example input field'
    }
  },
  
  BUTTONS: {
    SUBMIT: {
      primary: 'button[type="submit"]',
      fallback: '. submit-btn',
      dataTestId: '[data-testid="submit-button"]',
      description: 'Submit button'
    }
  },
  
  CONTAINERS: {
    MAIN: {
      primary: '.main-container',
      fallback: 'main',
      description: 'Main content container'
    }
  }
} as const;
`
}

/**
 * Update locators/index.ts to export new locator file
 */
function updateLocatorIndex(pageName: string): void {
	const indexPath = path.join(process.cwd(), 'locators', 'index.ts')
	const constantName = pageName.toUpperCase() + '_LOCATORS'
	const exportLine = `export { ${constantName} } from './${pageName}. locators';\n`

	let indexContent = ''

	if (fs.existsSync(indexPath)) {
		indexContent = fs.readFileSync(indexPath, 'utf-8')

		// Check if already exported
		if (indexContent.includes(constantName)) {
			logger.info('Locator already exported in index.ts')
			return
		}
	}

	indexContent += exportLine
	fs.writeFileSync(indexPath, indexContent, 'utf-8')

	logger.success('Updated locators/index.ts')
}

// CLI Interface
const args = process.argv.slice(2)
const suiteIndex = args.indexOf('--suite')

if (suiteIndex === -1) {
	logger.error('Missing required argument: --suite')
	logger.info('Usage: ts-node scripts/generate-locators.ts --suite <NAME>')
	process.exit(1)
}

const suite = args[suiteIndex + 1]

generateLocatorFile(suite).catch((error) => {
	logger.error(`Failed to generate locators: ${error.message}`)
	process.exit(1)
})
