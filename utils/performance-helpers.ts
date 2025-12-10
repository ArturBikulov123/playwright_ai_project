import { Page } from '@playwright/test';
import { logger } from './logger';

/**
 * Performance testing helpers
 * Provides utilities for measuring and analyzing page performance
 */

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  totalSize: number;
  requestCount: number;
}

export class PerformanceHelpers {
  /**
   * Measure page load performance metrics
   * @param page - Playwright page object
   * @returns Performance metrics object
   */
  static async measurePagePerformance(page: Page): Promise<PerformanceMetrics> {
    logger.debug('Measuring page performance');

    const metrics = await page.evaluate(() => {
       
      const navigationEntries = performance.getEntriesByType('navigation');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const navigation = navigationEntries[0] as PerformanceNavigationTiming;
      if (!navigation) {
        throw new Error('Navigation timing not available');
      }
       
      const paint = performance.getEntriesByType('paint') as PerformancePaintTiming[];
      
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        firstPaint: paint.find((entry) => entry.name === 'first-paint')?.startTime ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        firstContentfulPaint: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        timeToInteractive: navigation.domInteractive - navigation.fetchStart,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        totalSize: navigation.transferSize,
         
        requestCount: performance.getEntriesByType('resource').length,
      };
    });

    logger.info('Performance metrics collected', metrics);
    return metrics;
  }

  /**
   * Assert page load time is within threshold
   * @param page - Playwright page object
   * @param maxLoadTime - Maximum acceptable load time in milliseconds
   */
  static async assertLoadTime(page: Page, maxLoadTime: number): Promise<void> {
    const metrics = await this.measurePagePerformance(page);
    if (metrics.loadTime > maxLoadTime) {
      throw new Error(
        `Page load time ${metrics.loadTime}ms exceeds maximum ${maxLoadTime}ms`
      );
    }
    logger.info(`Page load time ${metrics.loadTime}ms is within threshold ${maxLoadTime}ms`);
  }

  /**
   * Monitor network requests and log slow requests
   * @param page - Playwright page object
   * @param slowThreshold - Threshold in milliseconds to consider a request slow
   */
  static monitorSlowRequests(page: Page, slowThreshold: number = 1000): void {
    logger.debug('Monitoring network requests');
    
    page.on('response', (response) => {
      const request = response.request();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const timing = response.timing();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const responseEnd = timing.responseEnd as number;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const requestStart = timing.requestStart as number;
      const duration = responseEnd - requestStart;
      
      if (duration > slowThreshold) {
        logger.warn(`Slow request detected: ${request.url()} took ${duration}ms`);
      }
    });
  }

  /**
   * Get resource sizes for all loaded resources
   * @param page - Playwright page object
   * @returns Array of resource information
   */
  static async getResourceSizes(page: Page): Promise<Array<{ url: string; size: number; type: string }>> {
    logger.debug('Collecting resource sizes');
    
    const resources = await page.evaluate(() => {
       
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map((entry: PerformanceResourceTiming) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        url: entry.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        size: entry.transferSize,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        type: entry.initiatorType,
      }));
    });

    logger.debug(`Found ${resources.length} resources`);
    return resources;
  }
}

