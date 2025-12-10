import { Page, Locator } from '@playwright/test';
import { logger } from './logger';

/**
 * Wait helper utilities for common wait scenarios
 * Provides reusable wait strategies beyond Playwright's built-in waits
 */

export class WaitHelpers {
  /**
   * Wait for network to be idle (no requests for specified duration)
   * @param page - Playwright page object
   * @param timeout - Maximum time to wait in milliseconds
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 5000): Promise<void> {
    logger.debug('Waiting for network to be idle');
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch {
      logger.warn('Network idle timeout reached, continuing anyway');
    }
  }

  /**
   * Wait for element to be visible and stable (not moving)
   * @param locator - Element locator
   * @param timeout - Maximum time to wait in milliseconds
   */
  static async waitForStable(locator: Locator, timeout: number = 5000): Promise<void> {
    logger.debug('Waiting for element to be stable');
    await locator.waitFor({ state: 'visible', timeout });
    // Additional wait to ensure element is not animating
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  /**
   * Wait for multiple conditions to be true
   * @param conditions - Array of async functions that return boolean
   * @param timeout - Maximum time to wait in milliseconds
   * @param interval - Check interval in milliseconds
   */
  static async waitForAll(
    conditions: Array<() => Promise<boolean>>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const results = await Promise.all(conditions.map((condition) => condition()));
      if (results.every((result) => result === true)) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error('Timeout waiting for all conditions to be true');
  }

  /**
   * Wait for any condition to be true
   * @param conditions - Array of async functions that return boolean
   * @param timeout - Maximum time to wait in milliseconds
   * @param interval - Check interval in milliseconds
   */
  static async waitForAny(
    conditions: Array<() => Promise<boolean>>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const results = await Promise.all(conditions.map((condition) => condition()));
      if (results.some((result) => result === true)) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error('Timeout waiting for any condition to be true');
  }

  /**
   * Wait for a specific number of elements to be present
   * @param locator - Element locator
   * @param count - Expected number of elements
   * @param timeout - Maximum time to wait in milliseconds
   */
  static async waitForElementCount(
    locator: Locator,
    count: number,
    timeout: number = 5000
  ): Promise<void> {
    logger.debug(`Waiting for ${count} elements to be present`);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentCount = await locator.count();
      if (currentCount === count) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    const actualCount = await locator.count();
    throw new Error(
      `Expected ${count} elements but found ${actualCount} after ${timeout}ms`
    );
  }
}

