import { Page, Locator } from '@playwright/test'

/**
 * Locator Strategy Interface
 */
export interface LocatorStrategy {
	primary: string
	fallback?: string
	dataTestId?: string
	xpath?: string
	description?: string
}

/**
 * LocatorHelper - Smart locator resolution with automatic fallback
 */
export class LocatorHelper {
	constructor(private page: Page, private enableLogging: boolean = false) {}

	/**
	 * Get locator with automatic fallback (async)
	 */
	async getLocator(strategy: LocatorStrategy): Promise<Locator> {
		const primaryLocator = this.page.locator(strategy.primary)

		try {
			const count = await primaryLocator.count()
			if (count > 0) {
				this.log(`✓ Using primary selector: ${strategy.primary}`)
				return primaryLocator
			}
		} catch (error) {
			this.log(`✗ Primary selector failed: ${strategy.primary}`)
		}

		if (strategy.dataTestId) {
			const testIdLocator = this.page.locator(strategy.dataTestId)
			const count = await testIdLocator.count()
			if (count > 0) {
				this.log(`✓ Using data-testid: ${strategy.dataTestId}`)
				return testIdLocator
			}
		}

		if (strategy.fallback) {
			this.log(`→ Using fallback selector: ${strategy.fallback}`)
			return this.page.locator(strategy.fallback)
		}

		// No selectors matched any elements; throw an error for clarity
		throw new Error(
			`LocatorHelper: No elements found for any selector.` +
				`Primary: "${strategy.primary}"` +
				(strategy.dataTestId ? `, dataTestId: "${strategy.dataTestId}"` : '') +
				(strategy.fallback ? `, fallback: "${strategy.fallback}"` : '') +
				(strategy.xpath ? `, xpath: "${strategy.xpath}"` : ''),
		)
	}

	/**
	 * Get locator synchronously (recommended for most cases)
	 */
	getLocatorSync(strategy: LocatorStrategy): Locator {
		return this.page.locator(strategy.primary)
	}

	/**
	 * Get locator with text filter
	 */
	getByText(strategy: LocatorStrategy, text: string): Locator {
		return this.page.locator(strategy.primary).filter({ hasText: text })
	}

	private log(message: string): void {
		if (this.enableLogging) {
			console.log(`[LocatorHelper] ${message}`)
		}
	}
}
