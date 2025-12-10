import { chromium, FullConfig } from '@playwright/test';
import { logger } from './utils/logger';

/**
 * Global setup runs once before all tests
 * Use this for:
 * - Database setup/cleanup
 * - API authentication
 * - Test data preparation
 * - Environment validation
 */

async function globalSetup(config: FullConfig): Promise<void> {
  logger.step('Global Setup');
  logger.info('Starting global setup...');

  // Example: Validate environment
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) {
    throw new Error('Base URL is not configured');
  }
  logger.info(`Base URL: ${baseURL}`);

  // Example: Health check - verify the application is accessible
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
    
    if (!response?.ok()) {
      throw new Error(`Application health check failed: ${response.status()}`);
    }
    
    logger.info('Application health check passed');
    await browser.close();
  } catch (error) {
    logger.error('Application health check failed', error);
    throw error;
  }

  // Example: Setup test data or API authentication
  // await setupTestData();
  // await authenticateAPI();

  logger.info('Global setup completed successfully');
}

export default globalSetup;

