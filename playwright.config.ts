import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './tests/test-cases',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,

	reporter: [
		['html', { outputFolder: 'playwright-report' }],
		['json', { outputFile: 'test-results/results.json' }],
		['junit', { outputFile: 'test-results/junit.xml' }],
		['list'],
	],

	use: {
		trace: 'on',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		actionTimeout: 10000,
		navigationTimeout: 30000,
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	outputDir: 'test-results',
})
