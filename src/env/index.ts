/**
 * Pulsar Environment Module
 *
 * Unified environment variable access that works in both browser and Node.js
 * Provides type-safe, validated access to environment variables
 *
 * @example
 * ```typescript
 * import { env, isDev } from '@pulsar-framework/pulsar.dev/env';
 *
 * if (isDev()) {
 *   console.log('Development mode');
 * }
 *
 * const apiUrl = env.get('VITE_API_URL', 'http://localhost:3000');
 * ```
 */

/**
 * Pulsar environment interface
 */
export interface PulsarEnv {
  /** Current mode: development, production, or test */
  readonly MODE: 'development' | 'production' | 'test';
  /** True if running in development mode */
  readonly DEV: boolean;
  /** True if running in production mode */
  readonly PROD: boolean;
  /** True if running in server-side rendering context */
  readonly SSR: boolean;
  /** Base URL for the application */
  readonly BASE_URL: string;

  /**
   * Get an environment variable with optional default value
   * @param key - Environment variable name
   * @param defaultValue - Default value if not found
   * @returns Variable value or default
   */
  get<T = string>(key: string, defaultValue?: T): T;

  /**
   * Check if an environment variable exists
   * @param key - Environment variable name
   * @returns True if variable exists
   */
  has(key: string): boolean;

  /**
   * Get a required environment variable (throws if missing)
   * @param key - Environment variable name
   * @returns Variable value
   * @throws Error if variable is not defined
   */
  getRequired(key: string): string;

  /**
   * Get boolean environment variable
   * @param key - Environment variable name
   * @param defaultValue - Default value if not found
   * @returns Boolean value
   */
  getBoolean(key: string, defaultValue?: boolean): boolean;

  /**
   * Get number environment variable
   * @param key - Environment variable name
   * @param defaultValue - Default value if not found
   * @returns Number value
   */
  getNumber(key: string, defaultValue?: number): number;
}

/**
 * Access import.meta.env or process.env safely
 */
function getEnvValue(key: string): string | undefined {
  // Try import.meta.env first (Vite, browser)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }

  // Fall back to process.env (Node.js, SSR)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  return undefined;
}

/**
 * Determine current mode (internal helper)
 */
function getModeInternal(): 'development' | 'production' | 'test' {
  const mode = getEnvValue('MODE') || getEnvValue('NODE_ENV') || 'development';

  if (mode === 'test' || mode === 'testing') return 'test';
  if (mode === 'production' || mode === 'prod') return 'production';
  return 'development';
}

/**
 * Unified environment variable access
 */
export const env: PulsarEnv = {
  get MODE() {
    return getModeInternal();
  },

  get DEV() {
    return this.MODE === 'development';
  },

  get PROD() {
    return this.MODE === 'production';
  },

  get SSR() {
    const ssrValue = getEnvValue('SSR');
    if (ssrValue !== undefined) {
      return ssrValue === 'true' || ssrValue === '1';
    }

    // Check if we're in a browser environment
    return typeof window === 'undefined';
  },

  get BASE_URL() {
    return getEnvValue('BASE_URL') || '/';
  },

  get<T = string>(key: string, defaultValue?: T): T {
    const value = getEnvValue(key);

    if (value === undefined) {
      return defaultValue as T;
    }

    return value as unknown as T;
  },

  has(key: string): boolean {
    return getEnvValue(key) !== undefined;
  },

  getRequired(key: string): string {
    const value = getEnvValue(key);

    if (value === undefined || value === '') {
      throw new Error(
        `[Pulsar Env] Required environment variable "${key}" is not defined. ` +
          `Please set it in your .env file or environment.`
      );
    }

    return value;
  },

  getBoolean(key: string, defaultValue = false): boolean {
    const value = getEnvValue(key);

    if (value === undefined) {
      return defaultValue;
    }

    // Handle various truthy values
    const normalized = value.toLowerCase().trim();
    return (
      normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on'
    );
  },

  getNumber(key: string, defaultValue = 0): number {
    const value = getEnvValue(key);

    if (value === undefined) {
      return defaultValue;
    }

    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  },
};

/**
 * Check if running in development mode
 * @returns True if in development mode
 */
export function isDev(): boolean {
  return env.DEV;
}

/**
 * Check if running in production mode
 * @returns True if in production mode
 */
export function isProd(): boolean {
  return env.PROD;
}

/**
 * Check if running in test mode
 * @returns True if in test mode
 */
export function isTest(): boolean {
  return env.MODE === 'test';
}

/**
 * Check if running in server-side rendering context
 * @returns True if in SSR context
 */
export function isSSR(): boolean {
  return env.SSR;
}

/**
 * Get environment mode
 * @returns Current mode
 */
export function getMode(): 'development' | 'production' | 'test' {
  return env.MODE;
}

// Export validation schema utilities
export type {
  IEnvRule,
  IEnvSchema,
  IEnvValidationError,
  INumberRuleOptions,
  IStringRuleOptions,
} from './schema';

export {
  BooleanRule,
  EnvSchema,
  NumberRule,
  OneOfRule,
  StringRule,
  boolean,
  createEnvSchema,
  number,
  oneOf,
  optional,
  required,
  string,
} from './schema';
