import { chromium, FullConfig } from '@playwright/test';
import { logger } from './utils/logger';
import { envConfig } from './config/env.config';

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

  // Validate environment - use envConfig for consistency
  const baseURL = envConfig.baseUrl || config.projects[0]?.use?.baseURL;
  if (!baseURL) {
    throw new Error('Base URL is not configured. Set BASE_URL in environment or .env file');
  }
  logger.info(`Base URL: ${baseURL}`);

  // Health check - verify the application is accessible
  // Behavior controlled by FAIL_ON_HEALTH_CHECK environment variable
  const failOnHealthCheck = process.env.FAIL_ON_HEALTH_CHECK === 'true';
  
  try {
    // Use environment variable to disable headless shell if set
    const useHeadlessNew = process.env.PW_USE_HEADLESS_NEW !== '0';
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        ...(useHeadlessNew ? [] : ['--disable-headless-shell']),
      ],
    });
    
    const page = await browser.newPage();
    const response = await page.goto(baseURL, { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    if (!response?.ok()) {
      const errorMessage = `Application health check returned status: ${response.status()}`;
      if (failOnHealthCheck) {
        await browser.close();
        throw new Error(errorMessage);
      }
      logger.warn(errorMessage);
    } else {
      logger.info('Application health check passed');
    }
    
    await browser.close();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (failOnHealthCheck) {
      logger.error('Application health check failed, failing setup', { error: errorMessage });
      throw error;
    }
    // Log warning but don't fail the setup - allows tests to run even if health check fails
    logger.warn('Application health check failed, continuing with test execution', { 
      error: errorMessage 
    });
  }

  logger.info('Global setup completed successfully');
}

export default globalSetup;

