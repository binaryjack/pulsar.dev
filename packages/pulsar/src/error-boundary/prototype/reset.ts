/**
 * Error Boundary Reset Method
 * 
 * Resets error state and attempts recovery.
 */

import { IErrorBoundaryContextInternal } from '../error-boundary.types'

export const reset = function(this: IErrorBoundaryContextInternal): void {
    // Clear error state
    this._state = 'idle';
    this._errorInfo = null;
    this._fallbackElement = null;
    
    // Call onReset callback
    if (this.options.onReset) {
        this.options.onReset();
    }
};
