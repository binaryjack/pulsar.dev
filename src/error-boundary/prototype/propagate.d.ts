/**
 * Error Boundary Propagate Method
 *
 * Re-throws error to parent boundary.
 */
import { IErrorBoundaryContextInternal } from '../error-boundary.types';
export declare const propagate: (this: IErrorBoundaryContextInternal) => void;
