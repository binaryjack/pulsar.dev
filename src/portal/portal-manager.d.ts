import { IPortalManager, IPortalState } from './portal.types';
/**
 * Portal manager constructor
 * Tracks active portals for cleanup
 */
export declare const PortalManager: {
    new (): IPortalManager & {
        _portals: Set<IPortalState>;
    };
};
