/**
 * Error Boundary Context Manager
 * 
 * Manages the active error boundary context stack for nested boundaries.
 */

import { IErrorBoundaryContext } from './error-boundary.types'

// Global stack of active error boundaries
let activeErrorBoundaryStack: IErrorBoundaryContext[] = [];

/**
 * Get the currently active error boundary
 * 
 * @returns Current error boundary or null if none
 */
export function getActiveErrorBoundary(): IErrorBoundaryContext | null {
    return activeErrorBoundaryStack.length > 0
        ? activeErrorBoundaryStack[activeErrorBoundaryStack.length - 1]
        : null;
}

/**
 * Set the active error boundary
 * 
 * @param boundary - Error boundary to set as active (null to pop)
 */
export function setActiveErrorBoundary(boundary: IErrorBoundaryContext | null): void {
    if (boundary === null) {
        // Pop current boundary
        if (activeErrorBoundaryStack.length > 0) {
            activeErrorBoundaryStack.pop();
        }
    } else {
        // Push new boundary
        activeErrorBoundaryStack.push(boundary);
    }
}

/**
 * Clear all error boundaries from stack
 */
export function clearErrorBoundaryStack(): void {
    activeErrorBoundaryStack = [];
}

/**
 * Get entire error boundary stack (for debugging)
 * 
 * @returns Array of active error boundaries
 */
export function getErrorBoundaryStack(): IErrorBoundaryContext[] {
    return [...activeErrorBoundaryStack];
}
