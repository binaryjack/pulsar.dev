/**
 * Toggle state type
 * Represents the three possible states of a toggleable component
 */
export type ToggleState = 'idle' | 'open' | 'closed'

/**
 * useToggleable return type
 * Provides state and methods for managing toggle state
 */
export interface IUseToggleableReturn {
    /** Get current state */
    state: () => ToggleState
    /** Check if state is 'open' */
    isOpen: () => boolean
    /** Check if state is 'closed' */
    isClosed: () => boolean
    /** Check if state is 'idle' */
    isIdle: () => boolean
    /** Toggle between 'open' and 'closed' */
    toggle: () => void
    /** Set state to 'open' */
    open: () => void
    /** Set state to 'closed' */
    close: () => void
    /** Set state to 'idle' */
    reset: () => void
    /** Set state directly */
    setState: (state: ToggleState) => void
}
