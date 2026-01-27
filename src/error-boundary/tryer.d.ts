/**
 * Tryer Component
 *
 * Error boundary wrapper that catches errors in child components
 * and displays fallback UI. Named "Tryer" following user's naming convention.
 */
import { ITryerProps } from './error-boundary.types';
/**
 * Creates a Tryer (error boundary) component that catches errors in children
 *
 * @param props - Tryer props with children and options
 * @returns Container element with error boundary protection
 *
 * @example
 * ```typescript
 * Tryer({
 *   children: riskyComponent(),
 *   options: {
 *     fallback: (errorInfo) => div({ textContent: `Error: ${errorInfo.error.message}` }),
 *     onError: (errorInfo) => logError(errorInfo)
 *   }
 * })
 * ```
 */
export declare function Tryer(props: ITryerProps): HTMLElement;
/**
 * Cleanup error boundary
 *
 * @param container - Tryer container element
 */
export declare function cleanupTryer(container: HTMLElement): void;
/**
 * Reset error boundary to retry rendering
 *
 * @param container - Tryer container element
 */
export declare function resetTryer(container: HTMLElement): void;
