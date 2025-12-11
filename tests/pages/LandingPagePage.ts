import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LANDINGPAGE_LOCATORS } from '../../locators/landingPage.locators';

/**
 * LandingPagePage - Page Object Model
 * 
 * Implements page interactions using centralized locators
 * Follows OOP principles and best practices
 */
export class LandingPagePage extends BasePage {
  
  // ===== Locator Getters =====
  // All locators use centralized definitions from locators/landingPage.locators.ts
  
  private get exampleInput(): Locator {
    return this.locatorHelper.getLocatorSync(LANDINGPAGE_LOCATORS.INPUTS.EXAMPLE_INPUT);
  }
  
  private get submitButton(): Locator {
    return this.locatorHelper.getLocatorSync(LANDINGPAGE_LOCATORS.BUTTONS.SUBMIT);
  }
  
  private get mainContainer(): Locator {
    return this.locatorHelper.getLocatorSync(LANDINGPAGE_LOCATORS.CONTAINERS.MAIN);
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
