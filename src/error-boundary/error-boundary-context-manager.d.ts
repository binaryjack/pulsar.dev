/**
 * Error Boundary Context Manager
 *
 * Manages the active error boundary context stack for nested boundaries.
 */
import { IErrorBoundaryContext } from './error-boundary.types';
/**
 * Get the currently active error boundary
 *
 * @returns Current error boundary or null if none
 */
export declare function getActiveErrorBoundary(): IErrorBoundaryContext | null;
/**
 * Set the active error boundary
 *
 * @param boundary - Error boundary to set as active (null to pop)
 */
export declare function setActiveErrorBoundary(boundary: IErrorBoundaryContext | null): void;
/**
 * Clear all error boundaries from stack
 */
export declare function clearErrorBoundaryStack(): void;
/**
 * Get entire error boundary stack (for debugging)
 *
 * @returns Array of active error boundaries
 */
export declare function getErrorBoundaryStack(): IErrorBoundaryContext[];
