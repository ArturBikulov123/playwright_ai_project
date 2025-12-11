import { defineConfig, devices } from '@playwright/test'
import { envConfig } from './config/env.config'

/**
 * Playwright configuration for SauceDemo test framework
 * Configured for enterprise-level testing with sensible timeouts and reporting
 * Supports multiple browsers, environments, and comprehensive reporting
 * 
 * SHARDING: To speed up test execution, use sharding:
 * - Run with sharding: npm run test:shard:1:4 (runs shard 1 of 4)
 * - Run all shards in parallel: npm run test:shard:all
 * - Sharding splits tests across multiple processes for faster execution
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.(spec|test)\.(ts|js|tsx|jsx)|.*_spec.*\.(ts|js|tsx|jsx)/,
  fullyParallel: true, // Required for effective sharding
  forbidOnly: !!envConfig.ci,
  retries: envConfig.retries,
  workers: envConfig.workers, // Auto-detects CPU cores if undefined, optimal for sharding

  // Global setup and teardown
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ...(envConfig.ci ? [['github'] as const] : []),
  ],

  // Global test configuration
  use: {
    baseURL: envConfig.baseUrl,
    trace: envConfig.traceMode,
    screenshot: envConfig.screenshotMode,
    video: envConfig.videoMode,
    actionTimeout: envConfig.timeout,
    navigationTimeout: envConfig.timeout,
    // SECURITY: Configure secure cookie handling
    // In production, ensure cookies use Secure, HttpOnly, and SameSite flags
    // Note: Playwright doesn't directly set these, but we can validate them in tests
    // This is a reminder to check cookie security in application tests
    ignoreHTTPSErrors: false, // SECURITY: Enforce HTTPS certificate validation
  },

  timeout: envConfig.timeout,
  expect: {
    timeout: envConfig.expectTimeout,
    // Use toHaveScreenshot for visual regression testing
    toHaveScreenshot: { threshold: 0.2 },
    toMatchSnapshot: { threshold: 0.2 },
  },

  // Multiple browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    // Commented out other browsers - using only Chrome for now
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    // // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    // // Tablet viewports
    // {
    //   name: 'Tablet',
    //   use: { ...devices['iPad Pro'] },
    // },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results',
})

