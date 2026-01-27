/**
 * Async Utilities
 * Utilities for waiting and testing async behavior
 */
import type { IWaitForOptions } from './testing.types';
/**
 * Waits for a condition to be true
 */
export declare function waitFor(callback: () => boolean | void, options?: IWaitForOptions): Promise<void>;
/**
 * Waits for an element to appear in the DOM
 */
export declare function waitForElement(callback: () => HTMLElement | null, options?: IWaitForOptions): Promise<HTMLElement>;
/**
 * Waits for an element to disappear from the DOM
 */
export declare function waitForElementToBeRemoved(callback: () => HTMLElement | null, options?: IWaitForOptions): Promise<void>;
/**
 * Waits for a specific amount of time
 */
export declare function wait(ms: number): Promise<void>;
/**
 * Flushes all pending promises and timers
 */
export declare function flush(): Promise<void>;
/**
 * Acts on updates (flushes microtasks)
 */
export declare function act(callback: () => void | Promise<void>): Promise<void>;
/**
 * Waits for the next tick
 */
export declare function nextTick(): Promise<void>;
/**
 * Waits for a state update to complete
 */
export declare function waitForStateUpdate(): Promise<void>;
