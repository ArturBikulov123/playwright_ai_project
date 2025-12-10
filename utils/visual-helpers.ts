import { Page, expect } from '@playwright/test';
import { logger } from './logger';

/**
 * Visual testing helpers for screenshot comparison and visual regression testing
 * Provides utilities for taking and comparing screenshots
 */

export class VisualHelpers {
  /**
   * Take a full page screenshot
   * @param page - Playwright page object
   * @param name - Screenshot name (without extension)
   * @param options - Screenshot options
   */
  static async takeScreenshot(
    page: Page,
    name: string,
    options: { fullPage?: boolean; clip?: { x: number; y: number; width: number; height: number } } = {}
  ): Promise<void> {
    logger.debug(`Taking screenshot: ${name}`);
    await page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: options.fullPage ?? true,
      clip: options.clip,
    });
  }

  /**
   * Compare screenshot with baseline (visual regression testing)
   * @param page - Playwright page object
   * @param name - Screenshot name (without extension)
   * @param threshold - Pixel difference threshold (0-1)
   */
  static async compareScreenshot(page: Page, name: string, threshold: number = 0.2): Promise<void> {
    logger.debug(`Comparing screenshot: ${name}`);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      threshold,
      maxDiffPixels: 100,
    });
  }

  /**
   * Take screenshot of a specific element
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param name - Screenshot name (without extension)
   */
  static async takeElementScreenshot(
    page: Page,
    selector: string,
    name: string
  ): Promise<void> {
    logger.debug(`Taking element screenshot: ${name}`);
    const element = page.locator(selector);
    await element.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  /**
   * Hide elements before taking screenshot (useful for dynamic content)
   * @param page - Playwright page object
   * @param selectors - Array of selectors to hide
   */
  static async hideElements(page: Page, selectors: string[]): Promise<void> {
    logger.debug('Hiding elements for screenshot');
    for (const selector of selectors) {
      await page.locator(selector).evaluate((el: Element) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (el as HTMLElement).style.visibility = 'hidden';
      });
    }
  }

  /**
   * Show elements after taking screenshot
   * @param page - Playwright page object
   * @param selectors - Array of selectors to show
   */
  static async showElements(page: Page, selectors: string[]): Promise<void> {
    logger.debug('Showing elements after screenshot');
    for (const selector of selectors) {
      await page.locator(selector).evaluate((el: Element) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (el as HTMLElement).style.visibility = 'visible';
      });
    }
  }
}

