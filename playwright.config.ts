import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  timeout: 30 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Use 'html' reporter, but disable auto-open in CI/pipeline
  reporter: [ ['html', { open: 'never' }] ],
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    baseURL: 'https://practice.expandtesting.com', // Update as needed
    headless: process.env.HEADED ? false : true, // Set HEADED=1 for headed mode
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
