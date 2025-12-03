import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async shouldBeDisplayedAfterRedirected(expectedUrl: string, expectedBanner: string) {
    await expect(this.page).toHaveURL(expectedUrl);
    await expect(this.page.locator('h2.chakra-heading')).toHaveText(expectedBanner);
  }

  async fillInLoginForm(email: string, password: string) {
    await this.page.fill('input#email', email);
    await this.page.fill('input#password', password);
  }

  async clickLoginButton() {
    await this.page.click('button[type="submit"]');
  }
}
