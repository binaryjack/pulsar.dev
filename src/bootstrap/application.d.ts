import { IApplicationInternal } from './application-internal.interface';
import { IBootstrapConfig } from './bootstrap-config.interface';
/**
 * Application constructor
 * Manages application lifecycle and component mounting
 */
export declare const Application: {
    new <TProps = unknown>(config: IBootstrapConfig<TProps>): IApplicationInternal<TProps>;
};
