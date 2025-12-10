import { Page, Locator } from '@playwright/test';
import { logger } from './logger';

/**
 * Visual regression testing utilities
 * Provides screenshot comparison and visual testing helpers
 */

/**
 * Take screenshot of element
 * @param locator - Element locator
 * @param name - Screenshot name
 * @returns Buffer containing screenshot
 */
export async function takeElementScreenshot(
  locator: Locator,
  name: string
): Promise<Buffer> {
  logger.debug(`Taking screenshot of element: ${name}`);
  return locator.screenshot();
}

/**
 * Take full page screenshot
 * @param page - Playwright page object
 * @param name - Screenshot name
 * @returns Buffer containing screenshot
 */
export async function takeFullPageScreenshot(
  page: Page,
  name: string
): Promise<Buffer> {
  logger.debug(`Taking full page screenshot: ${name}`);
  return page.screenshot({ fullPage: true });
}

/**
 * Compare two screenshots (basic pixel comparison)
 * Note: For production use, consider using tools like Percy, Applitools, or Playwright's built-in visual comparison
 * @param screenshot1 - First screenshot buffer
 * @param screenshot2 - Second screenshot buffer
 * @param threshold - Pixel difference threshold (0-1)
 * @returns Object with comparison result
 */
export function compareScreenshots(
  screenshot1: Buffer,
  screenshot2: Buffer,
  threshold: number = 0.1
): { match: boolean; difference: number } {
  logger.debug('Comparing screenshots', { threshold });
  
  // Basic comparison - in production, use specialized tools
  if (screenshot1.length !== screenshot2.length) {
    return { match: false, difference: 1.0 };
  }

  let differences = 0;
  const totalPixels = screenshot1.length;
  
  for (let i = 0; i < totalPixels; i++) {
    if (screenshot1[i] !== screenshot2[i]) {
      differences++;
    }
  }

  const differenceRatio = differences / totalPixels;
  const match = differenceRatio <= threshold;

  logger.debug('Screenshot comparison result', {
    match,
    difference: differenceRatio,
    threshold,
  });

  return { match, difference: differenceRatio };
}

/**
 * Wait for visual stability before taking screenshot
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait
 */
export async function waitForVisualStability(
  page: Page,
  timeout: number = 2000
): Promise<void> {
  logger.debug(`Waiting for visual stability (timeout: ${timeout}ms)`);
  
  // Wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout });
  
  // Additional wait for animations/transitions
  // Using a small delay to allow CSS transitions to complete
  await new Promise((resolve) => setTimeout(resolve, 500));
}

