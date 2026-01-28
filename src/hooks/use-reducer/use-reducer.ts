import { useState } from '../use-state';
import type { Dispatch, Reducer, UseReducerReturn } from './use-reducer.types';

/**
 * useReducer hook - React-like API for complex state management
 * Uses reducer pattern for predictable state updates
 *
 * @param reducer - Function that takes current state and action, returns new state
 * @param initialState - Initial state value
 * @returns Tuple of [state getter, dispatch function]
 *
 * @example
 * ```typescript
 * type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'set', value: number }
 *
 * const reducer = (state: number, action: Action) => {
 *   switch (action.type) {
 *     case 'increment': return state + 1
 *     case 'decrement': return state - 1
 *     case 'set': return action.value
 *     default: return state
 *   }
 * }
 *
 * const [count, dispatch] = useReducer(reducer, 0)
 *
 * dispatch({ type: 'increment' })
 * console.log(count()) // 1
 * ```
 */
export function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): UseReducerReturn<S, A> {
  // Use useState as the underlying state primitive
  const [state, setState] = useState<S>(initialState);

  // Create dispatch function that applies reducer
  const dispatch: Dispatch<A> = (action: A) => {
    setState((currentState) => reducer(currentState, action));
  };

  return [state, dispatch];
}
