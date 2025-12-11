import { Page } from '@playwright/test';
import { LocatorHelper } from '../../utils/locator-helper';

/**
 * BasePage - Parent class for all page objects
 */
export abstract class BasePage {
  protected locatorHelper: LocatorHelper;

  constructor(protected page: Page) {
    this.locatorHelper = new LocatorHelper(page, false);
  }

  async navigate(url: string): Promise<void> {
    await this.page. goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }
}