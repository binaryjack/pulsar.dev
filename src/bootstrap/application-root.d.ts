/**
 * Application Root
 * Represents a mounting point for the application
 */
import { IServiceManager } from '../di/service-manager.types';
import '../registry/types/html-element.augment';
import { IApplicationRootInternal } from './application-root-internal.interface';
/**
 * ApplicationRoot constructor
 */
export declare const ApplicationRoot: {
    new (rootElement: HTMLElement, onMount?: (element: HTMLElement) => void, onUnmount?: () => void, onError?: (error: Error) => void, serviceManager?: IServiceManager): IApplicationRootInternal;
};
