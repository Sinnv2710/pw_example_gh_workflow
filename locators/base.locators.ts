/**
 * Base Locators - Common elements used across all pages
 * These locators represent elements that appear on multiple pages or in common UI components
 */

export interface LocatorStrategy {
  primary: string;
  fallback?: string;
  dataTestId?: string;
  description: string;
}

/**
 * Common UI elements that appear across the application
 */
export const BASE_LOCATORS = {
  LOADING: {
    SPINNER: {
      primary: '.loading-spinner',
      fallback: '[role="status"]',
      dataTestId: '[data-testid="loading-spinner"]',
      description: 'Loading spinner indicator',
    },
    OVERLAY: {
      primary: '.loading-overlay',
      fallback: '.overlay',
      dataTestId: '[data-testid="loading-overlay"]',
      description: 'Loading overlay that covers the page',
    },
  },

  MESSAGES: {
    ERROR: {
      primary: '.error-message',
      fallback: '[role="alert"]',
      dataTestId: '[data-testid="error-message"]',
      description: 'Error message display',
    },
    SUCCESS: {
      primary: '.success-message',
      fallback: '[role="status"][aria-live="polite"]',
      dataTestId: '[data-testid="success-message"]',
      description: 'Success message display',
    },
    WARNING: {
      primary: '.warning-message',
      fallback: '[role="alert"][aria-live="polite"]',
      dataTestId: '[data-testid="warning-message"]',
      description: 'Warning message display',
    },
    INFO: {
      primary: '.info-message',
      fallback: '[role="status"]',
      dataTestId: '[data-testid="info-message"]',
      description: 'Info message display',
    },
  },

  NAVIGATION: {
    HEADER: {
      primary: 'header',
      fallback: '[role="banner"]',
      dataTestId: '[data-testid="header"]',
      description: 'Main page header',
    },
    FOOTER: {
      primary: 'footer',
      fallback: '[role="contentinfo"]',
      dataTestId: '[data-testid="footer"]',
      description: 'Main page footer',
    },
    NAVBAR: {
      primary: 'nav',
      fallback: '[role="navigation"]',
      dataTestId: '[data-testid="navbar"]',
      description: 'Main navigation bar',
    },
    MENU_TOGGLE: {
      primary: '.menu-toggle',
      fallback: 'button[aria-label*="menu"]',
      dataTestId: '[data-testid="menu-toggle"]',
      description: 'Mobile menu toggle button',
    },
  },

  BUTTONS: {
    SUBMIT: {
      primary: 'button[type="submit"]',
      fallback: '.submit-button',
      dataTestId: '[data-testid="submit-button"]',
      description: 'Generic submit button',
    },
    CANCEL: {
      primary: '.cancel-button',
      fallback: 'button[aria-label*="cancel"]',
      dataTestId: '[data-testid="cancel-button"]',
      description: 'Generic cancel button',
    },
    CLOSE: {
      primary: '.close-button',
      fallback: 'button[aria-label*="close"]',
      dataTestId: '[data-testid="close-button"]',
      description: 'Generic close button',
    },
  },

  MODALS: {
    CONTAINER: {
      primary: '.modal',
      fallback: '[role="dialog"]',
      dataTestId: '[data-testid="modal"]',
      description: 'Modal dialog container',
    },
    OVERLAY: {
      primary: '.modal-overlay',
      fallback: '.overlay',
      dataTestId: '[data-testid="modal-overlay"]',
      description: 'Modal background overlay',
    },
    TITLE: {
      primary: '.modal-title',
      fallback: '[role="dialog"] h1, [role="dialog"] h2',
      dataTestId: '[data-testid="modal-title"]',
      description: 'Modal title',
    },
  },

  FORMS: {
    ERROR_MESSAGE: {
      primary: '.form-error',
      fallback: '[role="alert"]',
      dataTestId: '[data-testid="form-error"]',
      description: 'Form validation error message',
    },
    SUCCESS_MESSAGE: {
      primary: '.form-success',
      fallback: '[role="status"]',
      dataTestId: '[data-testid="form-success"]',
      description: 'Form success message',
    },
  },
};
