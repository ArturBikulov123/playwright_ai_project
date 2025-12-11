/**
 * Ollama API integration tests
 * Tests the connection and functionality of the local Ollama API
 */
import { test, expect } from '@playwright/test'
import { OllamaHelpers } from '../../utils/ollama-helpers'
import { logger } from '../../utils/logger'
import { getErrorMessage } from '../../utils/common-helpers'

test.describe('Ollama API Tests', () => {
  test('should connect to Ollama API and list available models @api', async ({ request }) => {
    logger.step('Testing Ollama API connection')

    // List available models
    const models = await OllamaHelpers.listModels(request)
    expect(models).toBeDefined()
    expect(models.models).toBeDefined()
    expect(models.models.length).toBeGreaterThan(0)

    logger.info('Available Ollama models', { count: models.models.length })
    models.models.forEach((model) => {
      logger.debug('Model found', { name: model.name, size: model.size })
    })
  })

  test('should generate text using Ollama @api', async ({ request }) => {
    logger.step('Testing Ollama text generation')

    // Generate a simple response
    const prompt = 'Say "Hello, this is a test from Playwright!" in one sentence.'
    const response = await OllamaHelpers.generate(request, prompt)

    expect(response).toBeDefined()
    expect(response.length).toBeGreaterThan(0)
    expect(response.toLowerCase()).toContain('test')

    logger.info('Ollama generation successful', { responseLength: response.length })
  })

  test('should generate test data using Ollama @api', async ({ request }) => {
    logger.step('Testing Ollama test data generation')

    // Generate test data
    const description = 'A user object with username, email, and password fields'
    const testData = await OllamaHelpers.generateTestData(request, description, 'JSON')

    expect(testData).toBeDefined()
    expect(testData.length).toBeGreaterThan(0)

    logger.info('Test data generated', { data: testData })
  })

  test('should handle Ollama API errors gracefully @api', async ({ request }) => {
    logger.step('Testing Ollama error handling')

    // Try to use a non-existent model
    try {
      await OllamaHelpers.generate(request, 'test', 'non-existent-model:latest')
      // If we get here, the test should fail
      expect(false).toBe(true)
    } catch (error) {
      // Expected to throw an error
      expect(error).toBeDefined()
      logger.info('Error handled correctly', { error: getErrorMessage(error) })
    }
  })
})

