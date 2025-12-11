import { test, expect } from '@playwright/test'
import { ApiHelpers } from '../../utils/api-helpers'
import { logger } from '../../utils/logger'

/**
 * Example API test suite
 * Demonstrates API testing capabilities with Playwright
 * Note: These are example tests. SauceDemo doesn't have a public API,
 * so some tests are kept as examples for API testing patterns.
 */
test.describe('API Tests', () => {
  test('should handle API errors gracefully @api @regression', async ({ request }) => {
    logger.step('API Error Handling')

    // Example: Test error handling - this endpoint doesn't exist, so we expect 404 or 405
    const response = await ApiHelpers.get(request, '/api/nonexistent')
    const status = response.status()
    // Accept either 404 (Not Found) or 405 (Method Not Allowed) as valid error responses
    expect([404, 405]).toContain(status)
  })
})

