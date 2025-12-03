import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async amOnHomePage() {
    await this.waitForPageLoaded();
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('/home');
  }

  async canSeeElementsOnHeader() {
    await this._canSeeMenuBar();
    await this._canSeeCartIcon();
  }

  async _canSeeMenuBar() {
    await expect(this.page.locator('div[data-refname="menu-bar"]')).toBeVisible();
  }

  async _canSeeCartIcon() {
    await expect(this.page.locator('button[data-refname="cart-icon"]')).toBeVisible();
  }

  async selectMenuOnHeader(menu: 'home' | 'explore' | 'plan' | 'records' | 'earn' | 'logo' | 'cart' | 'account') {
    let selector = '';
    switch (menu) {
      case 'home':
        selector = 'div[data-refname="menu-item"]:nth-of-type(1)';
        break;
      case 'explore':
        selector = 'div[data-refname="menu-item"]:nth-of-type(2)';
        break;
      case 'plan':
        selector = 'div[data-refname="menu-item"]:nth-of-type(3)';
        break;
      case 'earn':
        selector = 'div[data-refname="menu-item"]:nth-of-type(4)';
        break;
      case 'records':
        selector = 'div[data-refname="menu-item"]:nth-of-type(5)';
        break;
      case 'logo':
        selector = 'a#logoWrapper';
        break;
      case 'cart':
        selector = 'button[data-refname="cart-icon"]';
        break;
      case 'account':
        selector = '[data-refname="profile-dropdown"]';
        break;
      default:
        throw new Error('Not Found Menu on Header');
    }
    await this.click(selector);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
