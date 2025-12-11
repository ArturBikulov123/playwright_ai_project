import { APIRequestContext, APIResponse } from '@playwright/test'
import { envConfig } from '../config/env.config'
import { logger } from './logger'
import { getErrorMessage, handleApiResponseError } from './common-helpers'

/**
 * Ollama API helper utilities
 * Provides methods to interact with local Ollama API for AI-powered testing features
 */
export interface OllamaGenerateRequest {
  model: string
  prompt: string
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    num_predict?: number
  }
}

export interface OllamaGenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface OllamaListModelsResponse {
  models: Array<{
    name: string
    model: string
    modified_at: string
    size: number
    digest: string
    details?: {
      parent_model?: string
      format?: string
      family?: string
      families?: string[]
      parameter_size?: string
      quantization_level?: string
    }
  }>
}

export class OllamaHelpers {
  private static readonly baseUrl = envConfig.ollamaApiUrl
  private static readonly defaultModel = envConfig.ollamaModel

  /**
   * Generate text using Ollama API
   * @param request - Playwright API request context
   * @param prompt - The prompt to send to the model
   * @param model - Model name (defaults to configured model)
   * @param options - Additional generation options
   * @returns Generated text response
   */
  static async generate(
    request: APIRequestContext,
    prompt: string,
    model: string = this.defaultModel,
    options?: OllamaGenerateRequest['options']
  ): Promise<string> {
    try {
      const url = `${this.baseUrl}/api/generate`
      const payload: OllamaGenerateRequest = {
        model,
        prompt,
        stream: false,
        options,
      }

      logger.info('Ollama generate request', { model, prompt: prompt.substring(0, 100) + '...' })

      const response = await request.post(url, {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      await handleApiResponseError(response, 'Ollama API')

      const data = (await response.json()) as OllamaGenerateResponse
      logger.debug('Ollama response received', { 
        model: data.model, 
        done: data.done,
        responseLength: data.response?.length 
      })

      return data.response || ''
    } catch (error) {
      logger.error('Ollama generate failed', { error: getErrorMessage(error) })
      throw error
    }
  }

  /**
   * List available models from Ollama
   * @param request - Playwright API request context
   * @returns List of available models
   */
  static async listModels(request: APIRequestContext): Promise<OllamaListModelsResponse> {
    try {
      const url = `${this.baseUrl}/api/tags`
      logger.info('Fetching Ollama models')

      const response = await request.get(url)

      await handleApiResponseError(response, 'Ollama API')

      const data = (await response.json()) as OllamaListModelsResponse
      logger.info('Ollama models fetched', { count: data.models?.length || 0 })
      return data
    } catch (error) {
      logger.error('Ollama listModels failed', { error: getErrorMessage(error) })
      throw error
    }
  }

  /**
   * Check if Ollama API is available
   * @param request - Playwright API request context
   * @returns True if Ollama is available, false otherwise
   */
  static async isAvailable(request: APIRequestContext): Promise<boolean> {
    try {
      await this.listModels(request)
      return true
    } catch (error) {
      logger.warn('Ollama API not available', { error: getErrorMessage(error) })
      return false
    }
  }

  /**
   * Generate test data using AI
   * @param request - Playwright API request context
   * @param description - Description of the test data needed
   * @param format - Expected format (e.g., 'JSON', 'CSV')
   * @returns Generated test data
   */
  static async generateTestData(
    request: APIRequestContext,
    description: string,
    format: 'JSON' | 'TEXT' = 'JSON'
  ): Promise<string> {
    const prompt = `Generate test data for: ${description}. 
Please provide the data in ${format} format. 
Be concise and only return the data without additional explanation.`

    return await this.generate(request, prompt)
  }

  /**
   * Analyze test results using AI
   * @param request - Playwright API request context
   * @param testResults - Test results to analyze
   * @returns Analysis of test results
   */
  static async analyzeTestResults(
    request: APIRequestContext,
    testResults: string
  ): Promise<string> {
    const prompt = `Analyze the following test results and provide insights:
${testResults}

Provide a brief analysis focusing on:
1. Overall test status
2. Key issues or failures
3. Recommendations for improvement`

    return await this.generate(request, prompt)
  }
}
