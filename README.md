# Intelligent Playwright Test Automation Framework

A production-ready Playwright test automation framework with **JSON-based test generation**, **centralized locator management**, and **intelligent test exploration** for maintainable, scalable E2E testing.

## 🎯 Key Features

- **🤖 Intelligent Test Generation**: Auto-generates test cases from website exploration
- **📋 JSON Test Case Management**: Structured, maintainable test data (no more CSV!)
- **🎯 Centralized Locator Management**: All selectors stored in dedicated files
- **🔄 Automatic Fallback**: Smart locator resolution with multiple strategies
- **🛡️ Type-Safe**: Full TypeScript support with strict mode
- **📦 Page Object Pattern**: Clean separation of concerns
- **📊 Comprehensive Reporting**: HTML, JSON, and JUnit reports
- **🚀 CI/CD Ready**: GitHub Actions workflow with parallel execution
- **🔍 Trace & Debug**: Built-in debugging with Playwright traces
- **🧪 Test Categories**: Organized positive, negative, and edge case tests

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pw_example_gh_workflow

# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install

# Run tests
npm test
```

## 📁 Project Structure

```
├── .github/workflows/           # CI/CD pipelines
│   └── intelligent-test-automation.yml
│
├── core/                        # Core framework components
│   ├── api/                    # API testing utilities
│   ├── pages/                  # Page Object Models
│   │   ├── inputsPage.ts
│   │   └── loginPage.ts
│   ├── testcases/              # JSON test case definitions
│   │   ├── Inputs_Page/
│   │   └── Login_Page/
│   └── basePage.ts             # Base page class
│
├── scripts/                     # Test automation scripts
│   ├── generate-tests-json.ts  # Generate test cases from website
│   ├── generate-locators.ts    # Extract locators from pages
│   ├── generate-pages.ts       # Generate Page Objects
│   ├── generate-tests.ts       # Create test specs from JSON
│   ├── analyze-failures.ts     # Analyze test failures
│   └── logger.ts               # Logging utility
│
├── test-suites/                # Generated test case JSON files
│   └── Login_Page-test-cases.json
│
├── locators/                    # Centralized locator definitions
│   ├── base.locators.ts        # Common elements
│   ├── inputs.locators.ts      # Page-specific locators
│   └── index.ts                # Central export
│
├── utils/                       # Utility functions
│   └── locator-helper.ts       # Smart locator resolution
│
├── tests/                       # Test files and Page Objects
│   ├── pages/                  # Page Object Models
│   │   ├── BasePage.ts        # Base class for all pages
│   │   ├── InputsPage.ts      # Example page using centralized locators
│   │   └── ExamplePage.ts     # Template showing correct patterns
│   └── test-cases/            # Test specifications
│
├── test/                       # Legacy test directory (backward compatible)
│   └── smoke/                  # Smoke tests
│
├── test-suites/                # CSV test case definitions
├── reports/                    # Test reports (HTML, PDF)
├── screenshots/                # Test screenshots
├── test-results/               # Test execution results
│
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies and scripts
```

## 🎨 Architecture Overview

### Centralized Locator Management

**The Problem:** Hardcoded selectors scattered across the codebase are hard to maintain.

**The Solution:** Store all selectors in centralized locator files with automatic fallback.

#### Locator Pattern

Each locator has multiple strategies:

```typescript
export const LOGIN_LOCATORS = {
  INPUTS: {
    USERNAME: {
      primary: '#username',              // Try this first
      fallback: 'input[name="username"]', // Try if primary fails
      dataTestId: '[data-testid="username-input"]', // Try if fallback fails
      description: 'Username input field' // What this element does
    }
  }
};
```

#### LocatorHelper Utility

Automatically tries multiple selector strategies:

```typescript
// In page object
private get usernameInput(): Locator {
  return this.locatorHelper.getLocatorSync(LOGIN_LOCATORS.INPUTS.USERNAME);
}

// LocatorHelper tries: primary → dataTestId → fallback
```

### Page Object Pattern

**✅ DO: Use Centralized Locators**

```typescript
import { BasePage } from './BasePage';
import { LOGIN_LOCATORS } from '../../locators';

export class LoginPage extends BasePage {
  // ✅ CORRECT: Use locatorHelper with centralized locators
  private get usernameInput(): Locator {
    return this.locatorHelper.getLocatorSync(LOGIN_LOCATORS.INPUTS.USERNAME);
  }
  
  async login(username: string, password: string) {
    await this.usernameInput.fill(username); // Clean!
  }
}
```

**❌ DON'T: Hardcode Selectors**

```typescript
// ❌ BAD: Hardcoded selector
async login(username: string) {
  await this.page.locator('#username').fill(username); // Don't do this!
}
```

## 📖 Usage Guide

### 1. Creating New Locators

Create a new locator file for your page:

```typescript
// locators/mypage.locators.ts
import { LocatorStrategy } from './base.locators';

export const MYPAGE_LOCATORS = {
  BUTTONS: {
    SUBMIT: {
      primary: '#submit-btn',
      fallback: 'button[type="submit"]',
      dataTestId: '[data-testid="submit-button"]',
      description: 'Submit button'
    }
  }
};
```

Export from central location:

```typescript
// locators/index.ts
export { MYPAGE_LOCATORS } from './mypage.locators';
```

### 2. Creating Page Objects

```typescript
// tests/pages/MyPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { MYPAGE_LOCATORS } from '../../locators';

