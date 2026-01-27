/**
 * Error Boundary Context Constructor
 *
 * Creates error boundary context for managing error state and recovery.
 * Follows prototype-based pattern.
 */
import { IErrorBoundaryContextInternal, IErrorBoundaryOptions } from './error-boundary.types';
/**
 * Error boundary context constructor (prototype-based)
 */
export declare const ErrorBoundaryContext: {
    new (options?: IErrorBoundaryOptions, parent?: IErrorBoundaryContextInternal | null): IErrorBoundaryContextInternal;
};
