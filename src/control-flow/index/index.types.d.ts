/**
 * Index Component Types
 * Non-keyed list iteration with item-as-signal pattern
 */
/**
 * Props for Index component
 *
 * @template T - Type of items in the array
 *
 * @example
 * ```tsx
 * <Index each={items()}>
 *   {(item, index) => <div>{item()} at {index}</div>}
 * </Index>
 * ```
 */
export interface IIndexProps<T> {
    /**
     * Array to iterate over (can be signal or static)
     */
    each: T[] | (() => T[]);
    /**
     * Render function
     * @param item - Signal accessor for the item (() => T)
     * @param index - Stable index number (not a signal)
     * @returns DOM element to render
     */
    children: (item: () => T, index: number) => HTMLElement;
    /**
     * Optional fallback when array is empty
     */
    fallback?: HTMLElement | (() => HTMLElement);
}
/**
 * Internal state for Index component
 */
export interface IIndexState<T> {
    /**
     * Map of index to element
     */
    items: Map<number, HTMLElement>;
    /**
     * Map of index to item signal
     */
    signals: Map<number, () => T>;
    /**
     * Container element
     */
    container: HTMLElement;
    /**
     * Cleanup functions for each index
     */
    cleanups: Map<number, () => void>;
}
