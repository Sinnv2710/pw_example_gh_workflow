# Documentation Index

Welcome to the Playwright Test Automation Framework documentation!

## 📚 Available Documentation

### Getting Started

1. **[Main README](../README.md)**
   - Quick start guide
   - Installation instructions
   - Framework overview
   - Best practices

### Guides

2. **[Adding New Pages](ADDING_NEW_PAGES.md)**
   - Step-by-step guide for adding pages
   - Locator creation workflow
   - Page object creation
   - Test creation
   - Common patterns

3. **[Quick Reference](QUICK_REFERENCE.md)**
   - Command cheat sheet
   - Pattern examples
   - Common selectors
   - Debug tips
   - One-page reference card

### Architecture

4. **[Architecture](ARCHITECTURE.md)**
   - System architecture diagram
   - Component responsibilities
   - Data flow
   - Design principles
   - Locator strategy pattern

## 🎯 Choose Your Path

### I'm New Here
Start with the [Main README](../README.md) to understand the framework basics.

### I Want to Add a Page
Follow the [Adding New Pages](ADDING_NEW_PAGES.md) guide.

### I Need Quick Help
Check the [Quick Reference](QUICK_REFERENCE.md) card.

### I Want to Understand the Design
Read the [Architecture](ARCHITECTURE.md) document.

## 🔑 Key Concepts

### Centralized Locator Management

All element selectors are stored in `locators/` directory files, never hardcoded in tests or page objects.

**Benefits:**
- ✅ Change selectors in one place
- ✅ Automatic fallback support
- ✅ Easy to maintain
- ✅ Reduces test failures

### Locator Strategy Pattern

Each element has multiple selector strategies:

```typescript
{
  primary: '#element-id',           // Try first
  fallback: '.element-class',       // Try if primary fails
  dataTestId: '[data-testid="el"]', // Try if fallback fails
  description: 'What element does'   // Human-readable
}
```

### Page Object Pattern

Page objects extend `BasePage` and use `locatorHelper`:

```typescript
export class MyPage extends BasePage {
  private get button(): Locator {
    return this.locatorHelper.getLocatorSync(LOCATORS.BUTTON);
  }
  
  async clickButton(): Promise<void> {
    await this.button.click();
  }
}
```

### Test Pattern

Tests use page objects, never direct selectors:

```typescript
test('should do something', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.clickButton();
  expect(result).toBe(expected);
});
```

## 📂 Project Structure

```
├── locators/              # All element selectors
│   ├── base.locators.ts
│   ├── {page}.locators.ts
│   └── index.ts
│
├── utils/                 # Utilities
│   └── locator-helper.ts
│
├── tests/
│   ├── pages/            # Page objects
│   │   ├── BasePage.ts
│   │   └── {Page}.ts
│   └── test-cases/       # Tests
│       └── {feature}.spec.ts
│
├── docs/                 # Documentation (you are here!)
│   ├── README.md
│   ├── ADDING_NEW_PAGES.md
│   ├── ARCHITECTURE.md
│   └── QUICK_REFERENCE.md
│
└── .github/workflows/    # CI/CD
    └── playwright-automation.yml
```

## 🎓 Learning Path

### Beginner
1. Read [Main README](../README.md)
2. Review code in `tests/pages/ExamplePage.ts`
3. Run validation test: `npm test tests/test-cases/example.spec.ts`

### Intermediate
1. Study [Adding New Pages](ADDING_NEW_PAGES.md)
2. Create your first page following the guide
3. Review [Quick Reference](QUICK_REFERENCE.md) for patterns

### Advanced
1. Read [Architecture](ARCHITECTURE.md) document
2. Understand LocatorHelper implementation
3. Extend BasePage with custom utilities

## ❓ Common Questions

### Where do I put selectors?
In `locators/{page}.locators.ts` files. Never hardcode them!

### How do I create a page object?
Follow [Adding New Pages](ADDING_NEW_PAGES.md) guide.

### What if my selector doesn't work?
The LocatorHelper automatically tries fallback strategies. Enable debug mode to see what's happening.

### How do I run tests?
```bash
npm test                # All tests
npm run test:debug      # Debug mode
npm run test:ui         # UI mode
```

### Where are the test results?
- HTML Report: `playwright-report/`
- JSON Results: `test-results/results.json`
- Traces: `test-results/*/trace.zip`

## 🔗 External Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🆘 Need Help?

1. Check documentation in this folder
2. Review examples in `tests/pages/ExamplePage.ts`
3. Run validation test to ensure framework is working
4. Enable debug mode to see what's happening

## 📝 Contributing

When adding documentation:
1. Follow existing format
2. Include code examples
3. Add to this index
4. Keep it practical and concise

---

**Happy Testing! 🎭**
