/**
 * Error Boundary Context Constructor
 * 
 * Creates error boundary context for managing error state and recovery.
 * Follows prototype-based pattern.
 */

import {
    ErrorBoundaryState,
    IErrorBoundaryContextInternal,
    IErrorBoundaryOptions
} from './error-boundary.types'

/**
 * Error boundary context constructor (prototype-based)
 */
export const ErrorBoundaryContext = function(
    this: IErrorBoundaryContextInternal,
    options: IErrorBoundaryOptions = {},
    parent: IErrorBoundaryContextInternal | null = null
) {
    // Store options with defaults
    Object.defineProperty(this, 'options', {
        value: {
            fallback: options.fallback ?? null,
            onError: options.onError ?? (() => {}),
            onReset: options.onReset ?? (() => {}),
            logErrors: options.logErrors ?? true,
            propagate: options.propagate ?? false
        },
        writable: false,
        enumerable: false,
        configurable: false
    });
    
    // Store parent boundary
    Object.defineProperty(this, '_parent', {
        value: parent,
        writable: false,
        enumerable: false,
        configurable: false
    });
    
    // Initialize state
    Object.defineProperty(this, '_state', {
        value: 'idle' as ErrorBoundaryState,
        writable: true,
        enumerable: false,
        configurable: false
    });
    
    Object.defineProperty(this, '_errorInfo', {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false
    });
    
    Object.defineProperty(this, '_originalChildren', {
        value: [],
        writable: true,
        enumerable: false,
        configurable: false
    });
    
    Object.defineProperty(this, '_fallbackElement', {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false
    });
    
    // Define readonly getters
    Object.defineProperty(this, 'state', {
        get: function(this: IErrorBoundaryContextInternal) {
            return this._state;
        },
        enumerable: true,
        configurable: false
    });
    
    Object.defineProperty(this, 'errorInfo', {
        get: function(this: IErrorBoundaryContextInternal) {
            return this._errorInfo;
        },
        enumerable: true,
        configurable: false
    });
    
    Object.defineProperty(this, 'hasError', {
        get: function(this: IErrorBoundaryContextInternal) {
            return this._state === 'error';
        },
        enumerable: true,
        configurable: false
    });
    
} as unknown as { 
    new (
        options?: IErrorBoundaryOptions, 
        parent?: IErrorBoundaryContextInternal | null
    ): IErrorBoundaryContextInternal 
};
