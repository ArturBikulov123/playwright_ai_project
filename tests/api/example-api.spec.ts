import { test, expect } from '@playwright/test';
import { ApiHelpers } from '../../utils/api-helpers';
import { logger } from '../../utils/logger';

/**
 * Example API test suite
 * Demonstrates API testing capabilities with Playwright
 */
test.describe('API Tests', () => {
  test('should verify API health check', async ({ request }) => {
    logger.step('API Health Check');
    
    // Example: Health check endpoint
    const response = await ApiHelpers.get(request, '/health');
    await ApiHelpers.assertStatus(response, 200);
    
    const body = await ApiHelpers.parseJson<{ status: string }>(response);
    expect(body.status).toBe('ok');
  });

  test('should handle API errors gracefully', async ({ request }) => {
    logger.step('API Error Handling');
    
    // Example: Test error handling
    const response = await ApiHelpers.get(request, '/api/nonexistent');
    await ApiHelpers.assertStatus(response, 404);
    expect(response.status()).toBe(404);
  });

  test('should perform POST request with data', async ({ request }) => {
    logger.step('POST Request with Data');
    
    // Example: POST request
    const response = await ApiHelpers.post(request, '/api/users', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    await ApiHelpers.assertStatus(response, 201);
    const body = await ApiHelpers.parseJson(response);
    expect(body).toHaveProperty('id');
  });
});

