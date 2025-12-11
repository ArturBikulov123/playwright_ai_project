import { config } from 'dotenv'
import { logger } from '../utils/logger'
import { validateSecureUrl } from '../utils/common-helpers'

/**
 * Environment configuration loader
 * Loads environment variables from .env file and provides typed access
 */

// Load environment variables from .env file
const configResult = config({ errorOnMissingFile: false })
if (configResult?.error && configResult.error.code !== 'ENOENT') {
  // Only throw if it's not a "file not found" error
  throw configResult.error
}

export interface EnvConfig {
  baseUrl: string
  timeout: number
  expectTimeout: number
  workers: number | undefined
  retries: number
  ci: boolean
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  screenshotMode: 'off' | 'on' | 'only-on-failure'
  videoMode: 'off' | 'on' | 'on-first-retry' | 'retain-on-failure'
  traceMode: 'off' | 'on' | 'on-first-retry'
  ollamaApiUrl: string
  ollamaModel: string
}


function getEnv(key: string, defaultValue: string): string {
  const value = process.env[key] ?? defaultValue
  // Validate HTTPS for URL environment variables
  if (key.includes('URL')) {
    return validateSecureUrl(value, key)
  }
  return value
}

function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key]
  if (value === undefined) {
    return defaultValue
  }
  return value.toLowerCase() === 'true'
}

function getUndefinedOrNumberEnv(key: string): number | undefined {
  const value = process.env[key]
  if (value === undefined || value === 'undefined') {
    return undefined
  }
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? undefined : parsed
}

function getNumberEnvWithWarning(key: string, defaultValue: number): number {
  const value = process.env[key]
  if (value === undefined) {
    return defaultValue
  }
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    logger.warn(`Invalid numeric value "${value}" for ${key}, using default ${defaultValue}`)
    return defaultValue
  }
  return parsed
}

function getEnumEnv<T extends string>(
  key: string,
  defaultValue: T,
  validValues: readonly T[]
): T {
  const value = getEnv(key, defaultValue)
  if (!validValues.includes(value as T)) {
    logger.warn(
      `Invalid value "${value}" for ${key}. Valid values: ${validValues.join(', ')}. Using default "${defaultValue}"`
    )
    return defaultValue
  }
  return value as T
}

export const envConfig: EnvConfig = {
  baseUrl: getEnv('BASE_URL', 'https://www.saucedemo.com'),
  timeout: getNumberEnvWithWarning('TIMEOUT', 30000),
  expectTimeout: getNumberEnvWithWarning('EXPECT_TIMEOUT', 10000),
  workers: getUndefinedOrNumberEnv('WORKERS'),
  retries: getNumberEnvWithWarning('RETRIES', process.env.CI ? 2 : 0),
  ci: getBooleanEnv('CI', !!process.env.CI),
  logLevel: getEnumEnv('LOG_LEVEL', 'INFO', ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const),
  screenshotMode: getEnumEnv('SCREENSHOT_MODE', 'only-on-failure', [
    'off',
    'on',
    'only-on-failure',
  ] as const),
  videoMode: getEnumEnv('VIDEO_MODE', 'retain-on-failure', [
    'off',
    'on',
    'on-first-retry',
    'retain-on-failure',
  ] as const),
  traceMode: getEnumEnv('TRACE_MODE', 'on-first-retry', ['off', 'on', 'on-first-retry'] as const),
  ollamaApiUrl: getEnv('OLLAMA_API_URL', 'http://localhost:11434'),
  ollamaModel: getEnv('OLLAMA_MODEL', 'llama3.1:8b'),
}

// Set logger level based on environment
logger.setLogLevel(envConfig.logLevel)

// SECURITY: Sanitize envConfig before logging to prevent exposing sensitive values
// Only log non-sensitive configuration values
const sanitizedConfig = {
  baseUrl: envConfig.baseUrl.replace(/\/\/[^@]+@/, '//***:***@'), // Mask credentials in URLs
  timeout: envConfig.timeout,
  expectTimeout: envConfig.expectTimeout,
  workers: envConfig.workers,
  retries: envConfig.retries,
  ci: envConfig.ci,
  logLevel: envConfig.logLevel,
  screenshotMode: envConfig.screenshotMode,
  videoMode: envConfig.videoMode,
  traceMode: envConfig.traceMode,
  ollamaApiUrl: envConfig.ollamaApiUrl,
  ollamaModel: envConfig.ollamaModel,
}

logger.info('Environment configuration loaded', sanitizedConfig)

