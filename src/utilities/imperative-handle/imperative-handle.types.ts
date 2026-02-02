/**
 * ⚠️ ESCAPE HATCH - Use only for browser APIs that cannot be made declarative
 *
 * @module imperative-handle
 * @see {@link ../README.md} for valid use cases
 */

/**
 * Imperative handle registry interface
 * Provides access to imperative APIs when declarative patterns are not feasible
 */
export interface IImperativeHandle<T> {
  /**
   * Register an imperative handle
   * Called by the component that owns the imperative API
   */
  register: (handle: T) => void;

  /**
   * Get the current imperative handle
   * Returns null if not yet registered
   */
  get: () => T | null;

  /**
   * Clear the handle and cleanup
   */
  dispose: () => void;
}

/**
 * Configuration options for imperative handle
 */
export interface IImperativeHandleConfig {
  /**
   * Optional name for debugging and validation
   */
  name?: string;

  /**
   * Whether to allow re-registration (default: false)
   */
  allowReregistration?: boolean;

  /**
   * Optional validation function for the handle
   */
  validate?: (handle: unknown) => boolean;
}

/**
 * Valid use case categories for imperative handles
 * Used for documentation and validation
 */
export type ImperativeHandleUseCase =
  | 'video-audio-control' // Video/audio playback, seek, volume
  | 'canvas-webgl' // Canvas/WebGL contexts and drawing
  | 'focus-management' // Browser focus APIs
  | 'third-party-dom' // Third-party DOM libraries (charts, editors)
  | 'animation-control' // RAF-based animations
  | 'measurement' // DOM measurements (getBoundingClientRect)
  | 'scroll-control' // Programmatic scroll control
  | 'other'; // Must be justified in code review

/**
 * Metadata for documenting imperative handle usage
 */
export interface IImperativeHandleMetadata {
  /**
   * Use case category (for validation/review)
   */
  useCase: ImperativeHandleUseCase;

  /**
   * Justification for using imperative API
   */
  reason: string;

  /**
   * Link to code review or decision document
   */
  approvalRef?: string;
}
