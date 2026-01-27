/**
 * Application Builder
 * Fluent API for configuring application bootstrap
 */
import { IServiceManager } from '../di/service-manager.types';
import { IApplicationBuilder } from './application-builder.interface';
/**
 * ApplicationBuilder constructor
 */
export declare const ApplicationBuilder: {
    new (): IApplicationBuilderInternal;
};
interface IApplicationBuilderInternal extends IApplicationBuilder {
    _root: string | HTMLElement | null;
    _onMount?: (element: HTMLElement) => void;
    _onUnmount?: () => void;
    _onError?: (error: Error) => void;
    _serviceManager?: IServiceManager;
    _settings?: unknown;
    _stateManager?: unknown;
}
/**
 * Create a new application builder
 *
 * @example
 * ```tsx
 * const appRoot = bootstrapApp()
 *     .root('#app')
 *     .onMount((el) => console.log('Mounted'))
 *     .onError((err) => console.error(err))
 *     .build()
 *
 * // Use with provider
 * <AppContextProvider root={appRoot}>
 *     <MyApp />
 * </AppContextProvider>
 * ```
 */
export declare const bootstrapApp: () => IApplicationBuilder;
export {};
