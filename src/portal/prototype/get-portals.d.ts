import { IPortalManager, IPortalState } from '../portal.types';
/**
 * Get all active portals
 */
export declare const getPortals: (this: IPortalManager & {
    _portals: Set<IPortalState>;
}) => ReadonlyArray<IPortalState>;
