import { Page, expect } from '@playwright/test'

export class BasePage {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	async click(locator: string) {
		await this.page.waitForSelector(locator, {
			state: 'visible',
			timeout: 5000,
		})
		await this.page.click(locator)
	}

	async selectOption(locator: string, value: string) {
		await this.page.waitForSelector(locator, {
			state: 'visible',
			timeout: 5000,
		})
		await this.page.selectOption(locator, value)
	}

	async fillField(locator: string, value: string) {
		await this.page.waitForSelector(locator, {
			state: 'visible',
			timeout: 5000,
		})
		await this.page.click(locator)
		await this.page.fill(locator, value)
	}

	async findElement(locator: string) {
		await expect(this.page.locator(locator)).toBeVisible()
	}

	async getTextFrom(locator: string) {
		try {
			// prefer input value for form controls
			return await this.page.locator(locator).inputValue()
		} catch (e) {
			return (await this.page.textContent(locator)) ?? ''
		}
	}

	async waitForPageLoaded() {
		await this.page.waitForSelector('#__next', { state: 'visible' })
	}

	async getOriginURL() {
		return this.page.evaluate(() => document.location.origin)
	}

	async isElementVisible(locator: string) {
		return await this.page.isVisible(locator)
	}

	convertDecimalCurrencies(value: string) {
		const decimalValue = parseFloat(value)
		return (decimalValue / 100).toFixed(2)
	}

	async getIndexOfElementFromList(
		elementLocator: string,
		text: string,
	): Promise<number | undefined> {
		const elements = await this.page.$$(elementLocator)
		for (let i = 0; i < elements.length; i++) {
			const elementText = await elements[i].textContent()
			if (elementText?.trim() === text) {
				return i
			}
		}
		return undefined
	}

	async fillInput(locator: any, value: string) {
		console.log(`Filling input with value: ${value}`)
		await locator.fill(value)
	}

	async clickButton(locator: any) {
		console.log(`Clicking button`)
		await locator.click()
	}

	async getText(locator: any): Promise<string> {
		// For input elements, locator.inputValue() returns the current value
		try {
			return await locator.inputValue()
		} catch (e) {
			return (await locator.textContent()) ?? ''
		}
	}
}
