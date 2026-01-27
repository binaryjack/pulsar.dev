/**
 * Registry Event Delegator
 * Global event delegation using Element Registry for O(1) target lookup
 */
import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { IRegistryEventDelegator } from './registry-event-delegator.types';
/**
 * RegistryEventDelegator constructor function (prototype-based class)
 * Manages global event delegation at ApplicationRoot level
 */
export declare const RegistryEventDelegator: {
    new (appRoot: IApplicationRoot): IRegistryEventDelegator;
};
