/**
 * Waiting Component
 *
 * Suspense-like wrapper that shows fallback UI while resources load.
 * Automatically switches to children when loading completes.
 *
 * Usage:
 * ```typescript
 * Waiting({
 *   default: Loading(),
 *   children: Content()
 * })
 * ```
 */
import { IWaitingProps } from './waiting.types';
/**
 * Creates a Waiting component that conditionally renders loading fallback
 *
 * @param props - Waiting props with default and children
 * @returns Container element managing loading/content states
 */
export declare function Waiting(props: IWaitingProps): HTMLElement;
/**
 * Utility to transition Waiting container from loading to content
 *
 * @param container - Waiting container element
 */
export declare function resolveWaiting(container: HTMLElement): void;
/**
 * Utility to transition Waiting container back to loading state
 *
 * @param container - Waiting container element
 */
export declare function suspendWaiting(container: HTMLElement): void;
