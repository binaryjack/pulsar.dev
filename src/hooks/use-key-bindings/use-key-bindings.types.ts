/**
 * Key binding callbacks interface
 * Define handlers for specific keyboard events
 */
export interface IKeyBindings {
    /** Called on any key event, before specific key callbacks */
    onKey?: (e: KeyboardEvent) => void
    /** Called when the Enter key is pressed */
    onEnter?: (e: KeyboardEvent) => void
    /** Called when the Spacebar key is pressed */
    onSpace?: (e: KeyboardEvent) => void
    /** Called when the Escape key is pressed */
    onEscape?: (e: KeyboardEvent) => void
    /** Called when the ArrowDown key is pressed */
    onArrowDown?: (e: KeyboardEvent) => void
    /** Called when the ArrowUp key is pressed */
    onArrowUp?: (e: KeyboardEvent) => void
    /** Called when the ArrowLeft key is pressed */
    onArrowLeft?: (e: KeyboardEvent) => void
    /** Called when the ArrowRight key is pressed */
    onArrowRight?: (e: KeyboardEvent) => void
    /** Called when the Delete key is pressed */
    onDelete?: (e: KeyboardEvent) => void
    /** Called when the Backspace key is pressed */
    onBackspace?: (e: KeyboardEvent) => void
    /** Called when the Tab key is pressed */
    onTab?: (e: KeyboardEvent) => void
}

/**
 * Key handler function type
 */
export type KeyHandler = (e: KeyboardEvent) => void
