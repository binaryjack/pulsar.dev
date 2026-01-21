/**
 * Development mode utilities
 */

/**
 * Check if running in development mode
 */
export const DEV = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

/**
 * Warning message formatter
 */
export interface IDevWarning {
  message: string
  component?: string
  hint?: string
}

/**
 * Error with additional context
 */
export interface IDevError extends Error {
  component?: string
  hint?: string
}
