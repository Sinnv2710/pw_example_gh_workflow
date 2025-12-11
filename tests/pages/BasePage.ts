/**
 * BasePage - Foundation for all Page Objects
 * 
 * This class provides:
 * - LocatorHelper instance for smart locator resolution
 * - Common page actions (navigate, wait, screenshot, etc.)
 * - Consistent interface for all page objects
 * 
 * All page objects MUST extend this class to ensure they follow
 * the centralized locator management pattern.
 */

import { Page, expect } from '@playwright/test';
import { LocatorHelper } from '../../utils/locator-helper';

export interface BasePageOptions {
  debug?: boolean;
  timeout?: number;
}

export class BasePage {
  readonly page: Page;
  readonly locatorHelper: LocatorHelper;

  constructor(page: Page, options: BasePageOptions = {}) {
    this.page = page;
    this.locatorHelper = new LocatorHelper(page, {
      debug: options.debug || false,
      timeout: options.timeout || 5000,
    });
  }

  /**
   * Navigate to a URL and wait for page load
   * @param url - The URL to navigate to (can be relative or absolute)
   * @param waitUntil - Navigation wait strategy (default: 'domcontentloaded')
   */
  async navigate(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    await this.page.goto(url, { waitUntil });
  }

  /**
   * Wait for page to be fully loaded
   * Uses network idle as the primary indicator
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot of the current page or element
   * @param name - Name for the screenshot file
   * @param fullPage - Whether to capture the full scrollable page
   * @returns Path to the saved screenshot
   */
  async takeScreenshot(name: string, fullPage: boolean = false): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    
    await this.page.screenshot({
      path: filename,
      fullPage,
    });

    return filename;
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for a specific timeout (use sparingly)
   * @param ms - Milliseconds to wait
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back to the previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward to the next page
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Check if the page has a specific URL
   * @param url - Expected URL (can be string or regex)
   */
  async expectUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Check if the page has a specific title
   * @param title - Expected title (can be string or regex)
   */
  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Execute JavaScript in the page context
   * @param script - JavaScript code to execute
   * @returns Result of the script execution
   */
  async evaluate<T>(script: string | Function): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Get viewport size
   */
  async getViewportSize(): Promise<{ width: number; height: number } | null> {
    return this.page.viewportSize();
  }

  /**
   * Set viewport size
   * @param width - Viewport width
   * @param height - Viewport height
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Check if the page is in mobile viewport
   */
  isMobile(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  /**
   * Enable debug mode for locator helper
   */
  enableDebug(): void {
    this.locatorHelper.setDebug(true);
  }

  /**
   * Disable debug mode for locator helper
   */
  disableDebug(): void {
    this.locatorHelper.setDebug(false);
  }
}
