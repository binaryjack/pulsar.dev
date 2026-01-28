import type { IKeyBindings, KeyHandler } from './use-key-bindings.types'

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
export function useKeyBindings(bindings: IKeyBindings): KeyHandler {
    return (e: KeyboardEvent) => {
        // Call generic key handler first
        bindings.onKey?.(e)
        
        // Call specific key handlers
        switch (e.key) {
            case 'Enter':
                bindings.onEnter?.(e)
                break
            case ' ':
                bindings.onSpace?.(e)
                break
            case 'Escape':
                bindings.onEscape?.(e)
                break
            case 'ArrowDown':
                bindings.onArrowDown?.(e)
                break
            case 'ArrowUp':
                bindings.onArrowUp?.(e)
                break
            case 'ArrowLeft':
                bindings.onArrowLeft?.(e)
                break
            case 'ArrowRight':
                bindings.onArrowRight?.(e)
                break
            case 'Delete':
                bindings.onDelete?.(e)
                break
            case 'Backspace':
                bindings.onBackspace?.(e)
                break
            case 'Tab':
                bindings.onTab?.(e)
                break
        }
    }
}
