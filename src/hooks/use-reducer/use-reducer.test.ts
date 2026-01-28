import { useReducer } from './use-reducer';

describe('useReducer', () => {
  type CounterAction =
    | { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'set'; value: number };

  const counterReducer = (state: number, action: CounterAction): number => {
    switch (action.type) {
      case 'increment':
        return state + 1;
      case 'decrement':
        return state - 1;
      case 'set':
        return action.value;
      default:
        return state;
    }
  };

  it('should initialize with initial state', () => {
    const [count] = useReducer(counterReducer, 0);
    expect(count()).toBe(0);
  });

  it('should handle increment action', () => {
    const [count, dispatch] = useReducer(counterReducer, 0);
    dispatch({ type: 'increment' });
    expect(count()).toBe(1);
  });

  it('should handle decrement action', () => {
    const [count, dispatch] = useReducer(counterReducer, 5);
    dispatch({ type: 'decrement' });
    expect(count()).toBe(4);
  });

  it('should handle set action', () => {
    const [count, dispatch] = useReducer(counterReducer, 0);
    dispatch({ type: 'set', value: 42 });
    expect(count()).toBe(42);
  });

  it('should handle multiple sequential actions', () => {
    const [count, dispatch] = useReducer(counterReducer, 0);
    dispatch({ type: 'increment' });
    dispatch({ type: 'increment' });
    dispatch({ type: 'increment' });
    expect(count()).toBe(3);
    dispatch({ type: 'decrement' });
    expect(count()).toBe(2);
  });

  it('should work with complex state objects', () => {
    type State = { count: number; name: string };
    type Action = { type: 'setCount'; value: number } | { type: 'setName'; value: string };

    const reducer = (state: State, action: Action): State => {
      switch (action.type) {
        case 'setCount':
          return { ...state, count: action.value };
        case 'setName':
          return { ...state, name: action.value };
        default:
          return state;
      }
    };

    const [state, dispatch] = useReducer(reducer, { count: 0, name: 'Initial' });
    expect(state()).toEqual({ count: 0, name: 'Initial' });

    dispatch({ type: 'setCount', value: 10 });
    expect(state()).toEqual({ count: 10, name: 'Initial' });

    dispatch({ type: 'setName', value: 'Updated' });
    expect(state()).toEqual({ count: 10, name: 'Updated' });
  });

  it('should handle unknown actions gracefully', () => {
    const [count, dispatch] = useReducer(counterReducer, 5);
    // @ts-expect-error - Testing unknown action
    dispatch({ type: 'unknown' });
    expect(count()).toBe(5); // State should remain unchanged
  });
});
