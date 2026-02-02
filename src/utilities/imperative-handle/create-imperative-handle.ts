import { createSignal } from '../../reactivity/signal';
import type { IImperativeHandle, IImperativeHandleConfig } from './imperative-handle.types';

/**
 * ⚠️ ESCAPE HATCH - Use only for browser APIs that cannot be made declarative
 *
 * Creates a signal-based imperative handle for rare cases where declarative
 * patterns are not feasible (video controls, canvas, focus management, etc.)
 *
 * @example Valid use case - Video player control
 * ```typescript
 * interface VideoPlayerAPI {
 *   play(): Promise<void>;
 *   pause(): void;
 *   seek(time: number): void;
 * }
 *
 * const videoHandle = createImperativeHandle<VideoPlayerAPI>({
 *   name: 'VideoPlayer',
 *   validate: (handle) => 'play' in handle && 'pause' in handle
 * });
 *
 * // Component registers its API
 * const VideoPlayer = (props) => {
 *   const videoRef = createRef<HTMLVideoElement>();
 *
 *   videoHandle.register({
 *     play: () => videoRef.current?.play() ?? Promise.resolve(),
 *     pause: () => videoRef.current?.pause(),
 *     seek: (time) => {
 *       if (videoRef.current) videoRef.current.currentTime = time;
 *     }
 *   });
 *
 *   return <video ref={videoRef} />;
 * };
 *
 * // Parent uses imperative API
 * const App = () => {
 *   const handlePlay = () => {
 *     const api = videoHandle.get();
 *     api?.play();
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handlePlay}>Play</button>
 *       <VideoPlayer />
 *     </>
 *   );
 * };
 * ```
 *
 * @example Invalid use case - Modal control (use declarative props instead)
 * ```typescript
 * // ❌ WRONG - Use declarative isOpen prop instead
 * const modalHandle = createImperativeHandle<{ open(): void }>();
 *
 * // ✅ RIGHT - Declarative control
 * const [isOpen, setIsOpen] = createSignal(false);
 * <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} />
 * ```
 *
 * @template T - Type of the imperative handle
 * @param config - Optional configuration for validation and debugging
 * @returns Imperative handle with register, get, and dispose methods
 *
 * @see {@link ../README.md} for complete list of valid use cases
 * @see {@link ../../../../.github/00-CRITICAL-RULES.md} for declarative requirements
 */
export function createImperativeHandle<T>(
  config: IImperativeHandleConfig = {}
): IImperativeHandle<T> {
  const { name, allowReregistration = false, validate } = config;

  // Use signal to store handle (allows reactive updates if needed)
  const [getHandle, setHandle] = createSignal<T | null>(null);
  let isRegistered = false;

  /**
   * Development-mode warnings
   */
  if (import.meta.env.DEV) {
    if (!name) {
      console.warn(
        '⚠️ [createImperativeHandle] No name provided. ' +
          'Consider adding a name for debugging: createImperativeHandle({ name: "MyComponent" })'
      );
    }
  }

  const register = (handle: T): void => {
    // Validate registration state
    if (isRegistered && !allowReregistration) {
      const error = new Error(
        `[createImperativeHandle${name ? ` "${name}"` : ''}] ` +
          'Handle already registered. Set allowReregistration: true to allow re-registration.'
      );

      if (import.meta.env.DEV) {
        console.error(error);
      }
      throw error;
    }

    // Validate handle if validator provided
    if (validate && !validate(handle)) {
      const error = new Error(
        `[createImperativeHandle${name ? ` "${name}"` : ''}] ` +
          'Handle validation failed. Ensure handle conforms to expected interface.'
      );

      if (import.meta.env.DEV) {
        console.error(error, { handle });
      }
      throw error;
    }

    // Register the handle
    setHandle(handle);
    isRegistered = true;

    if (import.meta.env.DEV && name) {
      console.log(`[createImperativeHandle "${name}"] Handle registered`, handle);
    }
  };

  const get = (): T | null => {
    const handle = getHandle();

    if (import.meta.env.DEV && !handle && name) {
      console.warn(
        `[createImperativeHandle "${name}"] ` +
          'Attempting to get handle before registration. ' +
          'Ensure the component has mounted and called register().'
      );
    }

    return handle;
  };

  const dispose = (): void => {
    setHandle(null);
    isRegistered = false;

    if (import.meta.env.DEV && name) {
      console.log(`[createImperativeHandle "${name}"] Handle disposed`);
    }
  };

  return {
    register,
    get,
    dispose,
  };
}
