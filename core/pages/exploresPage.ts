import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class ExploresPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async amOnExplorerPage() {
    await this.waitForPageLoaded();
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('/shop');
  }

  async canSeeShopHeader() {
    await expect(this.page.locator('[data-refname="shop-header"]')).toBeVisible();
  }

  async canSeeSearchBar() {
    await expect(this.page.locator('[data-refname="search-input"]')).toBeVisible();
  }

  async canSeePlaceHolderTextInSearchBar() {
    const placeholder = await this.page.getAttribute('[data-refname="search-input"]', 'placeholder');
    expect(placeholder).toMatch(/search for products/i);
  }

  async canSeeSortByDropdown() {
    await expect(this.page.locator('[data-refname="sort-dropdown"]')).toBeVisible();
  }

  async canSeeCategoryMenus() {
    await expect(this.page.locator('[data-refname="category-menu"]')).toBeVisible();
  }

  async canSeeCategoryMenuItem(categoryName: string) {
    await expect(this.page.locator('[data-refname="category-item"] p', { hasText: categoryName })).toBeVisible();
  }

  async canSeeProductCard() {
    await expect(this.page.locator('[data-refname="product-card"]')).toBeVisible();
  }

  async canSeeElementsInExplorerPage(categoryNames: string[]) {
    await this.amOnExplorerPage();
    await this.canSeeShopHeader();
    await this.canSeeSearchBar();
    await this.canSeePlaceHolderTextInSearchBar();
    await this.canSeeSortByDropdown();
    for (const category of categoryNames) {
      await this.canSeeCategoryMenuItem(category);
    }
    await this.canSeeCategoryMenus();
    await this.canSeeProductCard();
  }

  // API and product detail logic can be ported as needed
}
