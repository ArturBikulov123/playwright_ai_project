import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { dirname, resolve, normalize } from 'path';
import { logger } from './logger';

/**
 * File operation utilities for test data management
 * Provides JSON reading/writing and directory management
 * SECURITY: Includes path traversal protection and file size limits
 */

// Maximum file size (10MB) to prevent DoS via large files
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate and normalize file path to prevent directory traversal
 * SECURITY: Prevents path traversal attacks (e.g., ../../../etc/passwd)
 * @param filePath - Path to validate
 * @param allowedBasePath - Base directory that file must be within (default: process.cwd())
 * @returns Normalized absolute path
 * @throws Error if path traversal detected or path is outside allowed base
 */
function validateAndNormalizePath(filePath: string, allowedBasePath: string = process.cwd()): string {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path: path must be a non-empty string');
  }

  // Normalize the path (resolves .., ., etc.)
  const normalizedPath = normalize(filePath);
  
  // Resolve to absolute path
  const absolutePath = resolve(allowedBasePath, normalizedPath);
  const absoluteBase = resolve(allowedBasePath);

  // Security check: ensure resolved path is within allowed base directory
  // Use path separator to ensure cross-platform compatibility
  const pathSep = process.platform === 'win32' ? '\\' : '/';
  if (!absolutePath.startsWith(absoluteBase + pathSep) && absolutePath !== absoluteBase) {
    throw new Error(`Path traversal detected: ${filePath} is outside allowed directory`);
  }

  return absolutePath;
}

/**
 * Validate file size to prevent DoS attacks
 * @param filePath - Path to check
 * @throws Error if file exceeds maximum size
 */
function validateFileSize(filePath: string): void {
  try {
    const stats = statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error(`File size ${stats.size} exceeds maximum allowed size ${MAX_FILE_SIZE} bytes`);
    }
  } catch (error) {
    // If file doesn't exist or can't be stat'd, let the read operation handle it
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Read JSON file and parse it
 * SECURITY: Protected against path traversal and large file DoS
 * @param filePath - Path to the JSON file
 * @param allowedBasePath - Optional base directory restriction
 * @returns Parsed JSON object
 * @throws Error if file doesn't exist, is invalid JSON, or security check fails
 */
export function readJsonFile<T = unknown>(filePath: string, allowedBasePath?: string): T {
  try {
    const validatedPath = validateAndNormalizePath(filePath, allowedBasePath);
    
    if (!existsSync(validatedPath)) {
      // Don't expose full path in error message for security
      throw new Error('File not found');
    }

    validateFileSize(validatedPath);
    const content = readFileSync(validatedPath, 'utf-8');
    const parsed = JSON.parse(content) as T;
    logger.debug('Read JSON file successfully');
    return parsed;
  } catch (error) {
    // Generic error message to avoid leaking file system structure
    const errorMessage = error instanceof Error && process.env.NODE_ENV !== 'development' 
      ? 'Failed to read JSON file' 
      : (error instanceof Error ? error.message : String(error));
    logger.error('Failed to read JSON file', {
      error: errorMessage,
    });
    throw new Error(errorMessage);
  }
}

/**
 * Write object to JSON file
 * SECURITY: Protected against path traversal and enforces file size limits
 * @param filePath - Path to write the JSON file
 * @param data - Data object to write
 * @param pretty - Whether to format JSON with indentation (default: true)
 * @param allowedBasePath - Optional base directory restriction
 * @throws Error if write fails or security check fails
 */
export function writeJsonFile<T = unknown>(
  filePath: string,
  data: T,
  pretty: boolean = true,
  allowedBasePath?: string
): void {
  try {
    const validatedPath = validateAndNormalizePath(filePath, allowedBasePath);
    
    // Ensure directory exists
    const dir = dirname(validatedPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      logger.debug('Created directory');
    }

    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    
    // Validate content size before writing
    const contentSize = Buffer.byteLength(content, 'utf-8');
    if (contentSize > MAX_FILE_SIZE) {
      throw new Error(`File content size ${contentSize} exceeds maximum allowed size ${MAX_FILE_SIZE} bytes`);
    }
    
    writeFileSync(validatedPath, content, 'utf-8');
    logger.debug('Wrote JSON file successfully');
  } catch (error) {
    // Generic error message to avoid leaking file system structure
    const errorMessage = error instanceof Error && process.env.NODE_ENV !== 'development'
      ? 'Failed to write JSON file'
      : (error instanceof Error ? error.message : String(error));
    logger.error('Failed to write JSON file', {
      error: errorMessage,
    });
    throw new Error(errorMessage);
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
 * SECURITY: Protected against path traversal
 * @param relativePath - Relative path
 * @param basePath - Base path (default: process.cwd())
 * @returns Absolute path (validated)
 */
export function getAbsolutePath(relativePath: string, basePath: string = process.cwd()): string {
  // Use validation function to prevent path traversal
  return validateAndNormalizePath(relativePath, basePath);
}

