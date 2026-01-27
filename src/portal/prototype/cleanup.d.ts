import { IPortalManager, IPortalState } from '../portal.types';
/**
 * Cleanup all portals
 */
export declare const cleanup: (this: IPortalManager & {
    _portals: Set<IPortalState>;
}) => void;
