import { IOutletInternal } from './outlet-internal.interface'

/**
 * Outlet constructor
 * Manages nested component rendering
 */
export const Outlet = function(
    this: IOutletInternal,
    element: HTMLElement
) {
    Object.defineProperty(this, '_element', {
        value: element,
        writable: false,
        enumerable: false
    })
    
    Object.defineProperty(this, '_currentComponent', {
        value: null,
        writable: true,
        enumerable: false
    })
} as unknown as { new (element: HTMLElement): IOutletInternal }

// Define getter
Object.defineProperty(Outlet.prototype, 'element', {
    get(this: IOutletInternal): HTMLElement {
        return this._element
    },
    enumerable: true,
    configurable: false
})
