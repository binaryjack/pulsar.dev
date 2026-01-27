/**
 * Error Boundary Catch Error Method
 *
 * Captures and handles errors within the boundary.
 */
import { IErrorBoundaryContextInternal } from '../error-boundary.types';
export declare const catchError: (this: IErrorBoundaryContextInternal, error: Error, componentName?: string, context?: Record<string, unknown>) => void;
