import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger';

/**
 * API helper utilities for API testing
 * Provides common API request patterns and response handling
 */

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
}

export class ApiHelpers {
  /**
   * Perform GET request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   */
  static async get(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    logger.info(`GET ${url}`);
    const response = await request.get(url, {
      headers: options.headers,
      params: options.params,
      timeout: options.timeout,
    });
    logger.debug(`Response status: ${response.status()}`);
    return response;
  }

  /**
   * Perform POST request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   */
  static async post(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    logger.info(`POST ${url}`);
    const response = await request.post(url, {
      headers: options.headers,
      data: options.data,
      timeout: options.timeout,
    });
    logger.debug(`Response status: ${response.status()}`);
    return response;
  }

  /**
   * Perform PUT request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   */
  static async put(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    logger.info(`PUT ${url}`);
    const response = await request.put(url, {
      headers: options.headers,
      data: options.data,
      timeout: options.timeout,
    });
    logger.debug(`Response status: ${response.status()}`);
    return response;
  }

  /**
   * Perform DELETE request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   */
  static async delete(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    logger.info(`DELETE ${url}`);
    const response = await request.delete(url, {
      headers: options.headers,
      timeout: options.timeout,
    });
    logger.debug(`Response status: ${response.status()}`);
    return response;
  }

  /**
   * Assert response status code
   * @param response - API response
   * @param expectedStatus - Expected status code
   */
  static async assertStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();
    if (actualStatus !== expectedStatus) {
      const body = await response.text().catch(() => 'Unable to read response body');
      throw new Error(
        `Expected status ${expectedStatus} but got ${actualStatus}. Response: ${body}`
      );
    }
    logger.debug(`Status assertion passed: ${actualStatus}`);
  }

  /**
   * Parse JSON response
   * @param response - API response
   * @returns Parsed JSON object
   */
  static async parseJson<T>(response: APIResponse): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch (error) {
      logger.error('Failed to parse JSON response', error);
      throw error;
    }
  }
}

