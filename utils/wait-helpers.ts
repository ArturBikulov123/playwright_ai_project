import { Page, Locator } from '@playwright/test';
import { logger } from './logger';

/**
 * Advanced wait strategies for Playwright tests
 * Provides utilities beyond default Playwright wait methods
 */

/**
 * Wait for network to be idle (no requests for specified duration)
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait in milliseconds
 * @param idleTime - Time in milliseconds to wait with no network activity
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout: number = 30000,
  idleTime: number = 500
): Promise<void> {
  logger.debug(`Waiting for network idle (timeout: ${timeout}ms, idle: ${idleTime}ms)`);
  
  const startTime = Date.now();
  let lastRequestTime = Date.now();
  let requestCount = 0;

  const checkIdle = (): Promise<void> => new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        if (timeSinceLastRequest >= idleTime) {
          clearInterval(checkInterval);
          logger.debug(`Network idle achieved after ${requestCount} requests`);
          resolve();
        }

        if (now - startTime >= timeout) {
          clearInterval(checkInterval);
          reject(new Error(`Network idle timeout after ${timeout}ms`));
        }
      }, 100);
    });

  // Track network requests
  page.on('request', () => {
    lastRequestTime = Date.now();
    requestCount++;
  });

  await checkIdle();
}

/**
 * Wait for element to be stable (not moving/resizing)
 * @param locator - Element locator
 * @param timeout - Maximum time to wait in milliseconds
 * @param stableTime - Time in milliseconds element must remain stable
 */
export async function waitForElementStable(
  locator: Locator,
  timeout: number = 10000,
  stableTime: number = 500
): Promise<void> {
  logger.debug(`Waiting for element stability (timeout: ${timeout}ms, stable: ${stableTime}ms)`);
  
  const startTime = Date.now();
  let lastChangeTime = Date.now();
  let lastBounds: { x: number; y: number; width: number; height: number } | null = null;

  const checkStable = async (): Promise<void> => new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        void (async () => {
          try {
            const bounds = await locator.boundingBox();
            const now = Date.now();

            if (bounds) {
              if (
                lastBounds &&
                (bounds.x !== lastBounds.x ||
                  bounds.y !== lastBounds.y ||
                  bounds.width !== lastBounds.width ||
                  bounds.height !== lastBounds.height)
              ) {
                lastChangeTime = now;
              }
              lastBounds = bounds;
            }

            const timeSinceLastChange = now - lastChangeTime;
            if (timeSinceLastChange >= stableTime) {
              clearInterval(checkInterval);
              logger.debug('Element is stable');
              resolve();
            }

            if (now - startTime >= timeout) {
              clearInterval(checkInterval);
              reject(new Error(`Element stability timeout after ${timeout}ms`));
            }
          } catch (error) {
            clearInterval(checkInterval);
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        })();
      }, 100);
    });

  await checkStable();
}

/**
 * Wait for multiple conditions to be met
 * @param conditions - Array of async functions that return boolean
 * @param timeout - Maximum time to wait in milliseconds
 */
export async function waitForMultipleConditions(
  conditions: Array<() => Promise<boolean>>,
  timeout: number = 10000
): Promise<void> {
  logger.debug(`Waiting for ${conditions.length} conditions (timeout: ${timeout}ms)`);
  
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const results = await Promise.all(conditions.map((condition) => condition()));
    if (results.every((result) => result === true)) {
      logger.debug('All conditions met');
      return;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Multiple conditions timeout after ${timeout}ms`);
}

