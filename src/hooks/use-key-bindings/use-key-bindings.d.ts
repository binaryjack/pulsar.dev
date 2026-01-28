import type { IKeyBindings, KeyHandler } from './use-key-bindings.types';
/**
 * useKeyBindings - Utility for declarative keyboard event handling
 * Creates a keyboard event handler based on provided key bindings
 *
 * @param bindings - Object mapping keys to callback functions
 * @returns KeyboardEvent handler function
 *
 * @example
 * ```typescript
 * const handleKeyDown = useKeyBindings({
 *   onEnter: (e) => {
 *     e.preventDefault()
 *     submitForm()
 *   },
 *   onEscape: () => closeModal(),
 *   onArrowDown: () => selectNext(),
 *   onArrowUp: () => selectPrevious()
 * })
 *
 * input.addEventListener('keydown', handleKeyDown)
 * ```
 */
export declare function useKeyBindings(bindings: IKeyBindings): KeyHandler;
