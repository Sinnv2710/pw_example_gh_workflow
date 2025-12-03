import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class EvaluationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
