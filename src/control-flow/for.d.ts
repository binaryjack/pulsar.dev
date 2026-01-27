import { IForProps } from './control-flow.types';
/**
 * For component for list rendering
 * Efficiently updates DOM when array changes
 *
 * @example
 * ```tsx
 * <For each={todos()} key={(todo) => todo.id}>
 *   {(todo, index) => <TodoItem todo={todo} index={index()} />}
 * </For>
 * ```
 *
 * @example
 * ```typescript
 * For({
 *   each: () => items(),
 *   key: (item) => item.id,
 *   children: (item, index) => {
 *     const el = document.createElement('div')
 *     el.textContent = `${index()}: ${item.name}`
 *     return el
 *   }
 * })
 * ```
 */
export declare function For<T>(props: IForProps<T>): HTMLElement;
