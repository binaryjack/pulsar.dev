/**
 * useService Hook
 * Access services from the DI container in components
 *
 * @example
 * ```tsx
 * // In main.ts
 * const services = new ServiceManager();
 * services.register('config', () => new ConfigService(), { lifetime: 'singleton' });
 * pulse(App, { root: '#app', services });
 *
 * // In component
 * export const MyComponent = () => {
 *   const config = useService<ConfigService>('config');
 *   return <div>{config.apiUrl}</div>;
 * };
 * ```
 */

import { getCurrentAppRoot } from '../registry/app-root-context';
import type { ServiceIdType } from './service-manager.types';

/**
 * Access a service from the DI container
 * Throws if service not found or no ServiceManager configured
 *
 * @param identifier - Service identifier (Symbol, string, or constructor)
 * @returns Resolved service instance
 */
export function useService<T>(identifier: ServiceIdType<T>): T {
  const appRoot = getCurrentAppRoot();

  if (!appRoot) {
    throw new Error(
      '[useService] No ApplicationRoot found. Make sure pulse() has been called and the app is mounted.'
    );
  }

  if (!appRoot.serviceManager) {
    throw new Error(
      '[useService] No ServiceManager configured. Pass services to pulse() options:\n' +
        'pulse(App, { root: "#app", services: myServiceManager })'
    );
  }

  return appRoot.serviceManager.resolve<T>(identifier);
}

/**
 * Try to access a service from the DI container
 * Returns undefined if service not found or no ServiceManager configured
 *
 * @param identifier - Service identifier (Symbol, string, or constructor)
 * @returns Resolved service instance or undefined
 */
export function useServiceOptional<T>(identifier: ServiceIdType<T>): T | undefined {
  const appRoot = getCurrentAppRoot();

  if (!appRoot?.serviceManager) {
    return undefined;
  }

  return appRoot.serviceManager.tryResolve<T>(identifier);
}
