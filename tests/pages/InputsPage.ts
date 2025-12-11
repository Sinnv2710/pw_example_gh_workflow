/**
 * InputsPage - Page Object for Inputs page
 * https://practice.expandtesting.com/inputs
 * 
 * This page object demonstrates the CORRECT pattern:
 * - Uses centralized locators from locators/inputs.locators.ts
 * - Uses locatorHelper for element resolution
 * - Clean, maintainable code with no hardcoded selectors
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { INPUTS_LOCATORS } from '../../locators';

export class InputsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /* ========================================
   * ELEMENT GETTERS - Using Centralized Locators
   * ======================================== */

  get numberInput(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.INPUTS.NUMBER);
  }

  get textInput(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.INPUTS.TEXT);
  }

  get passwordInput(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.INPUTS.PASSWORD);
  }

  get dateInput(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.INPUTS.DATE);
  }

  get displayButton(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.BUTTONS.DISPLAY);
  }

  get clearButton(): Locator {
    return this.locatorHelper.getLocatorSync(INPUTS_LOCATORS.BUTTONS.CLEAR);
  }

  /* ========================================
   * PAGE ACTIONS
   * ======================================== */

  /**
   * Navigate to the inputs page
   */
  async open(): Promise<void> {
    await this.navigate('/inputs');
    await this.locatorHelper.waitForVisible(INPUTS_LOCATORS.INPUTS.NUMBER);
  }

  /**
   * Fill the number input field
   */
  async fillNumber(value: string): Promise<void> {
    await this.numberInput.fill(value);
  }

  /**
   * Fill the text input field
   */
  async fillText(value: string): Promise<void> {
    await this.textInput.fill(value);
  }

  /**
   * Fill the password input field
   */
  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  /**
   * Fill the date input field
   */
  async fillDate(value: string): Promise<void> {
    await this.dateInput.fill(value);
  }

  /**
   * Fill all input fields at once
   */
  async fillAllInputs(data: {
    number: string;
    text: string;
    password: string;
    date: string;
  }): Promise<void> {
    await this.fillNumber(data.number);
    await this.fillText(data.text);
    await this.fillPassword(data.password);
    await this.fillDate(data.date);
  }

  /**
   * Click the display inputs button
   */
  async clickDisplay(): Promise<void> {
    await this.displayButton.click();
  }

  /**
   * Click the clear inputs button
   */
  async clickClear(): Promise<void> {
    await this.clearButton.click();
  }

  /**
   * Get value from number input
   */
  async getNumberValue(): Promise<string> {
    return await this.numberInput.inputValue();
  }

  /**
   * Get value from text input
   */
  async getTextValue(): Promise<string> {
    return await this.textInput.inputValue();
  }

  /**
   * Get value from password input
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Get value from date input
   */
  async getDateValue(): Promise<string> {
    return await this.dateInput.inputValue();
  }

  /**
   * Check if all inputs are empty
   */
  async areAllInputsEmpty(): Promise<boolean> {
    const values = await Promise.all([
      this.getNumberValue(),
      this.getTextValue(),
      this.getPasswordValue(),
      this.getDateValue(),
    ]);

    return values.every(value => value === '');
  }

  /**
   * Clear all inputs using the clear button
   */
  async clearAllInputs(): Promise<void> {
    await this.clickClear();
  }

  /* ========================================
   * BACKWARD COMPATIBILITY METHODS
   * These methods maintain compatibility with existing tests
   * ======================================== */

  /**
   * @deprecated Use fillNumber() instead
   * Kept for backward compatibility with existing tests
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    console.log(`Filling input with value: ${value}`);
    await locator.fill(value);
  }

  /**
   * @deprecated Use click methods instead
   * Kept for backward compatibility with existing tests
   */
  async clickButton(locator: Locator): Promise<void> {
    console.log(`Clicking button`);
    await locator.click();
  }

  /**
   * @deprecated Use get*Value() methods instead
   * Kept for backward compatibility with existing tests
   */
  async getText(locator: Locator): Promise<string> {
    try {
      return await locator.inputValue();
    } catch (e) {
      return (await locator.textContent()) ?? '';
    }
  }
}
