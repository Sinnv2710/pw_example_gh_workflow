/**
 * LocatorHelper - Smart locator resolution with automatic fallback
 * 
 * This utility provides intelligent locator resolution that automatically
 * tries multiple selector strategies (primary → dataTestId → fallback)
 * to find elements on the page.
 */

import { Page, Locator } from '@playwright/test';
import { LocatorStrategy } from '../locators/base.locators';

export interface LocatorHelperOptions {
  debug?: boolean;
  timeout?: number;
}

export class LocatorHelper {
  private page: Page;
  private debug: boolean;
  private timeout: number;

  constructor(page: Page, options: LocatorHelperOptions = {}) {
    this.page = page;
    this.debug = options.debug || false;
    this.timeout = options.timeout || 5000;
  }

  /**
   * Get a locator using the strategy pattern with automatic fallback
   * This is a synchronous method that returns the first available locator
   * without checking if elements exist on the page.
   * 
   * @param strategy - The locator strategy object
   * @returns Playwright Locator
   */
  getLocatorSync(strategy: LocatorStrategy): Locator {
    if (this.debug) {
      console.log(`[LocatorHelper] Getting locator for: ${strategy.description}`);
      console.log(`[LocatorHelper] Primary: ${strategy.primary}`);
    }

    // Try primary selector first
    if (strategy.primary) {
      return this.page.locator(strategy.primary);
    }

    // Try dataTestId if primary not available
    if (strategy.dataTestId) {
      if (this.debug) {
        console.log(`[LocatorHelper] Using dataTestId: ${strategy.dataTestId}`);
      }
      return this.page.locator(strategy.dataTestId);
    }

    // Try fallback if available
    if (strategy.fallback) {
      if (this.debug) {
        console.log(`[LocatorHelper] Using fallback: ${strategy.fallback}`);
      }
      return this.page.locator(strategy.fallback);
    }

    throw new Error(`No valid selector found for: ${strategy.description}`);
  }

  /**
   * Get a locator with async validation and automatic fallback
   * This method checks if elements exist and automatically falls back
   * to alternative selectors if the primary one doesn't find anything.
   * 
   * @param strategy - The locator strategy object
   * @returns Playwright Locator that has been validated
   */
  async getLocator(strategy: LocatorStrategy): Promise<Locator> {
    if (this.debug) {
      console.log(`[LocatorHelper] Getting locator (async) for: ${strategy.description}`);
    }

    const selectors = [
      { selector: strategy.primary, type: 'primary' },
      { selector: strategy.dataTestId, type: 'dataTestId' },
      { selector: strategy.fallback, type: 'fallback' },
    ].filter(s => s.selector);

    for (const { selector, type } of selectors) {
      try {
        const locator = this.page.locator(selector!);
        const count = await locator.count();
        
        if (count > 0) {
          if (this.debug) {
            console.log(`[LocatorHelper] Found ${count} element(s) using ${type}: ${selector}`);
          }
          return locator;
        }
      } catch (error) {
        if (this.debug) {
          console.log(`[LocatorHelper] Failed to check ${type}: ${selector}`, error);
        }
      }
    }

    // If we get here, no selector found any elements
    // Return the primary locator anyway and let Playwright's auto-wait handle it
    if (this.debug) {
      console.log(`[LocatorHelper] No elements found, returning primary locator`);
    }
    return this.page.locator(strategy.primary);
  }

  /**
   * Get a locator and filter by text content
   * 
   * @param strategy - The locator strategy object
   * @param text - The text to filter by
   * @returns Playwright Locator filtered by text
   */
  getByText(strategy: LocatorStrategy, text: string): Locator {
    if (this.debug) {
      console.log(`[LocatorHelper] Getting locator by text: ${strategy.description} - "${text}"`);
    }

    const locator = this.getLocatorSync(strategy);
    return locator.filter({ hasText: text });
  }

  /**
   * Get multiple elements matching the strategy
   * 
   * @param strategy - The locator strategy object
   * @returns Array of Playwright Locators
   */
  async getAll(strategy: LocatorStrategy): Promise<Locator[]> {
    const locator = await this.getLocator(strategy);
    const count = await locator.count();
    const locators: Locator[] = [];

    for (let i = 0; i < count; i++) {
      locators.push(locator.nth(i));
    }

    if (this.debug) {
      console.log(`[LocatorHelper] Found ${count} elements for: ${strategy.description}`);
    }

    return locators;
  }

  /**
   * Check if an element exists on the page
   * 
   * @param strategy - The locator strategy object
   * @returns true if element exists, false otherwise
   */
  async exists(strategy: LocatorStrategy): Promise<boolean> {
    try {
      const locator = await this.getLocator(strategy);
      const count = await locator.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Wait for an element to be visible
   * 
   * @param strategy - The locator strategy object
   * @param timeout - Optional timeout override
   */
  async waitForVisible(strategy: LocatorStrategy, timeout?: number): Promise<void> {
    const locator = await this.getLocator(strategy);
    await locator.waitFor({ 
      state: 'visible', 
      timeout: timeout || this.timeout 
    });
  }

  /**
   * Wait for an element to be hidden
   * 
   * @param strategy - The locator strategy object
   * @param timeout - Optional timeout override
   */
  async waitForHidden(strategy: LocatorStrategy, timeout?: number): Promise<void> {
    const locator = await this.getLocator(strategy);
    await locator.waitFor({ 
      state: 'hidden', 
      timeout: timeout || this.timeout 
    });
  }

  /**
   * Enable or disable debug logging
   */
  setDebug(debug: boolean): void {
    this.debug = debug;
  }

  /**
   * Set default timeout for operations
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}
