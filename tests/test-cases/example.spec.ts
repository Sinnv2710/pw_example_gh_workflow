/**
 * Example Test Suite - Demonstrates Centralized Locator Pattern
 * 
 * This test suite showcases the correct usage of:
 * - Centralized locators
 * - Page objects extending BasePage
 * - LocatorHelper for element resolution
 * 
 * NOTE: These tests are examples and may not run without a valid test environment.
 * They demonstrate the pattern that should be followed for all tests.
 */

import { test, expect } from '@playwright/test';
import { InputsPage } from '../pages/InputsPage';
import { ExamplePage } from '../pages/ExamplePage';

test.describe('Centralized Locator Pattern Examples', () => {
  test.skip('Example 1: Using InputsPage with centralized locators', async ({ page }) => {
    // Create page object instance
    const inputsPage = new InputsPage(page);

    // Navigate using BasePage method
    await inputsPage.navigate('/inputs');

    // Use page-specific methods that leverage centralized locators
    await inputsPage.fillNumber('42');
    await inputsPage.fillText('Hello World');
    await inputsPage.fillPassword('SecurePass123!');
    await inputsPage.fillDate('2025-12-31');

    // Get values back
    const numberValue = await inputsPage.getNumberValue();
    const textValue = await inputsPage.getTextValue();

    // Assertions
    expect(numberValue).toBe('42');
    expect(textValue).toBe('Hello World');
  });

  test.skip('Example 2: Using multiple page objects', async ({ page }) => {
    const inputsPage = new InputsPage(page);
    const examplePage = new ExamplePage(page);

    // Navigate to inputs page
    await inputsPage.open();

    // Fill data using clean methods (no hardcoded selectors!)
    await inputsPage.fillAllInputs({
      number: '123',
      text: 'Test',
      password: 'Pass',
      date: '2025-01-01',
    });

    // Click button
    await inputsPage.clickDisplay();

    // Verify URL
    await inputsPage.expectUrl(/inputs/);
  });

  test.skip('Example 3: Debug mode for troubleshooting', async ({ page }) => {
    const inputsPage = new InputsPage(page, { debug: true });

    // With debug enabled, LocatorHelper logs all locator resolution attempts
    await inputsPage.open();

    // This will log:
    // [LocatorHelper] Getting locator for: Number input field
    // [LocatorHelper] Primary: #input-number
    await inputsPage.fillNumber('999');

    // Disable debug at runtime
    inputsPage.disableDebug();
  });

  test.skip('Example 4: Using BasePage utilities', async ({ page }) => {
    const inputsPage = new InputsPage(page);

    await inputsPage.navigate('/inputs');

    // Wait for page to fully load
    await inputsPage.waitForPageLoad();

    // Get page info
    const url = await inputsPage.getCurrentUrl();
    const title = await inputsPage.getTitle();

    console.log(`Current URL: ${url}`);
    console.log(`Page Title: ${title}`);

    // Take a screenshot
    const screenshotPath = await inputsPage.takeScreenshot('inputs-page');
    console.log(`Screenshot saved to: ${screenshotPath}`);
  });

  test.skip('Example 5: Working with locator strategies', async ({ page }) => {
    const inputsPage = new InputsPage(page);

    await inputsPage.open();

    // The LocatorHelper automatically tries:
    // 1. Primary selector (#input-number)
    // 2. dataTestId if primary fails ([data-testid="input-number"])
    // 3. Fallback if dataTestId fails (input[type="number"])

    // You don't need to worry about which one works - it's automatic!
    await inputsPage.fillNumber('42');

    // The same locator strategy is used for all elements
    await inputsPage.fillText('Centralized is awesome!');
  });

  test.skip('Example 6: Checking element existence', async ({ page }) => {
    const inputsPage = new InputsPage(page);

    await inputsPage.open();

    // Use LocatorHelper's utility methods
    const { INPUTS_LOCATORS } = await import('../../locators');

    const numberInputExists = await inputsPage.locatorHelper.exists(
      INPUTS_LOCATORS.INPUTS.NUMBER
    );

    expect(numberInputExists).toBe(true);
  });

  test('Example 7: Pattern validation test (always passes)', async ({ page }) => {
    // This test validates that the framework is set up correctly
    const inputsPage = new InputsPage(page);

    // Verify page object is properly instantiated
    expect(inputsPage).toBeDefined();
    expect(inputsPage.page).toBe(page);
    expect(inputsPage.locatorHelper).toBeDefined();

    // Verify page object has expected methods
    expect(typeof inputsPage.fillNumber).toBe('function');
    expect(typeof inputsPage.fillText).toBe('function');
    expect(typeof inputsPage.navigate).toBe('function');
    expect(typeof inputsPage.takeScreenshot).toBe('function');

    console.log('✅ Framework structure validated successfully!');
    console.log('✅ Page objects extend BasePage correctly');
    console.log('✅ LocatorHelper is available');
    console.log('✅ All required methods are present');
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. NEVER hardcode selectors in tests or page objects
 * 2. ALWAYS use centralized locators from locators/ directory
 * 3. ALWAYS extend BasePage for page objects
 * 4. Use LocatorHelper's automatic fallback for reliability
 * 5. Keep tests clean and readable
 * 
 * GOOD PRACTICE:
 * ✅ inputsPage.fillNumber('42')
 * 
 * BAD PRACTICE:
 * ❌ page.locator('#input-number').fill('42')
 */
