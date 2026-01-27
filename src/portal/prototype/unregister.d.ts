import { IPortalManager, IPortalState } from '../portal.types';
/**
 * Unregister a portal
 */
export declare const unregister: (this: IPortalManager & {
    _portals: Set<IPortalState>;
}, portal: IPortalState) => void;
