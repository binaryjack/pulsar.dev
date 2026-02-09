/**
 * pulse() - Minimal bootstrap API for Pulsar applications
 */
import type { IServiceManager } from '../di/service-manager.types';
import type { IApplicationRoot } from './application-root.interface';
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
export declare function pulse(
  component: (() => HTMLElement) | HTMLElement,
  config?: string | IPulseConfig
): IApplicationRoot;
