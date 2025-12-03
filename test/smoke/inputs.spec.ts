// Playwright test suite for Inputs Page using test_cases.json
import { test, expect } from '@playwright/test';
import { InputsPage } from '../../core/pages/inputsPage';
import testSuite from '../../core/testcases/Inputs_Page/test_cases.json';

// Dynamic values for test cases
const dynamicValues = {
  number: '123',
  text: 'HelloWorld',
  password: 'Secret123!',
  date: '03/12/2025',
  longText: 'A'.repeat(255),
  alphabetic: 'abc',
  specialChars: '!@#$%^&*()',
  invalidDate: '12-03-2025',
  // ISO format for HTML date inputs (useful for type="date")
  isoDate: '2025-12-03',
  zero: '0',
  // use ISO format for date inputs (YYYY-MM-DD) so Playwright can set the value
  futureDate: '2100-01-01',
};

test.describe('Web Inputs Automation Suite', () => {
  for (const category of Object.keys(testSuite)) {
    for (const tc of (testSuite as any)[category]) {
      test(`${tc.id} - ${tc.title}`, async ({ page }) => {
        const inputsPage = new InputsPage(page);

        // navigate to baseURL (playwright.config.ts defines baseURL) so tests run from the right page
        await page.goto('/inputs');
        // ensure the page is ready and the number input is visible before interacting
        await expect(inputsPage.numberInput).toBeVisible({ timeout: 5000 });

        // Step execution
        for (const step of tc.steps) {
          console.log(`Step: ${step}`);
          if (/Enter dynamic number/.test(step)) {
            await inputsPage.fillInput(inputsPage.numberInput, dynamicValues.number);
          } else if (/Enter dynamic text/.test(step)) {
            await inputsPage.fillInput(inputsPage.textInput, dynamicValues.text);
          } else if (/Enter dynamic password/.test(step)) {
            await inputsPage.fillInput(inputsPage.passwordInput, dynamicValues.password);
          } else if (/Enter valid date/.test(step)) {
            // use ISO date format for type=date inputs
            await inputsPage.fillInput(inputsPage.dateInput, dynamicValues.isoDate);
          } else if (/Fill all input fields/.test(step) || /Quickly fill all fields/.test(step)) {
            await inputsPage.fillInput(inputsPage.numberInput, dynamicValues.number);
            await inputsPage.fillInput(inputsPage.textInput, dynamicValues.text);
            await inputsPage.fillInput(inputsPage.passwordInput, dynamicValues.password);
            await inputsPage.fillInput(inputsPage.dateInput, dynamicValues.isoDate);
          } else if (/Enter alphabetic characters/.test(step)) {
            // Trying to fill non-numeric text into input[type=number] will throw - handle gracefully
            try {
              await inputsPage.fillInput(inputsPage.numberInput, dynamicValues.alphabetic);
            } catch (e: any) {
              // expected browser validation - continue so checkpoint can validate that it was not accepted
              console.log('Expected failure while filling alphabetic into number input:', e?.message ?? e)
            }
          } else if (/Leave all fields empty/.test(step)) {
            await inputsPage.fillInput(inputsPage.numberInput, '');
            await inputsPage.fillInput(inputsPage.textInput, '');
            await inputsPage.fillInput(inputsPage.passwordInput, '');
            await inputsPage.fillInput(inputsPage.dateInput, '');
          } else if (/Enter date in wrong format/.test(step)) {
            // Filling a malformed date into input[type=date] will throw in Playwright — catch and continue
            try {
              await inputsPage.fillInput(inputsPage.dateInput, dynamicValues.invalidDate);
            } catch (e: any) {
              console.log('Expected failure while filling malformed date:', e?.message ?? e)
            }
          } else if (/Enter special characters/.test(step)) {
            await inputsPage.fillInput(inputsPage.textInput, dynamicValues.specialChars);
          } else if (/Enter a long string/.test(step)) {
            await inputsPage.fillInput(inputsPage.textInput, dynamicValues.longText);
          } else if (/Enter 0 into the Number input field/.test(step)) {
            await inputsPage.fillInput(inputsPage.numberInput, dynamicValues.zero);
          } else if (/Enter a future date/.test(step)) {
            // Use ISO formatted future date for input[type=date]
            await inputsPage.fillInput(inputsPage.dateInput, dynamicValues.futureDate);
          } else if (/Click 'Display Inputs'/.test(step)) {
            await inputsPage.clickButton(inputsPage.displayButton);
          } else if (/Click 'Clear Inputs'/.test(step)) {
            // If the step text suggests repeated clicks, simulate multiple quick clicks
            if (/repeatedly/.test(step)) {
              for (let i = 0; i < 3; i++) {
                await inputsPage.clickButton(inputsPage.clearButton);
              }
            } else {
              await inputsPage.clickButton(inputsPage.clearButton);
            }
          }
        }

        // Checkpoint assertion
        console.log(`Checkpoint: ${tc.checkpoint}`);
        if (/matches the entered number/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.numberInput);
          expect(val).toBe(dynamicValues.number);
        } else if (/matches the input/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.textInput);
          expect(val).toBe(dynamicValues.text);
        } else if (/masking is applied/.test(tc.checkpoint)) {
          // Masking: check input type is password
          const inputType = await inputsPage.passwordInput.getAttribute('type');
          expect(inputType).toBe('password');
        } else if (/correct date format/.test(tc.checkpoint)) {
          // Accept either dd/mm/yyyy (displayed) or ISO yyyy-mm-dd (native date input)
          const val = await inputsPage.getText(inputsPage.dateInput);
          expect(val).toMatch(/\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
        } else if (/all input fields are cleared/.test(tc.checkpoint)) {
          expect(await inputsPage.getText(inputsPage.numberInput)).toBe('');
          expect(await inputsPage.getText(inputsPage.textInput)).toBe('');
          expect(await inputsPage.getText(inputsPage.passwordInput)).toBe('');
          expect(await inputsPage.getText(inputsPage.dateInput)).toBe('');
        } else if (/non-numeric input is not accepted/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.numberInput);
          expect(val).not.toBe(dynamicValues.alphabetic);
        } else if (/handles empty inputs/.test(tc.checkpoint)) {
          expect(await inputsPage.getText(inputsPage.numberInput)).toBe('');
          expect(await inputsPage.getText(inputsPage.textInput)).toBe('');
        } else if (/date format enforcement/.test(tc.checkpoint)) {
          // Ensure that an invalid date format was not accepted as-is
          const val = await inputsPage.getText(inputsPage.dateInput);
          expect(val).not.toBe(dynamicValues.invalidDate);
        } else if (/handling of special characters/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.textInput);
          expect(val).toContain(dynamicValues.specialChars);
        } else if (/max length handling/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.textInput);
          expect(val.length).toBeLessThanOrEqual(255);
        } else if (/zero is treated as valid input/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.numberInput);
          expect(val).toBe(dynamicValues.zero);
        } else if (/date range handling/.test(tc.checkpoint)) {
          const val = await inputsPage.getText(inputsPage.dateInput);
          expect(val).toBe(dynamicValues.futureDate);
        } else if (/UI responsiveness/.test(tc.checkpoint)) {
          // Just check no error and fields are cleared
          expect(await inputsPage.getText(inputsPage.numberInput)).toBe('');
          expect(await inputsPage.getText(inputsPage.textInput)).toBe('');
        }
      });
    }
  }
});
