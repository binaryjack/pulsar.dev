/**
 * Development mode utilities
 */

import { isDev } from '../env'

/**
 * Check if running in development mode
 * @deprecated Use isDev() from 'pulsar/env' instead
 */
export const DEV = isDev()

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
