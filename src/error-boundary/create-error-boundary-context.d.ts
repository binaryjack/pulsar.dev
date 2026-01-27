/**
 * Create Error Boundary Context Factory
 *
 * Public API for creating error boundary contexts.
 */
import { IErrorBoundaryContext, IErrorBoundaryOptions } from './error-boundary.types';
/**
 * Creates a new error boundary context
 *
 * @param options - Error boundary configuration
 * @param parent - Parent error boundary (for nested boundaries)
 * @returns Error boundary context instance
 *
 * @example
 * ```typescript
 * const errorBoundary = createErrorBoundaryContext({
 *   fallback: (errorInfo) => renderError(errorInfo),
 *   onError: (errorInfo) => logToService(errorInfo)
 * });
 *
 * try {
 *   dangerousOperation();
 * } catch (error) {
 *   errorBoundary.catchError(error as Error);
 * }
 * ```
 */
export declare function createErrorBoundaryContext(options?: IErrorBoundaryOptions, parent?: IErrorBoundaryContext | null): IErrorBoundaryContext;
