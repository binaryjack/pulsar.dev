/**
 * Error Boundary System - Public Exports
 * 
 * Context-based error catching with Tryer/Catcher components.
 */

// Error boundary context exports
export { createErrorBoundaryContext } from './create-error-boundary-context'
export { ErrorBoundaryContext } from './error-boundary-context'
export { catchError } from './prototype/catch-error'
export { propagate } from './prototype/propagate'
export { reset } from './prototype/reset'

// Context manager exports
export {
    clearErrorBoundaryStack, getActiveErrorBoundary, getErrorBoundaryStack, setActiveErrorBoundary
} from './error-boundary-context-manager'

// Component exports
export { Catcher, updateCatcher } from './catcher'
export { cleanupTryer, resetTryer, Tryer } from './tryer'

// Type exports
export type {
    ErrorBoundaryState, ICatcherProps, IErrorBoundaryContext,
    IErrorBoundaryContextInternal, IErrorBoundaryOptions, IErrorInfo, ITryerProps
} from './error-boundary.types'

