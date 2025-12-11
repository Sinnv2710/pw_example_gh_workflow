/**
 * WebForms Grid Overview Page Locators
 * 
 * Centralized locator definitions for WebForms Grid Overview page
 * Auto-generated - Update selectors here when website changes
 */

export const WEBFORMS GRID OVERVIEW_LOCATORS = {
  INPUTS: {
    EXAMPLE_INPUT: {
      primary: '#example-input',
      fallback: 'input[name="example"]',
      dataTestId: '[data-testid="example-input"]',
      description: 'Example input field'
    }
  },
  
  BUTTONS: {
    SUBMIT: {
      primary: 'button[type="submit"]',
      fallback: '.submit-btn',
      dataTestId: '[data-testid="submit-button"]',
      description: 'Submit button'
    }
  },
  
  CONTAINERS: {
    MAIN: {
      primary: '.main-container',
      fallback: 'main',
      description: 'Main content container'
    }
  }
} as const;
