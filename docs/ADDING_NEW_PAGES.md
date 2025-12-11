# Adding New Pages to the Framework

This guide walks you through adding a new page to the test automation framework following the centralized locator pattern.

## Step-by-Step Process

### Step 1: Create Locator File

Create a new locator file in `locators/` directory:

**File:** `locators/login.locators.ts`

```typescript
/**
 * Login Page Locators
 * https://example.com/login
 */

/**
 * Locators for the Login page
 */
export const LOGIN_LOCATORS = {
  INPUTS: {
    EMAIL: {
      primary: '#email',
      fallback: 'input[type="email"]',
      dataTestId: '[data-testid="email-input"]',
      description: 'Email input field',
    },
    PASSWORD: {
      primary: '#password',
      fallback: 'input[type="password"]',
      dataTestId: '[data-testid="password-input"]',
      description: 'Password input field',
    },
  },
  BUTTONS: {
    LOGIN: {
      primary: '#login-btn',
      fallback: 'button[type="submit"]',
      dataTestId: '[data-testid="login-button"]',
      description: 'Login submit button',
    },
  },
};
```

### Step 2: Export from Index

Add export to `locators/index.ts`:

```typescript
export { LOGIN_LOCATORS } from './login.locators';
```

### Step 3: Create Page Object

Create page object in `tests/pages/` directory following `tests/pages/ExamplePage.ts` template.

### Step 4: Create Tests

Create test file in `tests/test-cases/` following the pattern in `tests/test-cases/example.spec.ts`.

## Quick Reference

See complete examples in:
- `locators/inputs.locators.ts` - Locator pattern
- `tests/pages/ExamplePage.ts` - Page object pattern
- `tests/test-cases/example.spec.ts` - Test pattern
