/**
 * Dynamic Component
 * Runtime component selection and rendering
 *
 * Allows selecting which component to render at runtime based on data.
 * Supports both function components and string-based resolution from registry.
 *
 * @example
 * ```tsx
 * // Function-based
 * <Dynamic component={selectedComponent()} name="John" />
 *
 * // String-based (requires registry)
 * <Dynamic component="Button" text="Click me" />
 *
 * // With signal
 * <Dynamic component={() => componentMap[type()]} {...props} />
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic usage
 * const element = Dynamic({
 *   component: () => type() === 'button' ? Button : Link,
 *   text: 'Click me',
 *   onClick: handleClick
 * })
 * ```
 */
import type { IDynamicProps } from './dynamic.types';
/**
 * Dynamic component for runtime component selection
 *
 * Use Dynamic when:
 * - Component type changes based on data
 * - Rendering different components conditionally
 * - Building dynamic UIs from configuration
 * - Working with component maps/dictionaries
 *
 * Features:
 * - Function or string component resolution
 * - Automatic prop forwarding
 * - Reactive component switching
 * - Graceful error handling
 */
export declare function Dynamic<P = any>(props: IDynamicProps<P>): HTMLElement;
