import { IOutletInternal } from "../../outlet-internal.interface"

/**
 * Clear the outlet
 */
export const clear = function(this: IOutletInternal): void {
    if (this._currentComponent) {
        this._element.removeChild(this._currentComponent)
        this._currentComponent = null
    }
}
