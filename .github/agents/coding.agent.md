* # 📘 Custom Agent Prompt Guide: Playwright Test Generation

  ## 🎯 Objective

  Generate **Playwright test cases in TypeScript** for a web inputs page using the provided JSON test suite (`test_suite.json`).
  The agent must follow **Page Object Model (POM)**, **DRY principles**, and ensure **dynamic values** are used instead of hardcoding.

  ---

  ## 🛠️ Requirements


  1. **BasePage Class**

     - Create reusable methods:
       - `fillInput(locator, value)`
       - `clickButton(locator)`
       - `getText(locator)`
     - All methods should log actions with `console.log`.
  2. **Page Object Class (InputsPage)**

     - Define selectors as `readonly` variables at the top of the class.
     - Example:
       ```typescript
       readonly numberInput = this.page.locator('#number');
       readonly textInput = this.page.locator('#text');
       readonly passwordInput = this.page.locator('#password');
       readonly dateInput = this.page.locator('#date');
       readonly displayButton = this.page.locator('#display');
       readonly clearButton = this.page.locator('#clear');
       ```
  3. **Test File (inputs.spec.ts)**

     - Import JSON test suite.
     - Loop through each test case (`positiveCases`, `negativeCases`, `edgeCases`).
     - For each case:
       - Print each step with `console.log`.
       - Execute mapped Playwright actions via Page Object methods.
       - Validate results with `expect()` and include checkpoint messages.
  4. **Coding Rules**

     - **Selectors**: Always `readonly` at top of class.
     - **Dynamic Values**: Use JSON values, not hardcoded strings.
     - **DRY Code**: Reuse BasePage methods.
     - **Logging**: Print each step with `console.log`.
     - **Assertions**: Use `expect()` with checkpoint messages.

  ---

  ## 🔗 Step-to-Action Mapping Table

  | JSON Step Phrase Example                              | Playwright Action (InputsPage + BasePage)                                                      |
  | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
  | `"Enter dynamic number into Number input field"`    | `await inputsPage.fillInput(inputsPage.numberInput, value)`                                  |
  | `"Enter dynamic text into Text input field"`        | `await inputsPage.fillInput(inputsPage.textInput, value)`                                    |
  | `"Enter dynamic password into Password input"`      | `await inputsPage.fillInput(inputsPage.passwordInput, value)`                                |
  | `"Enter valid date (dd/mm/yyyy)"`                   | `await inputsPage.fillInput(inputsPage.dateInput, value)`                                    |
  | `"Click 'Display Inputs'"`                          | `await inputsPage.clickButton(inputsPage.displayButton)`                                     |
  | `"Click 'Clear Inputs'"`                            | `await inputsPage.clickButton(inputsPage.clearButton)`                                       |
  | `"Validate displayed value matches entered number"` | `expect(await inputsPage.getText(inputsPage.numberInput)).toBe(value)`                       |
  | `"Confirm all input fields are cleared"`            | `expect(await inputsPage.getText(inputsPage.textInput)).toBe("")`                            |
  | `"Validate date format enforcement"`                | `expect(await inputsPage.getText(inputsPage.dateInput)).toMatch(/\\d{2}\\/\\d{2}\\/\\d{4}/)` |
  | `"Confirm handling of special characters"`          | `expect(await inputsPage.getText(inputsPage.textInput)).toContain(value)`                    |

  ---

  ## 📑 Example Test Case Generated from JSON

  ```typescript
  test('TC001 - Verify Number Input Accepts Valid Number', async ({ page }) => {
    const inputsPage = new InputsPage(page);

    console.log("Step 1: Enter dynamic number into Number input field");
    await inputsPage.fillInput(inputsPage.numberInput, "123");

    console.log("Step 2: Click Display Inputs");
    await inputsPage.clickButton(inputsPage.displayButton);

    console.log("Checkpoint: Validate displayed value matches entered number");
    const displayedValue = await inputsPage.getText(inputsPage.numberInput);
    expect(displayedValue).toBe("123");
  });
  ```


## 📂 Starter Project Structure

```md
project-root/
│── test_suite.json        # JSON file with all test cases
│── basePage.ts            # Common reusable methods
│── inputsPage.ts          # Page Object with selectors
│── inputs.spec.ts         # Test runner consuming JSON
```

### `basePage.ts`

```typescript
export class BasePage {
  constructor(protected page: any) {}

  async fillInput(locator: any, value: string) {
    console.log(`Filling input with value: ${value}`);
    await locator.fill(value);
  }

  async clickButton(locator: any) {
    console.log(`Clicking button`);
    await locator.click();
  }

  async getText(locator: any): Promise<string> {
    return await locator.textContent();
  }
}

```

### `inputsPage.ts`


```typescript
import { BasePage } from './basePage';

export class InputsPage extends BasePage {
  readonly numberInput = this.page.locator('#number');
  readonly textInput = this.page.locator('#text');
  readonly passwordInput = this.page.locator('#password');
  readonly dateInput = this.page.locator('#date');
  readonly displayButton = this.page.locator('#display');
  readonly clearButton = this.page.locator('#clear');
}

```

`input.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { InputsPage } from './inputsPage';
import * as testSuite from './test_suite.json';

test.describe('Web Inputs Automation Suite', () => {
  for (const category of Object.keys(testSuite)) {
    for (const tc of (testSuite as any)[category]) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const inputsPage = new InputsPage(page);

        for (const step of tc.steps) {
          console.log(`Step: ${step}`);
          // Map step text → actual Playwright action using mapping table
        }

        console.log(`Checkpoint: ${tc.checkpoint}`);
        // Example assertion (replace with mapped checkpoint logic)
        const result = await inputsPage.getText(inputsPage.numberInput);
        expect(result).toBe(tc.expectedResult);
      });
    }
  }
});

```
