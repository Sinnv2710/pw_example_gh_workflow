import { BasePage } from '../basePage';

export class InputsPage extends BasePage {
  // actual IDs from the live page
  readonly numberInput = this.page.locator('#input-number');
  readonly textInput = this.page.locator('#input-text');
  readonly passwordInput = this.page.locator('#input-password');
  readonly dateInput = this.page.locator('#input-date');
  readonly displayButton = this.page.locator('#btn-display-inputs');
  readonly clearButton = this.page.locator('#btn-clear-inputs');
}
