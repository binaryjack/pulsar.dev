/**
 * Element metadata interface
 * Stores reactive metadata for an element (stored in WeakMap)
 */
import type { ISignal } from '../../reactivity/signal/signal.types';
export interface IElementMetadata {
    /**
     * Set of effect cleanup functions attached to this element
     */
    effects: Set<() => void>;
    /**
     * Set of signals this element depends on
     */
    signals: Set<ISignal<unknown>>;
    /**
     * Cleanup function to call when element is unregistered
     */
    cleanup?: () => void;
    /**
     * Render count for debugging (DEV mode only)
     * Tracks how many times an element has been re-rendered
     */
    renderCount?: number;
}
