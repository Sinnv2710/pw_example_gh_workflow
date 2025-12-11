/**
 * Central Export Point for All Locators
 * 
 * This file provides a single import point for all locator definitions.
 * Usage:
 *   import { BASE_LOCATORS, INPUTS_LOCATORS } from '../locators';
 */

export { BASE_LOCATORS } from './base.locators';
export type { LocatorStrategy } from './base.locators';
export { INPUTS_LOCATORS } from './inputs.locators';

// Export all locators as a single object for convenience
export const ALL_LOCATORS = {
  BASE: () => import('./base.locators').then(m => m.BASE_LOCATORS),
  INPUTS: () => import('./inputs.locators').then(m => m.INPUTS_LOCATORS),
};
