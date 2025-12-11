#!/usr/bin/env ts-node

/**
 * Page Object Generation Script
 * 
 * Generates Page Object Models that use centralized locators
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

const logger = new Logger('Page Generation');

/**
 * Generate Page Object file
 */
async function generatePageObject(suiteName: string): Promise<void> {
  logger. header('📄 GENERATING PAGE OBJECTS (OOP)');
  
  logger.info(`Test Suite: ${suiteName}`);
  logger.progress('Creating Page Object Model...');
  
  // Create pages directory
  const pagesDir = path.join(process.cwd(), 'tests', 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  // Generate page content
  const pageContent = generatePageContent(suiteName);
  const pageName = capitalize(suiteName) + 'Page';
  const pagePath = path.join(pagesDir, `${pageName}.ts`);
  
  fs.writeFileSync(pagePath, pageContent, 'utf-8');
  
  logger.success(`Created: tests/pages/${pageName}.ts`);
  logger.bullet('Uses centralized locators ✓');
  logger.bullet('Extends BasePage ✓');
  logger.bullet('OOP pattern ✓');
  
  logger.complete(4);
}

/**
 * Generate page object content
 */
function generatePageContent(suiteName: string): string {
  const className = capitalize(suiteName) + 'Page';
  const constantName = suiteName.toUpperCase() + '_LOCATORS';
  
  return `import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ${constantName} } from '../../locators/${suiteName}. locators';

/**
 * ${className} - Page Object Model
 * 
 * Implements page interactions using centralized locators
 * Follows OOP principles and best practices
 */
export class ${className} extends BasePage {
  
  // ===== Locator Getters =====
  // All locators use centralized definitions from locators/${suiteName}.locators.ts
  
  private get exampleInput(): Locator {
    return this.locatorHelper.getLocatorSync(${constantName}.INPUTS. EXAMPLE_INPUT);
  }
  
  private get submitButton(): Locator {
    return this.locatorHelper.getLocatorSync(${constantName}. BUTTONS.SUBMIT);
  }
  
  private get mainContainer(): Locator {
    return this.locatorHelper.getLocatorSync(${constantName}. CONTAINERS.MAIN);
  }
  
  // ===== Actions =====
  // Methods that interact with the page
  
  async goto(): Promise<void> {
    await this.navigate('https://example.com'); // TODO: Replace with actual URL
  }
  
  async fillExampleInput(value: string): Promise<void> {
    await this.exampleInput.fill(value);
  }
  
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }
  
  async submitForm(inputValue: string): Promise<void> {
    await this.fillExampleInput(inputValue);
    await this.clickSubmit();
  }
  
  // ===== Assertions =====
  // Methods that return values for test assertions
  
  async isSubmitButtonVisible(): Promise<boolean> {
    return await this.submitButton.isVisible();
  }
  
  async getInputValue(): Promise<string> {
    return await this.exampleInput.inputValue();
  }
  
  async isMainContainerVisible(): Promise<boolean> {
    return await this.mainContainer.isVisible();
  }
}
`;
}

/**
 * Capitalize first letter
 */
function capitalize(str:  string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// CLI Interface
const args = process.argv.slice(2);
const suiteIndex = args.indexOf('--suite');

if (suiteIndex === -1) {
  logger.error('Missing required argument: --suite');
  logger.info('Usage: ts-node scripts/generate-pages. ts --suite <NAME>');
  process.exit(1);
}

const suite = args[suiteIndex + 1];

generatePageObject(suite).catch(error => {
  logger.error(`Failed to generate page object: ${error.message}`);
  process.exit(1);
});