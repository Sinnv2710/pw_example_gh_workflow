/**
 * Base Locators - Common elements across all pages
 */
export const BASE_LOCATORS = {
  COMMON:  {
    LOADING_SPINNER: {
      primary: '. loading-spinner',
      fallback: '[class*="loading"]',
      dataTestId: '[data-testid="loading"]',
      description: 'Loading spinner indicator'
    },
    ERROR_MESSAGE: {
      primary:  '.error-message',
      fallback: '. alert-danger',
      dataTestId: '[data-testid="error-msg"]',
      description: 'Error message container'
    },
    SUCCESS_MESSAGE: {
      primary:  '.success-message',
      fallback: '.alert-success',
      dataTestId: '[data-testid="success-msg"]',
      description: 'Success message container'
    }
  },
  NAVIGATION: {
    HEADER: {
      primary: 'header. main-header',
      fallback: 'header',
      description: 'Main header/navigation'
    },
    FOOTER: {
      primary: 'footer.main-footer',
      fallback: 'footer',
      description: 'Page footer'
    }
  }
} as const;