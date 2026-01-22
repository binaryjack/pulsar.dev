/**
 * Immer-style immutable update utility
 *
 * Allows mutating a draft object that produces an immutable result.
 * Uses Proxy to track changes and create a new object with modifications.
 *
 * @example
 * const state = { user: { name: 'John', age: 30 }, posts: [] }
 * const next = produce(state, draft => {
 *   draft.user.age = 31
 *   draft.posts.push({ id: 1, title: 'Hello' })
 * })
 * // Original state unchanged, next is new object with changes
 */

type Recipe<T> = (draft: T) => void | T;
type ProduceResult<T> = T;

const DRAFT_STATE = Symbol('[[DraftState]]');
const IS_DRAFT = Symbol('[[IsDraft]]');

interface IDraftState {
  base: any;
  copy: any | null;
  modified: boolean;
  finalized: boolean;
  parent: IDraftState | null;
  proxies: Map<string | number | symbol, any>;
}

/**
 * Check if value is draftable (can be proxied)
 */
function isDraftable(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  const type = typeof value;
  return (
    type === 'object' && (Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype)
  );
}

/**
 * Mark state as modified and mark parent chain
 */
function markModified(state: IDraftState): void {
  if (!state.modified) {
    state.modified = true;

    // Ensure we have a copy
    prepareCopy(state);

    // Mark parent chain as modified
    if (state.parent) {
      markModified(state.parent);
    }
  }
}

/**
 * Get or create copy of base
 */
function prepareCopy(state: IDraftState): any {
  if (!state.copy) {
    state.copy = Array.isArray(state.base) ? state.base.slice() : Object.assign({}, state.base);
  }
  return state.copy;
}

/**
 * Create a draft proxy for an object
 */
function createDraft(base: any, parent: IDraftState | null = null): any {
  if (!isDraftable(base)) {
    return base;
  }

  const state: IDraftState = {
    base,
    copy: null,
    modified: false,
    finalized: false,
    parent,
    proxies: new Map(),
  };

  const proxy = new Proxy(base, {
    get(target, prop) {
      // Return draft marker
      if (prop === IS_DRAFT) {
        return true;
      }

      // Return draft state for internal access
      if (prop === DRAFT_STATE) {
        return state;
      }

      // Use copy if it exists (we've modified this object)
      const source = state.copy || target;
      const value = source[prop];

      // Handle array methods that need special treatment
      if (Array.isArray(source) && typeof value === 'function') {
        const mutatingMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
        if (mutatingMethods.includes(prop as string)) {
          return function (this: any, ...args: any[]) {
            const copy = prepareCopy(state);
            markModified(state);
            const result = Array.prototype[prop as any].apply(copy, args);
            return result;
          };
        }
        return value.bind(source);
      }

      // Return functions and symbols as-is
      if (typeof prop === 'symbol' || typeof value === 'function') {
        return value;
      }

      // If we already have a proxy for this property, return it
      if (state.proxies.has(prop)) {
        return state.proxies.get(prop);
      }

      // Create nested draft for objects or arrays
      if (isDraftable(value)) {
        // Ensure parent copy exists when creating nested proxy
        // This is critical for array elements - when we access draft.todos[0],
        // we need to ensure todos array is copied before we create proxy for element
        if (Array.isArray(source) && !state.copy) {
          prepareCopy(state);
        }

        // When we create a nested proxy, ensure we use value from copy if parent was modified
        const baseForNested = state.copy ? state.copy[prop] : value;
        const nestedProxy = createDraft(baseForNested, state);
        state.proxies.set(prop, nestedProxy);

        // Store the proxy in the copy if it exists
        if (state.copy) {
          state.copy[prop] = nestedProxy;
        }

        return nestedProxy;
      }

      return value;
    },

    set(target, prop, value) {
      const copy = prepareCopy(state);
      const current = copy[prop];

      // Only mark modified if value actually changed
      if (current !== value) {
        copy[prop] = value;
        markModified(state);
        // Remove proxy if we're replacing it
        state.proxies.delete(prop);
      }

      return true;
    },

    deleteProperty(target, prop) {
      const copy = prepareCopy(state);
      delete copy[prop];
      markModified(state);
      state.proxies.delete(prop);
      return true;
    },
  });

  return proxy;
}

/**
 * Finalize draft and return immutable result
 */
function finalizeDraft(draft: any): any {
  if (!isDraftable(draft)) {
    return draft;
  }

  const state = draft[DRAFT_STATE];
  if (!state) {
    return draft;
  }

  if (state.finalized) {
    return state.copy || state.base;
  }

  state.finalized = true;

  // If not modified, return base (structural sharing)
  if (!state.modified) {
    return state.base;
  }

  const copy = state.copy || state.base;

  // Finalize nested values in the copy
  if (Array.isArray(copy)) {
    for (let i = 0; i < copy.length; i++) {
      const value = copy[i];
      if (isDraftable(value) && value[IS_DRAFT]) {
        copy[i] = finalizeDraft(value);
      } else if (state.proxies.has(i)) {
        copy[i] = finalizeDraft(state.proxies.get(i));
      }
    }
  } else {
    Object.keys(copy).forEach((key) => {
      const value = copy[key];
      if (isDraftable(value) && value[IS_DRAFT]) {
        copy[key] = finalizeDraft(value);
      } else if (state.proxies.has(key)) {
        copy[key] = finalizeDraft(state.proxies.get(key));
      }
    });
  }

  return copy;
}

/**
 * Produce a new immutable state from a base state and a recipe
 *
 * @param base - Base state to modify
 * @param recipe - Function that mutates the draft
 * @returns New immutable state with modifications
 *
 * @example
 * // Object updates
 * const user = { name: 'John', age: 30 }
 * const updated = produce(user, draft => {
 *   draft.age = 31
 * })
 *
 * @example
 * // Nested updates
 * const state = { user: { profile: { name: 'John' } } }
 * const updated = produce(state, draft => {
 *   draft.user.profile.name = 'Jane'
 * })
 *
 * @example
 * // Array updates
 * const todos = [{ id: 1, done: false }]
 * const updated = produce(todos, draft => {
 *   draft[0].done = true
 *   draft.push({ id: 2, done: false })
 * })
 *
 * @example
 * // Return new state (replaces draft)
 * const state = { count: 0 }
 * const updated = produce(state, draft => {
 *   return { count: 10 } // Replaces entire state
 * })
 */
export function produce<T>(base: T, recipe: Recipe<T>): ProduceResult<T> {
  // Handle primitives
  if (!isDraftable(base)) {
    return base;
  }

  // Create draft
  const draft = createDraft(base);

  // Execute recipe
  const result = recipe(draft);

  // If recipe returns a value, use it (allows complete replacement)
  if (result !== undefined) {
    return result;
  }

  // Finalize and return
  return finalizeDraft(draft);
}
