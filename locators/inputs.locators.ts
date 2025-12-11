/**
 * Inputs Page Locators
 * https://practice.expandtesting.com/inputs
 * 
 * Each locator follows the LocatorStrategy interface pattern:
 * - primary: Main selector
 * - fallback: Backup selector (optional)
 * - dataTestId: data-testid attribute (optional)
 * - description: What the element does
 */

/**
 * Locators for the Inputs page test automation
 */
export const INPUTS_LOCATORS = {
  INPUTS: {
    NUMBER: {
      primary: '#input-number',
      fallback: 'input[type="number"]',
      dataTestId: '[data-testid="input-number"]',
      description: 'Number input field',
    },
    TEXT: {
      primary: '#input-text',
      fallback: 'input[type="text"]',
      dataTestId: '[data-testid="input-text"]',
      description: 'Text input field',
    },
    PASSWORD: {
      primary: '#input-password',
      fallback: 'input[type="password"]',
      dataTestId: '[data-testid="input-password"]',
      description: 'Password input field',
    },
    DATE: {
      primary: '#input-date',
      fallback: 'input[type="date"]',
      dataTestId: '[data-testid="input-date"]',
      description: 'Date input field',
    },
  },

  BUTTONS: {
    DISPLAY: {
      primary: '#btn-display-inputs',
      fallback: 'button:has-text("Display Inputs")',
      dataTestId: '[data-testid="btn-display"]',
      description: 'Display inputs button',
    },
    CLEAR: {
      primary: '#btn-clear-inputs',
      fallback: 'button:has-text("Clear")',
      dataTestId: '[data-testid="btn-clear"]',
      description: 'Clear inputs button',
    },
  },

  OUTPUT: {
    NUMBER_OUTPUT: {
      primary: '#output-number',
      fallback: '[data-output="number"]',
      dataTestId: '[data-testid="output-number"]',
      description: 'Number output display',
    },
    TEXT_OUTPUT: {
      primary: '#output-text',
      fallback: '[data-output="text"]',
      dataTestId: '[data-testid="output-text"]',
      description: 'Text output display',
    },
    PASSWORD_OUTPUT: {
      primary: '#output-password',
      fallback: '[data-output="password"]',
      dataTestId: '[data-testid="output-password"]',
      description: 'Password output display',
    },
    DATE_OUTPUT: {
      primary: '#output-date',
      fallback: '[data-output="date"]',
      dataTestId: '[data-testid="output-date"]',
      description: 'Date output display',
    },
  },
};
