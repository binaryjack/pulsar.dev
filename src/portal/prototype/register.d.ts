import { IPortalManager, IPortalState } from '../portal.types';
/**
 * Register a portal
 */
export declare const register: (this: IPortalManager & {
    _portals: Set<IPortalState>;
}, portal: IPortalState) => void;
