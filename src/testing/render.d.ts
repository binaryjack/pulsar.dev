/**
 * Component Renderer
 * Core rendering utilities for testing Pulsar components
 */
import type { IRenderOptions, IRenderResult } from './testing.types';
/**
 * Renders a Pulsar component for testing
 */
export declare function render<T = any>(component: (props: T) => any, options?: IRenderOptions<T>): IRenderResult<T>;
/**
 * Cleans up all rendered components
 */
export declare function cleanup(): void;
/**
 * Automatically cleanup after each test (for test frameworks)
 */
export declare function setupAutoCleanup(): void;
