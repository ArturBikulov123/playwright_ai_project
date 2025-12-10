import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logger } from './logger';

/**
 * File operation utilities for test data management
 * Handles reading/writing test data, screenshots, and other files
 */

export class FileHelpers {
  /**
   * Read JSON file and parse it
   * @param filePath - Path to the JSON file
   * @returns Parsed JSON object
   */
  static readJson<T>(filePath: string): T {
    try {
      logger.debug(`Reading JSON file: ${filePath}`);
      const content = readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      logger.error(`Failed to read JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Write JSON object to file
   * @param filePath - Path to write the JSON file
   * @param data - Data to write
   * @param pretty - Whether to format JSON with indentation
   */
  static writeJson(filePath: string, data: unknown, pretty: boolean = true): void {
    try {
      logger.debug(`Writing JSON file: ${filePath}`);
      const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
      logger.error(`Failed to write JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   * @param dirPath - Path to the directory
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      logger.debug(`Creating directory: ${dirPath}`);
      mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Get test data file path
   * @param filename - Name of the test data file
   * @returns Full path to the test data file
   */
  static getTestDataPath(filename: string): string {
    return join(process.cwd(), 'data', filename);
  }

  /**
   * Get screenshot file path
   * @param filename - Name of the screenshot file
   * @returns Full path to the screenshot file
   */
  static getScreenshotPath(filename: string): string {
    const screenshotsDir = join(process.cwd(), 'test-results', 'screenshots');
    this.ensureDirectoryExists(screenshotsDir);
    return join(screenshotsDir, filename);
  }

  /**
   * Check if file exists
   * @param filePath - Path to check
   * @returns True if file exists, false otherwise
   */
  static fileExists(filePath: string): boolean {
    return existsSync(filePath);
  }
}

