import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger';

/**
 * API helper utilities for API testing
 * Provides common API request patterns and response handling
 */

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  data?: unknown;
}

export class ApiHelpers {
  /**
   * Perform GET request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   * @throws Error if request fails
   */
  static async get(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    try {
      logger.info(`GET ${url}`, options.params ? { params: options.params } : {});
      const response = await request.get(url, {
        headers: options.headers,
        params: options.params,
        timeout: options.timeout,
      });
      logger.debug(`Response status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`GET request failed for ${url}`, { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Perform POST request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options (data will be sent as JSON body)
   * @returns API response
   * @throws Error if request fails
   */
  static async post(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    try {
      logger.info(`POST ${url}`, options.data ? { data: options.data } : {});
      const response = await request.post(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        data: options.data,
        params: options.params,
        timeout: options.timeout,
      });
      logger.debug(`Response status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`POST request failed for ${url}`, { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Perform PUT request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options (data will be sent as JSON body)
   * @returns API response
   * @throws Error if request fails
   */
  static async put(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    try {
      logger.info(`PUT ${url}`, options.data ? { data: options.data } : {});
      const response = await request.put(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        data: options.data,
        params: options.params,
        timeout: options.timeout,
      });
      logger.debug(`Response status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`PUT request failed for ${url}`, { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Perform DELETE request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   * @throws Error if request fails
   */
  static async delete(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    try {
      logger.info(`DELETE ${url}`);
      const response = await request.delete(url, {
        headers: options.headers,
        params: options.params,
        timeout: options.timeout,
      });
      logger.debug(`Response status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`DELETE request failed for ${url}`, { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Validate response status
   * @param response - API response
   * @param expectedStatus - Expected status code(s)
   * @throws Error if status doesn't match
   */
  static validateStatus(response: APIResponse, expectedStatus: number | number[]): void {
    const status = response.status();
    const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    if (!expectedStatuses.includes(status)) {
      throw new Error(
        `Expected status ${expectedStatuses.join(' or ')}, but got ${status}. URL: ${response.url()}`
      );
    }
  }
}

