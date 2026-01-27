/**
 * Index Component
 * Non-keyed list iteration where items are wrapped in signals
 *
 * Unlike <For> which uses keys for reconciliation, <Index> tracks items
 * by their array position and wraps each item in a signal. This makes it
 * more efficient when item identity is based on position rather than content.
 *
 * @example
 * ```tsx
 * // Item changes trigger updates, array order changes recreate all
 * <Index each={todos()}>
 *   {(todo, index) => (
 *     <li>
 *       {index}: <input value={todo().text} />
 *     </li>
 *   )}
 * </Index>
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic usage
 * Index({
 *   each: () => items(),
 *   children: (item, index) => {
 *     const el = document.createElement('div')
 *     createEffect(() => {
 *       el.textContent = `${index}: ${item().name}`
 *     })
 *     return el
 *   }
 * })
 * ```
 */
import type { IIndexProps } from './index.types';
/**
 * Index component for non-keyed list rendering
 *
 * Each item is wrapped in a signal, so the item can change without
 * recreating the DOM node. The index is stable and not reactive.
 *
 * Use <Index> when:
 * - Items are identified by position, not content
 * - You need reactive item updates without DOM recreation
 * - Working with primitives or objects that change in place
 *
 * Use <For> when:
 * - Items have unique keys/IDs
 * - Array reordering is common
 * - Item identity matters more than position
 */
export declare function Index<T>(props: IIndexProps<T>): HTMLElement;
