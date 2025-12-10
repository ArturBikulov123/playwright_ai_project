import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { logger } from './logger';

/**
 * File operation utilities for test data management
 * Provides JSON reading/writing and directory management
 */

/**
 * Read JSON file and parse it
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object
 * @throws Error if file doesn't exist or is invalid JSON
 */
export function readJsonFile<T = unknown>(filePath: string): T {
  try {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const content = readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content) as T;
    logger.debug(`Read JSON file: ${filePath}`);
    return parsed;
  } catch (error) {
    logger.error(`Failed to read JSON file: ${filePath}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Write object to JSON file
 * @param filePath - Path to write the JSON file
 * @param data - Data object to write
 * @param pretty - Whether to format JSON with indentation (default: true)
 * @throws Error if write fails
 */
export function writeJsonFile<T = unknown>(
  filePath: string,
  data: T,
  pretty: boolean = true
): void {
  try {
    // Ensure directory exists
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      logger.debug(`Created directory: ${dir}`);
    }

    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    writeFileSync(filePath, content, 'utf-8');
    logger.debug(`Wrote JSON file: ${filePath}`);
  } catch (error) {
    logger.error(`Failed to write JSON file: ${filePath}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Check if file exists
 * @param filePath - Path to check
 * @returns True if file exists, false otherwise
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Ensure directory exists, create if it doesn't
 * @param dirPath - Directory path
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    logger.debug(`Created directory: ${dirPath}`);
  }
}

/**
 * Get absolute path from relative path
 * @param relativePath - Relative path
 * @param basePath - Base path (default: process.cwd())
 * @returns Absolute path
 */
export function getAbsolutePath(relativePath: string, basePath: string = process.cwd()): string {
  return join(basePath, relativePath);
}

