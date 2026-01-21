/**
 * Error Boundary Propagate Method
 * 
 * Re-throws error to parent boundary.
 */

import { IErrorBoundaryContextInternal } from '../error-boundary.types'

export const propagate = function(this: IErrorBoundaryContextInternal): void {
    if (!this._errorInfo) {
        return;
    }
    
    if (this._parent) {
        // Propagate to parent boundary
        this._parent.catchError(
            this._errorInfo.error,
            this._errorInfo.componentName,
            this._errorInfo.context
        );
    } else {
        // No parent - re-throw globally
        throw this._errorInfo.error;
    }
};
