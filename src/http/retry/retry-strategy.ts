/**
 * Retry strategy with exponential backoff
 */

import type { IHttpError, IRetryConfig } from '../http-client.types';

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param config - Retry configuration
 * @returns Promise that resolves with function result or rejects after all retries exhausted
 */
export async function retryRequest<T>(fn: () => Promise<T>, config: IRetryConfig): Promise<T> {
  let lastError: IHttpError | undefined;

  for (let attempt = 0; attempt <= config.attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as IHttpError;

      // Check if we should retry
      const shouldRetry = config.retryCondition
        ? config.retryCondition(lastError)
        : defaultRetryCondition(lastError);

      // Don't retry if condition not met or on last attempt
      if (!shouldRetry || attempt === config.attempts) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = calculateBackoff(config.delay, attempt, config.factor || 2, config.maxDelay);

      // Wait before next attempt
      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError!;
}

/**
 * Default retry condition
 * Retries on network errors and 5xx server errors
 */
function defaultRetryCondition(error: IHttpError): boolean {
  // Retry on network errors
  if (error.isNetworkError) {
    return true;
  }

  // Don't retry timeouts or cancelled requests
  if (error.isTimeout || error.isCancelled) {
    return false;
  }

  // Retry on 5xx server errors
  if (error.status !== undefined && error.status >= 500) {
    return true;
  }

  return false;
}

/**
 * Calculate exponential backoff delay
 *
 * @param baseDelay - Base delay in milliseconds
 * @param attempt - Current attempt number (0-based)
 * @param factor - Exponential factor (default 2)
 * @param maxDelay - Maximum delay cap
 * @returns Calculated delay in milliseconds
 */
function calculateBackoff(
  baseDelay: number,
  attempt: number,
  factor: number,
  maxDelay?: number
): number {
  // Calculate: baseDelay * (factor ^ attempt)
  const delay = baseDelay * Math.pow(factor, attempt);

  // Add jitter (randomness) to avoid thundering herd
  const jitter = delay * 0.1 * Math.random();
  const delayWithJitter = delay + jitter;

  // Apply max delay cap if specified
  return maxDelay ? Math.min(delayWithJitter, maxDelay) : delayWithJitter;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
