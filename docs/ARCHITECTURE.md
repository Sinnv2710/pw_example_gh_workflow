# Framework Architecture

## Overview

This document describes the architecture of the Playwright test automation framework with centralized locator management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Test Execution Layer                     │
├─────────────────────────────────────────────────────────────────┤
│  tests/test-cases/*.spec.ts                                     │
│  - Import page objects                                           │
│  - Write test scenarios                                          │
│  - NO hardcoded selectors                                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Page Object Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  tests/pages/*.ts                                               │
│  - Extend BasePage                                               │
│  - Import from locators/                                         │
│  - Use locatorHelper.getLocatorSync()                           │
│  - Expose clean action methods                                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   BasePage               │    │   Centralized Locators   │
│  (tests/pages/)          │    │   (locators/)            │
├──────────────────────────┤    ├──────────────────────────┤
│ - locatorHelper instance │    │ - base.locators.ts       │
│ - navigate()             │    │ - inputs.locators.ts     │
│ - takeScreenshot()       │    │ - {page}.locators.ts     │
│ - waitForPageLoad()      │    │ - index.ts               │
│ - Common utilities       │    │                          │
└──────────────────────────┘    └──────────────────────────┘
                │                            │
                └─────────┬──────────────────┘
                          ▼
        ┌─────────────────────────────────┐
        │     LocatorHelper               │
        │     (utils/)                    │
        ├─────────────────────────────────┤
        │ - getLocatorSync()              │
        │ - getLocator() (async)          │
        │ - getByText()                   │
        │ - exists()                      │
        │ - waitForVisible()              │
        │ - Automatic fallback logic:     │
        │   primary → dataTestId → fallback│
        └─────────────────────────────────┘
```

## Data Flow

### 1. Test Execution
```
Test File → Page Object → Element Action
   ↓            ↓              ↓
example.spec.ts → InputsPage → fillNumber('42')
```

### 2. Locator Resolution
```
Page Object → LocatorHelper → Locator Strategy → Browser
     ↓              ↓                 ↓              ↓
InputsPage → getLocatorSync() → INPUTS_LOCATORS → Playwright
                                      ↓
                            Try: primary
                            If fails: dataTestId
                            If fails: fallback
```

## Component Responsibilities

### Locators Directory (`locators/`)

**Purpose:** Store all element selectors in one place

**Files:**
- `base.locators.ts` - Common elements (loading, errors, navigation)
- `{page}.locators.ts` - Page-specific elements
- `index.ts` - Central export point

**Structure:**
```typescript
export const PAGE_LOCATORS = {
  SECTION: {
    ELEMENT: {
      primary: '#id',
      fallback: '.class',
      dataTestId: '[data-testid="element"]',
      description: 'What this element does'
    }
  }
};
```

### Utils Directory (`utils/`)

**Purpose:** Utility functions and helpers

**Files:**
- `locator-helper.ts` - Smart locator resolution

**Features:**
- Automatic fallback
- Sync and async methods
- Debug logging
- Element existence checks
- Wait methods

### Tests/Pages Directory (`tests/pages/`)

**Purpose:** Page Object Models

**Files:**
- `BasePage.ts` - Base class for all pages
- `{Page}.ts` - Specific page objects
- `index.ts` - Export all page objects

**Pattern:**
```typescript
export class MyPage extends BasePage {
  private get element(): Locator {
    return this.locatorHelper.getLocatorSync(LOCATORS.ELEMENT);
  }
  
  async doAction(): Promise<void> {
    await this.element.click();
  }
}
```

### Tests/Test-Cases Directory (`tests/test-cases/`)

**Purpose:** Test specifications

**Files:**
- `{feature}.spec.ts` - Test files

**Pattern:**
```typescript
test('should do something', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.doAction();
  expect(result).toBe(expected);
});
```

## Design Principles

### 1. Separation of Concerns

- **Locators**: What elements are (selectors)
- **Page Objects**: How to interact with pages (actions)
- **Tests**: What to verify (assertions)

### 2. Single Source of Truth

All selectors in `locators/` directory. Never duplicated.

### 3. Automatic Resilience

LocatorHelper tries multiple strategies automatically.

### 4. Type Safety

Full TypeScript with strict mode ensures compile-time checks.

### 5. Maintainability

Change selector once, all tests updated automatically.

## Locator Strategy Pattern

Each locator follows this pattern:

```typescript
interface LocatorStrategy {
  primary: string;      // Main selector (CSS, XPath, text)
  fallback?: string;    // Backup if primary fails
  dataTestId?: string;  // Test ID attribute
  description: string;  // Human-readable description
}
```

### Resolution Order

1. **Primary** - Try first (most stable selector)
2. **dataTestId** - Try if primary fails (custom test attribute)
3. **Fallback** - Try if dataTestId fails (alternative selector)

### Example

```typescript
USERNAME_INPUT: {
  primary: '#username',                    // ID selector
  fallback: 'input[name="username"]',      // Attribute selector
  dataTestId: '[data-testid="username"]', // Test ID
  description: 'Username input field'
}
```

If `#username` doesn't exist, tries `[data-testid="username"]`.
If that doesn't exist, tries `input[name="username"]`.

## Workflow Integration

### Local Development

```bash
npm test              # Run all tests
npm run test:debug    # Debug mode
npm run test:ui       # UI mode
npm run report        # View reports
```

### CI/CD Pipeline

```yaml
Jobs:
  1. generate-tests   # Explore website, generate locators
  2. run-tests        # Execute tests with trace
  3. analyze-failures # Review failures
  4. generate-report  # Create HTML report
  5. publish-report   # Deploy to GitHub Pages
```

## Extending the Framework

### Adding a New Page

1. Create `locators/{page}.locators.ts`
2. Export from `locators/index.ts`
3. Create `tests/pages/{Page}.ts`
4. Export from `tests/pages/index.ts`
5. Create `tests/test-cases/{page}.spec.ts`

See `docs/ADDING_NEW_PAGES.md` for detailed guide.

### Adding Utilities

Add new utility functions to `utils/` directory.
Import in BasePage if needed by all pages.

### Adding Custom Assertions

Create `utils/custom-assertions.ts` and import in tests.

## Performance Considerations

### Locator Resolution

- `getLocatorSync()` - Fast, returns immediately
- `getLocator()` - Slower, checks element existence

Use `getLocatorSync()` for most cases, `getLocator()` when you need validation.

### Page Load Strategy

```typescript
await page.goto(url, { waitUntil: 'domcontentloaded' }); // Faster
await page.goto(url, { waitUntil: 'networkidle' });      // Slower but complete
```

BasePage uses `domcontentloaded` by default for speed.

## Debugging

### Enable Debug Logging

```typescript
const page = new MyPage(page, { debug: true });
```

Logs all locator resolution attempts to console.

### Trace Viewing

```bash
npx playwright show-trace test-results/*/trace.zip
```

Shows timeline, screenshots, network, console, etc.

### Common Issues

1. **Element not found**: Check primary selector is correct
2. **Wrong element selected**: Make selector more specific
3. **Timeout**: Element may not be visible when expected

## Best Practices

### DO ✅

- Store all selectors in `locators/`
- Use `locatorHelper.getLocatorSync()`
- Extend `BasePage` for page objects
- Include primary, fallback, dataTestId
- Write descriptive element descriptions

### DON'T ❌

- Hardcode selectors in tests or page objects
- Use `page.locator()` directly
- Mix selectors with business logic
- Skip fallback strategies
- Duplicate selectors

## Summary

This architecture provides:

- **Centralized Management**: All selectors in one place
- **Automatic Fallback**: Resilient to UI changes
- **Type Safety**: Compile-time error checking
- **Maintainability**: Easy to update and extend
- **Scalability**: Clear pattern to follow

The result is a maintainable, reliable, and scalable test automation framework.
