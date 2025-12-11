/**
 * ExamplePage - Template showing the CORRECT pattern
 * 
 * This is a template/example that demonstrates how to create page objects
 * using the centralized locator management pattern.
 * 
 * KEY PRINCIPLES:
 * ✅ DO: Import locators from centralized files
 * ✅ DO: Use locatorHelper to get elements
 * ✅ DO: Create getter methods for elements
 * ✅ DO: Keep page-specific logic in the page object
 * 
 * ❌ DON'T: Hardcode selectors in the page object
 * ❌ DON'T: Use this.page.locator() directly with strings
 * ❌ DON'T: Mix locators with business logic
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
// Import locators from centralized location
import { INPUTS_LOCATORS } from '../../locators';

/**
 * Example Page Object using the centralized locator pattern
 */
export class ExamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /* ========================================
   * ELEMENT GETTERS - Using Centralized Locators
   * ======================================== */

  /**
   * ✅ CORRECT: Get element using locatorHelper with centralized locator
   */
  private get usernameInput(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.INPUTS.TEXT);
  }

  /**
   * ✅ CORRECT: Another example with async locator resolution
   * Use this when you want automatic fallback checking
   */
  private async getPasswordInput(): Promise<Locator> {
    return await this.locatorHelper.getLocator(INPUTS_LOCATORS.INPUTS.PASSWORD);
  }

  /**
   * ✅ CORRECT: Button using centralized locator
   */
  private get submitButton(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.BUTTONS.DISPLAY);
  }

  /* ========================================
   * PAGE ACTIONS - Clean and Readable
   * ======================================== */

  /**
   * Navigate to the page
   */
  async open(): Promise<void> {
    await this.navigate('/inputs');
    await this.waitForPageLoad();
  }

  /**
   * ✅ CORRECT: Action method using getter
   * No hardcoded selectors, clean and maintainable
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * ✅ CORRECT: Action using async locator
   */
  async enterPassword(password: string): Promise<void> {
    const input = await this.getPasswordInput();
    await input.fill(password);
  }

  /**
   * ✅ CORRECT: Complex action combining multiple elements
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submitButton.click();
  }

  /**
   * ✅ CORRECT: Getting text from element
   */
  async getUsername(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  /**
   * ✅ CORRECT: Using locatorHelper's utility methods
   */
  async isSubmitButtonVisible(): Promise<boolean> {
    return await this.locatorHelper.exists(INPUTS_LOCATORS.BUTTONS.DISPLAY);
  }

  /**
   * ✅ CORRECT: Using getByText for filtering
   */
  getButtonByText(text: string): Locator {
    return this.locatorHelper.getByText(INPUTS_LOCATORS.BUTTONS.DISPLAY, text);
  }

  /* ========================================
   * ANTI-PATTERNS - NEVER DO THIS!
   * ======================================== */

  /**
   * ❌ BAD: Hardcoded selector in page object
   * This defeats the purpose of centralized locators
   */
  // async badExample1() {
  //   await this.page.locator('#username').fill('test');
  // }

  /**
   * ❌ BAD: Selector stored as class property
   * Selectors should be in locator files, not page objects
   */
  // private usernameSelector = '#username';
  // async badExample2() {
  //   await this.page.locator(this.usernameSelector).fill('test');
  // }

  /**
   * ❌ BAD: Mixing selector with logic
   * Keep selectors separate from business logic
   */
  // async badExample3(username: string) {
  //   const selector = username.includes('@') ? '#email' : '#username';
  //   await this.page.locator(selector).fill(username);
  // }

  /* ========================================
   * CORRECT PATTERN RECAP
   * ======================================== */

  /**
   * PATTERN SUMMARY:
   * 
   * 1.Import locators: import { PAGE_LOCATORS } from '../../locators';
   * 2.Use getters: private get element() { return this.locatorHelper.getLocatorSync(LOCATOR); }
   * 3.Create actions: async doAction() { await this.element.click(); }
   * 4.Keep it clean: No hardcoded selectors anywhere!
   * 
   * BENEFITS:
   * - Easy to maintain: Change selector once, works everywhere
   * - Automatic fallback: If primary fails, tries alternatives
   * - Type-safe: TypeScript catches errors
   * - Testable: Clear separation of concerns
   * - Scalable: Easy to add new pages following same pattern
   */
}

/* ========================================
 * USAGE IN TESTS
 * ======================================== */

/**
 * Example test showing how to use the page object:
 * 
 * test('login with valid credentials', async ({ page }) => {
 *   const examplePage = new ExamplePage(page);
 *   
 *   await examplePage.open();
 *   await examplePage.login('testuser', 'password123');
 *   
 *   // Assertions...
 * });
 */
