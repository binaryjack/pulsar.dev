import { IApplication } from './application.interface';
import { IBootstrapConfig } from './bootstrap-config.interface';
/**
 * Create an application instance
 */
export declare function createApp<TProps = unknown>(config: IBootstrapConfig<TProps>): IApplication;
/**
 * Create and immediately mount an application
 */
export declare function bootstrapApp<TProps = unknown>(config: IBootstrapConfig<TProps>): IApplication;
