/**
 * pulse() - Minimal bootstrap API for Pulsar applications
 *
 * @example
 * ```typescript
 * // Minimal usage
 * pulse(App);
 *
 * // With custom root
 * pulse(App, { root: '#root' });
 *
 * // Advanced config
 * pulse(App, {
 *   root: '#app',
 *   onMount: (el) => console.log('Mounted!'),
 *   onError: (err) => handleError(err),
 *   services: myServiceManager
 * });
 * ```
 */

import type { IServiceManager } from '../di/service-manager.types';
import { setCurrentAppRoot } from '../registry/app-root-context';
import type { IApplicationRoot } from './application-root.interface';
import { bootstrapApp } from './builder';

export interface IPulseConfig {
  /**
   * Root element selector or element
   * @default '#app'
   */
  root?: string | HTMLElement;

  /**
   * Callback invoked after successful mount
   */
  onMount?: (element: HTMLElement) => void;

  /**
   * Callback invoked before unmount
   */
  onUnmount?: () => void;

  /**
   * Error handler for mount/runtime errors
   */
  onError?: (error: Error) => void;

  /**
   * Dependency injection service manager
   */
  services?: IServiceManager;

  /**
   * Application settings (future feature)
   */
  settings?: unknown;
}

/**
 * Mount a Pulsar component to the DOM
 *
 * This is the primary entry point for Pulsar applications.
 * HMR is automatically injected by the Vite plugin in development mode.
 *
 * @param component - Component function or instance to mount
 * @param config - Optional mount configuration
 * @returns ApplicationRoot instance for advanced control
 */
export function pulse(
  component: (() => HTMLElement) | HTMLElement,
  config: string | IPulseConfig = '#app'
): IApplicationRoot {
  // Normalize config
  const finalConfig: IPulseConfig = typeof config === 'string' ? { root: config } : config;

  // Build app with defaults
  const builder = bootstrapApp().root(finalConfig.root || '#app');

  // Optional lifecycle hooks
  if (finalConfig.onMount) {
    builder.onMount(finalConfig.onMount);
  }

  if (finalConfig.onUnmount) {
    builder.onUnmount(finalConfig.onUnmount);
  }

  if (finalConfig.onError) {
    builder.onError(finalConfig.onError);
  }

  // Optional IoC container
  if (finalConfig.services) {
    builder.ioc(finalConfig.services);
  }

  // Optional settings
  if (finalConfig.settings) {
    builder.settings(finalConfig.settings);
  }

  // Build and mount
  const app = builder.build();

  // Set as current app root BEFORE creating component
  // This ensures useService() and other hooks work during component creation
  setCurrentAppRoot(app);

  // Handle both component function and instance
  const componentInstance = typeof component === 'function' ? component() : component;

  app.mount(componentInstance);

  return app;
}
