/**
 * Create Error Boundary Context Factory
 * 
 * Public API for creating error boundary contexts.
 */

import { ErrorBoundaryContext } from './error-boundary-context'
import { IErrorBoundaryContext, IErrorBoundaryContextInternal, IErrorBoundaryOptions } from './error-boundary.types'
import { catchError } from './prototype/catch-error'
import { propagate } from './prototype/propagate'
import { reset } from './prototype/reset'

// Attach prototype methods
ErrorBoundaryContext.prototype.catchError = catchError;
ErrorBoundaryContext.prototype.reset = reset;
ErrorBoundaryContext.prototype.propagate = propagate;

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
export function createErrorBoundaryContext(
    options: IErrorBoundaryOptions = {},
    parent: IErrorBoundaryContext | null = null
): IErrorBoundaryContext {
    // Create context instance
    const context = new ErrorBoundaryContext(
        options, 
        parent as IErrorBoundaryContextInternal | null
    ) as IErrorBoundaryContextInternal;
    
    // Bind methods
    context.catchError = catchError.bind(context);
    context.reset = reset.bind(context);
    context.propagate = propagate.bind(context);
    
    // Return as public interface
    return context as IErrorBoundaryContext;
}
