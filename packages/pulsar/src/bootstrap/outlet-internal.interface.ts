/**
 * Internal outlet interface
 */

import { IOutlet } from './outlet.interface'

export interface IOutletInternal extends IOutlet {
    _element: HTMLElement
    _currentComponent: HTMLElement | null
}
