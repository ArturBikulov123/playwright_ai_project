import { config } from 'dotenv';
import { logger } from '../utils/logger';

/**
 * Environment configuration loader
 * Loads environment variables from .env file and provides typed access
 */

// Load environment variables from .env file
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const configResult = config();
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (configResult?.error) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  throw configResult.error;
}

export interface EnvConfig {
  baseUrl: string;
  apiBaseUrl: string;
  headless: boolean;
  slowMo: number;
  timeout: number;
  expectTimeout: number;
  browser: 'chromium' | 'firefox' | 'webkit';
  workers: number | undefined;
  retries: number;
  reporter: string;
  ci: boolean;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  screenshotMode: 'off' | 'on' | 'only-on-failure';
  videoMode: 'off' | 'on' | 'on-first-retry' | 'retain-on-failure';
  traceMode: 'off' | 'on' | 'on-first-retry';
}

function getEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
}

function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function getUndefinedOrNumberEnv(key: string): number | undefined {
  const value = process.env[key];
  if (value === undefined || value === 'undefined') {
    return undefined;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

export const envConfig: EnvConfig = {
  baseUrl: getEnv('BASE_URL', 'https://www.saucedemo.com'),
  apiBaseUrl: getEnv('API_BASE_URL', 'https://www.saucedemo.com/api'),
  headless: getBooleanEnv('HEADLESS', true),
  slowMo: getNumberEnv('SLOW_MO', 0),
  timeout: getNumberEnv('TIMEOUT', 30000),
  expectTimeout: getNumberEnv('EXPECT_TIMEOUT', 10000),
  browser: (getEnv('BROWSER', 'chromium') as 'chromium' | 'firefox' | 'webkit'),
  workers: getUndefinedOrNumberEnv('WORKERS'),
  retries: getNumberEnv('RETRIES', process.env.CI ? 2 : 0),
  reporter: getEnv('REPORTER', 'html'),
  ci: getBooleanEnv('CI', !!process.env.CI),
  logLevel: (getEnv('LOG_LEVEL', 'INFO') as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'),
  screenshotMode: (getEnv('SCREENSHOT_MODE', 'only-on-failure') as 'off' | 'on' | 'only-on-failure'),
  videoMode: (getEnv('VIDEO_MODE', 'retain-on-failure') as 'off' | 'on' | 'on-first-retry' | 'retain-on-failure'),
  traceMode: (getEnv('TRACE_MODE', 'on-first-retry') as 'off' | 'on' | 'on-first-retry'),
};

// Set logger level based on environment
logger.setLogLevel(envConfig.logLevel);

logger.info('Environment configuration loaded', envConfig);

