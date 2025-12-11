# Quick Reference Card

## Common Commands

```bash
# Testing
npm test                    # Run all tests
npm run test:headed         # Run with browser visible
npm run test:debug          # Debug mode
npm run test:ui             # Playwright UI mode
npm run test:chromium       # Run on Chromium only

# Reports
npm run report              # Show HTML report
npm run report:open         # Open report on network

# Maintenance
npm run clean               # Clean test artifacts
npm run lint                # Lint code
npm run format              # Format code
npm run type-check          # Check TypeScript types
```

## Project Structure

```
locators/               # All element selectors
  ├── base.locators.ts      # Common elements
  ├── inputs.locators.ts    # Page-specific
  └── index.ts              # Central export

utils/                  # Utilities
  └── locator-helper.ts     # Smart locator resolution

tests/
  ├── pages/            # Page Object Models
  │   ├── BasePage.ts       # Base class
  │   └── {Page}.ts         # Specific pages
  └── test-cases/       # Test specifications
      └── {feature}.spec.ts

test/                   # Legacy tests (backward compatible)
  └── smoke/
```

## Adding a New Page

### 1. Create Locator File

`locators/mypage.locators.ts`

```typescript
export const MYPAGE_LOCATORS = {
  BUTTONS: {
    SUBMIT: {
      primary: '#submit',
      fallback: 'button[type="submit"]',
      dataTestId: '[data-testid="submit"]',
      description: 'Submit button'
    }
  }
};
```

### 2. Export Locator

`locators/index.ts`

```typescript
export { MYPAGE_LOCATORS } from './mypage.locators';
```

### 3. Create Page Object

`tests/pages/MyPage.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { MYPAGE_LOCATORS } from '../../locators';

export class MyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get submitButton(): Locator {
    return this.locatorHelper.getLocatorSync(
      MYPAGE_LOCATORS.BUTTONS.SUBMIT
    );
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
```

### 4. Create Test

`tests/test-cases/mypage.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { MyPage } from '../pages/MyPage';

test('should submit form', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.navigate('/mypage');
  await myPage.submit();
  await expect(page).toHaveURL(/success/);
});
```

## Pattern Cheat Sheet

### ✅ CORRECT

```typescript
// In locator file
export const LOGIN_LOCATORS = {
  INPUTS: {
    USERNAME: {
      primary: '#username',
      fallback: 'input[name="username"]',
      dataTestId: '[data-testid="username"]',
      description: 'Username input'
    }
  }
};

// In page object
import { LOGIN_LOCATORS } from '../../locators';

private get usernameInput(): Locator {
  return this.locatorHelper.getLocatorSync(
    LOGIN_LOCATORS.INPUTS.USERNAME
  );
}

async fillUsername(value: string): Promise<void> {
  await this.usernameInput.fill(value);
}
```

### ❌ WRONG

```typescript
// DON'T: Hardcoded selector
async fillUsername(value: string) {
  await this.page.locator('#username').fill(value);
}

// DON'T: Selector in page object
private usernameSelector = '#username';

// DON'T: Using page.locator directly
const input = this.page.locator('#username');
```

## LocatorHelper Methods

```typescript
// Sync - returns immediately
this.locatorHelper.getLocatorSync(strategy);

// Async - validates element exists
await this.locatorHelper.getLocator(strategy);

// Filter by text
this.locatorHelper.getByText(strategy, 'text');

// Get all matching elements
await this.locatorHelper.getAll(strategy);

// Check existence
await this.locatorHelper.exists(strategy);

// Wait for visible
await this.locatorHelper.waitForVisible(strategy);

// Wait for hidden
await this.locatorHelper.waitForHidden(strategy);
```

## BasePage Methods

```typescript
// Navigation
await page.navigate('/path');
await page.waitForPageLoad();

// Screenshots
await page.takeScreenshot('name');

// Page info
const url = await page.getCurrentUrl();
const title = await page.getTitle();

// URL/Title assertions
await page.expectUrl(/pattern/);
await page.expectTitle('Expected');

// Debug
page.enableDebug();
page.disableDebug();
```

## Locator Strategy Format

```typescript
{
  primary: string;      // Main selector (try first)
  fallback?: string;    // Backup selector
  dataTestId?: string;  // Test ID attribute
  description: string;  // What element does
}
```

## Resolution Order

1. Try `primary` selector
2. If fails, try `dataTestId`
3. If fails, try `fallback`
4. If all fail, return primary and let Playwright handle

## Debug Tips

```bash
# Enable debug in page object
const page = new MyPage(page, { debug: true });

# View trace file
npx playwright show-trace test-results/*/trace.zip

# Run single test
npm test -- path/to/test.spec.ts

# Run tests matching pattern
npm test -- --grep "login"
```

## Common Selectors

```typescript
// ID
primary: '#element-id'

// Class
primary: '.class-name'

// Attribute
primary: '[data-test="value"]'

// Text
primary: 'text=Button Text'

// Role
primary: 'role=button[name="Submit"]'

// Combination
primary: 'button#submit.primary[type="submit"]'

// XPath
primary: '//button[@id="submit"]'
```

## Workflow Jobs

```yaml
1. generate-tests   # Generate locators & tests
2. run-tests        # Execute tests
3. analyze-failures # Review failures
4. generate-report  # Create report
5. publish-report   # Deploy report
```

## Files to Check

- `README.md` - Main documentation
- `docs/ADDING_NEW_PAGES.md` - How to add pages
- `docs/ARCHITECTURE.md` - Architecture details
- `tests/pages/ExamplePage.ts` - Pattern examples
- `tests/test-cases/example.spec.ts` - Test examples

## Key Principles

1. **Centralize** - All selectors in `locators/`
2. **Fallback** - Always provide alternatives
3. **Describe** - Explain what element does
4. **Extend** - Page objects extend BasePage
5. **Clean** - No hardcoded selectors

## Support

- Check documentation in `docs/`
- Review examples in `tests/pages/ExamplePage.ts`
- Run validation test: `npm test tests/test-cases/example.spec.ts`
