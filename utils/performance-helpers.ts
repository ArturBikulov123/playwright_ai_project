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

    const metrics = await page.evaluate((): PerformanceMetrics => {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navigation: PerformanceNavigationTiming | undefined = navigationEntries[0];
      if (!navigation) {
        throw new Error('Navigation timing not available');
      }
       
      const paint = performance.getEntriesByType('paint') as PerformancePaintTiming[];
      const firstPaintEntry: PerformancePaintTiming | undefined = paint.find((entry) => entry.name === 'first-paint');
      const firstContentfulPaintEntry: PerformancePaintTiming | undefined = paint.find((entry) => entry.name === 'first-contentful-paint');
      
      return {
        loadTime: Number(navigation.loadEventEnd) - Number(navigation.fetchStart),
        domContentLoaded: Number(navigation.domContentLoadedEventEnd) - Number(navigation.fetchStart),
        firstPaint: Number(firstPaintEntry?.startTime ?? 0),
        firstContentfulPaint: Number(firstContentfulPaintEntry?.startTime ?? 0),
        timeToInteractive: Number(navigation.domInteractive) - Number(navigation.fetchStart),
        totalSize: Number(navigation.transferSize),
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
      try {
        const responseWithTiming = response as { timing: () => { responseEnd?: number; requestStart?: number } };
        const timing = responseWithTiming.timing();
        const responseEnd: number = Number(timing.responseEnd ?? 0);
        const requestStart: number = Number(timing.requestStart ?? 0);
        const duration = responseEnd - requestStart;
        
        if (duration > slowThreshold) {
          logger.warn(`Slow request detected: ${request.url()} took ${duration}ms`);
        }
      } catch {
        logger.debug('Timing information not available for request');
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
    
    const resources = await page.evaluate((): Array<{ url: string; size: number; type: string }> => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map((entry: PerformanceResourceTiming) => ({
        url: String(entry.name),
        size: Number(entry.transferSize),
        type: String(entry.initiatorType),
      }));
    });

    logger.debug(`Found ${resources.length} resources`);
    return resources;
  }
}

