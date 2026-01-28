/**
 * Reducer function type
 * Takes current state and action, returns new state
 */
export type Reducer<S, A> = (state: S, action: A) => S;

/**
 * Dispatch function type
 * Accepts an action and triggers state update
 */
export type Dispatch<A> = (action: A) => void;

/**
 * useReducer return type
 * Tuple of [state getter, dispatch function]
 */
export type UseReducerReturn<S, A> = [get: () => S, dispatch: Dispatch<A>];
