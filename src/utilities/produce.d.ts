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
export declare function produce<T>(base: T, recipe: Recipe<T>): ProduceResult<T>;
export {};
