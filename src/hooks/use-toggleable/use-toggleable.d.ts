import type { IUseToggleableReturn, ToggleState } from './use-toggleable.types';
/**
 * useToggleable - State management for open/close/idle patterns
 * Common pattern for modals, dropdowns, accordions, drawers, tooltips
 *
 * @param initialState - Initial toggle state (default: 'idle')
 * @returns Object with state and helper methods
 *
 * @example
 * ```typescript
 * const modal = useToggleable('closed')
 *
 * // Check state
 * if (modal.isOpen()) {
 *   // Modal is open
 * }
 *
 * // Control state
 * modal.open()        // Set to 'open'
 * modal.close()       // Set to 'closed'
 * modal.toggle()      // Toggle between open/closed
 * modal.reset()       // Set to 'idle'
 *
 * // Direct state access
 * const currentState = modal.state()
 * modal.setState('open')
 * ```
 */
export declare function useToggleable(initialState?: ToggleState): IUseToggleableReturn;
