/**
 * Internal application root interface
 */
import { IApplicationRoot } from './application-root.interface';
export interface IApplicationRootInternal extends IApplicationRoot {
    _mountedComponent: HTMLElement | null;
    _isMounted: boolean;
}
