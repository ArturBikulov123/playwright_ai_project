import { APIRequestContext } from '@playwright/test';
import { envConfig } from '../config/env.config';
import { logger } from './logger';
import { getErrorMessage, handleApiResponseError } from './common-helpers';

/**
 * Ollama API helper utilities
 * Provides methods to interact with local Ollama API for AI-powered testing features
 */
export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaListModelsResponse {
  models: Array<{
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
      parent_model?: string;
      format?: string;
      family?: string;
      families?: string[];
      parameter_size?: string;
      quantization_level?: string;
    };
  }>;
}

export class OllamaHelpers {
  private static readonly baseUrl = envConfig.ollamaApiUrl;
  private static readonly defaultModel = envConfig.ollamaModel;

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
      const url = `${this.baseUrl}/api/generate`;
      const payload: OllamaGenerateRequest = {
        model,
        prompt,
        stream: false,
        options,
      };

      logger.info('Ollama generate request', { model, prompt: `${prompt.substring(0, 100)}...` });

      const response = await request.post(url, {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await handleApiResponseError(response, 'Ollama API');

      const data = (await response.json()) as OllamaGenerateResponse;
      logger.debug('Ollama response received', {
        model: data.model,
        done: data.done,
        responseLength: data.response?.length,
      });

      return data.response || '';
    } catch (error) {
      logger.error('Ollama generate failed', { error: getErrorMessage(error) });
      throw error;
    }
  }

  /**
   * List available models from Ollama
   * @param request - Playwright API request context
   * @returns List of available models
   */
  static async listModels(request: APIRequestContext): Promise<OllamaListModelsResponse> {
    try {
      const url = `${this.baseUrl}/api/tags`;
      logger.info('Fetching Ollama models');

      const response = await request.get(url);

      await handleApiResponseError(response, 'Ollama API');

      const data = (await response.json()) as OllamaListModelsResponse;
      logger.info('Ollama models fetched', { count: data.models?.length || 0 });
      return data;
    } catch (error) {
      logger.error('Ollama listModels failed', { error: getErrorMessage(error) });
      throw error;
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
Be concise and only return the data without additional explanation.`;

    return this.generate(request, prompt);
  }

  /**
   * Verify if locators from a Page Object Model class match the actual HTML page
   * @param request - Playwright API request context
   * @param pomFileContent - The content of the Page Object Model class file
   * @param htmlContent - The HTML content of the page to verify against
   * @returns AI-generated verification result indicating if locators match the HTML
   */
  static async verifyPageLocators(
    request: APIRequestContext,
    pomFileContent: string,
    htmlContent: string
  ): Promise<string> {
    const prompt = `Verify if locators from this Playwright Page Object Model class: 

${pomFileContent}

match the HTML structure from this page:

${htmlContent}

Please analyze:
1. Do the CSS selectors, data-test attributes, and other locators in the POM class exist in the HTML?
2. Are there any locators in the POM that don't match any elements in the HTML?
3. Are there any potential issues or suggestions for improving the locators?
4. Provide a summary of the verification result.

Be concise and focus on actionable insights.`;

    logger.info('Verifying page locators using AI', {
      pomContentLength: pomFileContent.length,
      htmlContentLength: htmlContent.length,
    });

    return this.generate(request, prompt);
  }

  /**
   * Generate locators for page elements using AI
   * @param request - Playwright API request context
   * @param htmlContent - The HTML content of the page
   * @param elementDescriptions - Descriptions of elements to locate (e.g., "username input field", "login button")
   * @returns AI-generated locators as Playwright selectors
   */
  static async generatePageLocators(
    request: APIRequestContext,
    htmlContent: string,
    elementDescriptions: string[]
  ): Promise<string> {
    const descriptionsList = elementDescriptions
      .map((desc, index) => `${index + 1}. ${desc}`)
      .join('\n');

    const prompt = `Given the following HTML content, generate Playwright locators (CSS selectors, data-test attributes, or other reliable selectors) for these elements:

${descriptionsList}

HTML Content:
${htmlContent}

For each element, provide:
1. The recommended locator (CSS selector or attribute selector)
2. Brief explanation of why this locator is reliable
3. Alternative locator options if available

Format your response as a clear list with the element description, followed by the locator and explanation.

Be concise and focus on stable, maintainable locators.`;

    logger.info('Generating page locators using AI', {
      elementCount: elementDescriptions.length,
      htmlContentLength: htmlContent.length,
    });

    return this.generate(request, prompt);
  }
}
