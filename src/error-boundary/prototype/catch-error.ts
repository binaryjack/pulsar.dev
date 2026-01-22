/**
 * Error Boundary Catch Error Method
 * 
 * Captures and handles errors within the boundary.
 */

import { DEV } from '../../dev/dev.types'
import { IErrorBoundaryContextInternal, IErrorInfo } from '../error-boundary.types'

export const catchError = function(
    this: IErrorBoundaryContextInternal,
    error: Error,
    componentName?: string,
    context?: Record<string, unknown>
): void {
    // Create error info
    const errorInfo: IErrorInfo = {
        error,
        componentName,
        timestamp: Date.now(),
        context
    };
    
    // Update state
    this._state = 'error';
    this._errorInfo = errorInfo;
    
    // Log error in development
    if (DEV && this.options.logErrors) {
        console.group('🔴 Error Boundary Caught Error');
        console.error('Error:', error);
        if (componentName) {
            console.log('Component:', componentName);
        }
        if (context) {
            console.log('Context:', context);
        }
        console.log('Timestamp:', new Date(errorInfo.timestamp).toISOString());
        console.groupEnd();
    }
    
    // Call onError callback
    if (this.options.onError) {
        this.options.onError(errorInfo);
    }
    
    // Propagate to parent if configured
    if (this.options.propagate && this._parent) {
        this._parent.catchError(error, componentName, context);
    }
};
