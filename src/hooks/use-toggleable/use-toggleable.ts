import { useState } from '../use-state';
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
export function useToggleable(initialState: ToggleState = 'idle'): IUseToggleableReturn {
  const [state, setState] = useState<ToggleState>(initialState);

  const toggle = () => {
    setState((prev) => (prev === 'open' ? 'closed' : 'open'));
  };

  const open = () => {
    setState('open');
  };

  const close = () => {
    setState('closed');
  };

  const reset = () => {
    setState('idle');
  };

  const isOpen = () => {
    return state() === 'open';
  };

  const isClosed = () => {
    return state() === 'closed';
  };

  const isIdle = () => {
    return state() === 'idle';
  };

  return {
    state,
    isOpen,
    isClosed,
    isIdle,
    toggle,
    open,
    close,
    reset,
    setState,
  };
}