export class MyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Element getter using centralized locator
  private get submitButton(): Locator {
    return this.locatorHelper.getLocatorSync(MYPAGE_LOCATORS.BUTTONS.SUBMIT);
  }

  // Page actions
  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
```

### 3. Writing Tests

```typescript
// tests/test-cases/mypage.spec.ts
import { test, expect } from '@playwright/test';
import { MyPage } from '../pages/MyPage';

test.describe('My Page Tests', () => {
  test('should submit form', async ({ page }) => {
    const myPage = new MyPage(page);
    
    await myPage.navigate('/mypage');
    await myPage.submit();
    
    await expect(page).toHaveURL(/success/);
  });
});
```

## 🛠️ Available Scripts

### Testing

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode
npm run test:ui

# Run specific browser
npm run test:chromium

# Run smoke tests only
npm run test:smoke
```

### Reporting

```bash
# Show last test report
npm run report

# Open report on network (for CI/remote)
npm run report:open
```

### Maintenance

```bash
# Clean test artifacts
npm run clean

# Type check
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🔍 Best Practices

### DO ✅

1. **Store all selectors in locator files**
   - Keep `locators/` directory organized
   - One file per page or feature
   - Use descriptive names

2. **Use LocatorHelper methods**
   - `getLocatorSync()` for simple cases
   - `getLocator()` for async validation
   - `getByText()` for filtering

3. **Extend BasePage**
   - Provides locatorHelper instance
   - Common utilities available
   - Consistent interface

4. **Use multiple strategies**
   - primary: Most stable selector
   - dataTestId: For custom attributes
   - fallback: Backup option

5. **Write descriptive comments**
   - Document what element does
   - Explain complex locators
   - Note any quirks

### DON'T ❌

1. **Never hardcode selectors**
   ```typescript
   // ❌ BAD
   await page.locator('#username').fill('test');
   ```

2. **Never store selectors in page objects**
   ```typescript
   // ❌ BAD
   private usernameSelector = '#username';
   ```

3. **Never use page.locator() directly**
   ```typescript
   // ❌ BAD
   const input = page.locator('#username');
   ```

4. **Never skip locator strategies**
   ```typescript
   // ❌ BAD
   export const BAD_LOCATOR = {
     primary: '#username'
     // Missing fallback and description!
   };
   ```

## 🤖 GitHub Actions Workflow

The framework includes a comprehensive CI/CD workflow:

### Workflow Jobs

1. **generate-tests**: Explores website and generates locators/tests
2. **run-tests**: Executes tests with trace collection
3. **analyze-failures**: Reviews traces and updates test status
4. **generate-report**: Creates comprehensive HTML report
5. **publish-report**: Deploys report to GitHub Pages (optional)

### Triggering Workflow

```bash
# On push to main/develop
git push origin main

# Manual trigger via GitHub UI
# Actions → Playwright Test Automation → Run workflow
```

### Viewing Results

- Test reports: `Actions → Workflow run → Artifacts → html-report`
- Traces: `Actions → Workflow run → Artifacts → traces-*`
- Screenshots: `Actions → Workflow run → Artifacts → screenshots-*`

## 🐛 Debugging

### Local Debugging

```bash
# Run in debug mode
npm run test:debug

# Run in headed mode to see browser
npm run test:headed

# Run in UI mode for interactive debugging
npm run test:ui
```

### Enable Debug Logging

```typescript
const myPage = new MyPage(page, { debug: true });
myPage.enableDebug(); // Enable at runtime
```

### Viewing Traces

```bash
# Show trace for failed test
npx playwright show-trace test-results/*/trace.zip
```

## 🔧 Configuration

### Playwright Config

Key settings in `playwright.config.ts`:

- **Test Directory**: `./test` (configurable)
- **Timeout**: 30s for tests, 10s for actions
- **Retries**: 2 in CI, 0 locally
- **Reporters**: HTML, JSON, JUnit
- **Trace**: Always on for debugging
- **Screenshots**: On failure
- **Videos**: Retained on failure

### TypeScript Config

Key settings in `tsconfig.json`:

- **Target**: ES2020
- **Strict Mode**: Enabled
- **Module**: CommonJS
- **Source Maps**: Inline

## 📊 Reporting

The framework generates multiple report types:

1. **HTML Report**: Interactive report with screenshots and traces
   - Location: `playwright-report/`
   - Command: `npm run report`

2. **JSON Report**: Machine-readable results
   - Location: `test-results/results.json`

3. **JUnit Report**: For CI integration
   - Location: `test-results/junit.xml`

## 🔐 Security

- No hardcoded credentials
- Environment variables for sensitive data
- `.env` files gitignored
- Trace files contain page content (be careful in production)

## 🤝 Contributing

1. Follow the centralized locator pattern
2. Write tests for new features
3. Update documentation
4. Run linting and formatting
5. Ensure all tests pass

## 📝 License

MIT

## 🆘 Support

For issues or questions:
1. Check this README
2. Review `tests/pages/ExamplePage.ts` for patterns
3. Check GitHub Issues
4. Contact the team

---

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Page Object Pattern](https://playwright.dev/docs/pom)
- [Locator Best Practices](https://playwright.dev/docs/locators)

---

**Built with ❤️ using Playwright and TypeScript**
