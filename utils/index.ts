/**
 * Central export point for all utility functions
 * Provides easy access to all helper utilities
 */

export { logger, LogLevel } from './logger';
export { ApiHelpers, type ApiRequestOptions } from './api-helpers';
export {
  waitForNetworkIdle,
  waitForElementStable,
  waitForMultipleConditions,
} from './wait-helpers';
export {
  readJsonFile,
  writeJsonFile,
  fileExists,
  ensureDirectoryExists,
  getAbsolutePath,
} from './file-helpers';
export {
  generateUser,
  generateOrder,
  generateProductName,
  generateEmail,
  generateRandomString,
  generateRandomNumber,
  generateRandomDate,
} from './test-data-factory';
export {
  takeElementScreenshot,
  takeFullPageScreenshot,
  compareScreenshots,
  waitForVisualStability,
} from './visual-helpers';
export {
  measurePageLoadPerformance,
  assertPerformanceThresholds,
  monitorNetworkRequests,
  type PerformanceMetrics,
} from './performance-helpers';
