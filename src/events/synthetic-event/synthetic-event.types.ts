export const SSyntheticEvent = Symbol.for('ISyntheticEvent')

export interface ISyntheticEvent<T extends EventTarget = EventTarget> {
    // Constructor signature
    new (nativeEvent: Event): ISyntheticEvent<T>
    
    // Event properties
    readonly nativeEvent: Event
    readonly type: string
    readonly target: EventTarget | null
    readonly currentTarget: T
    readonly timeStamp: number
    readonly bubbles: boolean
    readonly cancelable: boolean
    readonly defaultPrevented: boolean
    readonly eventPhase: number
    readonly isTrusted: boolean
    
    // Methods (defined in prototype)
    preventDefault: () => void
    stopPropagation: () => void
    stopImmediatePropagation: () => void
    isPropagationStopped: () => boolean
    isDefaultPrevented: () => boolean
}

export type EventHandler<E extends ISyntheticEvent = ISyntheticEvent> = (event: E) => void
