/**
 * Retry strategy with exponential backoff
 */
import type { IRetryConfig } from '../http-client.types';
/**
 * Retry a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param config - Retry configuration
 * @returns Promise that resolves with function result or rejects after all retries exhausted
 */
export declare function retryRequest<T>(fn: () => Promise<T>, config: IRetryConfig): Promise<T>;
