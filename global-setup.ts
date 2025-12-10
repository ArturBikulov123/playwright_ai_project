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
  // Non-blocking: if health check fails, log warning but don't fail the setup
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
    });
    
    const page = await browser.newPage();
    const response = await page.goto(baseURL, { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    if (!response?.ok()) {
      logger.warn(`Application health check returned status: ${response.status()}`);
    } else {
      logger.info('Application health check passed');
    }
    
    await browser.close();
  } catch (error) {
    // Log warning but don't fail the setup - allows tests to run even if health check fails
    logger.warn('Application health check failed, continuing with test execution', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    // Don't throw - allow tests to proceed
  }

  // Example: Setup test data or API authentication
  // await setupTestData();
  // await authenticateAPI();

  logger.info('Global setup completed successfully');
}

export default globalSetup;

