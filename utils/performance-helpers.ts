import { Page } from '@playwright/test';
import { logger } from './logger';

/**
 * Performance monitoring utilities
 * Provides page load metrics and performance testing helpers
 */

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  timeToInteractive?: number;
  totalSize?: number;
  resourceCount?: number;
}

/**
 * Measure page load performance
 * @param page - Playwright page object
 * @returns Performance metrics object
 */
export async function measurePageLoadPerformance(page: Page): Promise<PerformanceMetrics> {
  logger.debug('Measuring page load performance');
  
  const navigationTiming = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: perfData.domInteractive - perfData.fetchStart,
    };
  });

  const paintTiming = await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find(
      (entry) => entry.name === 'first-contentful-paint'
    );
    return {
      firstPaint: firstPaint ? firstPaint.startTime : undefined,
      firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : undefined,
    };
  });

  const resourceTiming = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    return {
      totalSize,
      resourceCount: resources.length,
    };
  });

  const metrics: PerformanceMetrics = {
    loadTime: navigationTiming.loadTime,
    domContentLoaded: navigationTiming.domContentLoaded,
    firstPaint: paintTiming.firstPaint,
    firstContentfulPaint: paintTiming.firstContentfulPaint,
    timeToInteractive: navigationTiming.firstPaint,
    totalSize: resourceTiming.totalSize,
    resourceCount: resourceTiming.resourceCount,
  };

  logger.info('Page load performance metrics', metrics);
  return metrics;
}

/**
 * Assert performance metrics meet thresholds
 * @param metrics - Performance metrics to check
 * @param thresholds - Threshold values for each metric
 * @throws Error if any metric exceeds threshold
 */
export function assertPerformanceThresholds(
  metrics: PerformanceMetrics,
  thresholds: Partial<Record<keyof PerformanceMetrics, number>>
): void {
  logger.debug('Asserting performance thresholds', { metrics, thresholds });

  for (const [metric, threshold] of Object.entries(thresholds)) {
    const value = metrics[metric as keyof PerformanceMetrics];
    if (value !== undefined && value > threshold) {
      throw new Error(
        `Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`
      );
    }
  }

  logger.debug('All performance thresholds met');
}

/**
 * Monitor network requests during page load
 * @param page - Playwright page object
 * @returns Array of request information
 */
export function monitorNetworkRequests(page: Page): Array<{
  url: string;
  method: string;
  status: number;
  size: number;
  duration: number;
}> {
  logger.debug('Monitoring network requests');
  
  const requests: Array<{
    url: string;
    method: string;
    status: number;
    size: number;
    duration: number;
  }> = [];

  page.on('request', (request) => {
    const startTime = Date.now();
    void request.response().then((response) => {
      if (response) {
        const duration = Date.now() - startTime;
        requests.push({
          url: request.url(),
          method: request.method(),
          status: response.status(),
          size: response.headers()['content-length']
            ? parseInt(response.headers()['content-length'] || '0', 10)
            : 0,
          duration,
        });
      }
    });
  });

  return requests;
}

