import { Page } from '@playwright/test';
import { BasePage } from '../basePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
