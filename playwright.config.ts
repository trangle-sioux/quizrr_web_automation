import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        [
          'junit',
          {
            outputFile: 'results.xml',
          },
        ],
        ['html'],
      ]
    : 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',

    // Record video for each test, but remove all videos from successful test runs.
    video: 'retain-on-failure',

    // Set locating attribute for  page.getByTestId() method
    testIdAttribute: 'id',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */

    /* MOBILE - Android - Pixel 5. */
    {
      name: 'Emulator Pixel 5',
      use: { ...devices['Pixel 5'] },
    },
    /* MOBILE - iOS - iPhone 12. */
    {
      name: 'Simulator iphone 12',
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
