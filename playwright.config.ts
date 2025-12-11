import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * 
 * This configuration supports:
 * - Test directory: ./tests/test-cases (new structure) and ./test (backward compatibility)
 * - Comprehensive reporting: HTML, JSON, JUnit
 * - Trace collection on failure for debugging
 * - Screenshots on failure
 * - Video retention on failure
 */
export default defineConfig({
  // Test directory - supports both new structure and backward compatibility
  testDir: './test',
  
  // Timeout configuration
  timeout: 30 * 1000, // 30 seconds for test timeout
  expect: {
    timeout: 10 * 1000, // 10 seconds for expect assertions
  },

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Comprehensive reporting
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'], // Console output
  ],

  // Global test settings
  use: {
    // Action timeout
    actionTimeout: 10 * 1000, // 10 seconds for actions

    // Navigation timeout
    navigationTimeout: 30 * 1000, // 30 seconds for navigation

    // Trace collection - on by default for better debugging
    trace: 'on',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Base URL for the application under test
    baseURL: 'https://practice.expandtesting.com',

    // Headless mode
    headless: process.env.HEADED ? false : true,

    // Viewport size
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors (use with caution)
    ignoreHTTPSErrors: true,

    // Artifacts
    testIdAttribute: 'data-testid',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome-specific settings
        launchOptions: {
          args: ['--disable-web-security'], // For CORS testing if needed
        },
      },
    },
    // Uncomment to enable additional browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Web server configuration (if testing local apps)
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
