/**
 * Catcher Component
 *
 * Sub-component that renders caught errors with optional retry functionality.
 * Must be used inside a Tryer component.
 */
import { ICatcherProps } from './error-boundary.types';
/**
 * Creates a Catcher component that displays error information
 *
 * Must be used within a Tryer component to access error context.
 *
 * @param props - Catcher props with optional custom renderer
 * @returns Error display element
 *
 * @example
 * ```typescript
 * Tryer({
 *   children: [
 *     Catcher({ showRetry: true }),
 *     riskyComponent()
 *   ]
 * })
 * ```
 */
export declare function Catcher(props?: ICatcherProps): HTMLElement;
/**
 * Update Catcher to reflect current error state
 *
 * @param container - Catcher container element
 */
export declare function updateCatcher(container: HTMLElement): void;
