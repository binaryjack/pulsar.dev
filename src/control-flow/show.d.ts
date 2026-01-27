import { IShowProps } from './control-flow.types';
/**
 * Show component for conditional rendering
 * Only renders children when condition is true
 *
 * @example
 * ```tsx
 * <Show when={isLoggedIn()} fallback={<Login />}>
 *   <Dashboard />
 * </Show>
 * ```
 *
 * @example
 * ```typescript
 * Show({
 *   when: () => count() > 5,
 *   fallback: () => document.createTextNode('Count is low'),
 *   children: () => document.createTextNode('Count is high')
 * })
 * ```
 */
export declare function Show(props: IShowProps): HTMLElement;
