import { FullConfig } from '@playwright/test'
import { logger } from './utils/logger'

/**
 * Global teardown runs once after all tests
 * Use this for:
 * - Cleanup test data
 * - Close database connections
 * - Generate final reports
 * - Cleanup temporary files
 */

function globalTeardown(config: FullConfig): Promise<void> {
  logger.step('Global Teardown')
  logger.info('Starting global teardown...')

  logger.info('Test execution completed')
  logger.info(`Test results directory: ${config.outputDir}`)

  logger.info('Global teardown completed successfully')
  return Promise.resolve()
}

export default globalTeardown

