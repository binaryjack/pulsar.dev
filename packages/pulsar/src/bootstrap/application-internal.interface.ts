/**
 * Internal application interface
 */

import { IApplication } from './application.interface'
import { IBootstrapConfig } from './bootstrap-config.interface'

export interface IApplicationInternal<TProps = unknown> extends IApplication {
    config: IBootstrapConfig<TProps>
    _rootElement: HTMLElement | null
    _componentElement: HTMLElement | null
    _isMounted: boolean
}
