import { createEffect } from './effect';

/**
 * Synchronous variant of `createEffect` intended to run before paint.
 *
 * In Pulsar's scheduler, `createEffect` already runs synchronously outside
 * of a `batch()` context — signal writes call subscribers immediately, with
 * no `queueMicrotask` or `requestAnimationFrame` indirection. This means
 * `createRenderEffect` is behaviourally identical to `createEffect` in the
 * current runtime.
 *
 * The primitive is provided for API parity with SolidJS and to serve as a
 * semantic marker: effects that must complete before the frame is composited
 * should use `createRenderEffect` so they can be upgraded to a true
 * synchronous-flush queue if the scheduler gains async batching in future.
 *
 * @example
 * ```ts
 * createRenderEffect(() => {
 *   element.style.transform = `translateX(${x()}px)`;
 * });
 * ```
 */
export const createRenderEffect = createEffect;
