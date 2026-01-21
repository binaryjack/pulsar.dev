import { IOutletInternal } from "../../outlet-internal.interface"

/**
 * Render a component in the outlet
 */
export const render = function<TProps>(
    this: IOutletInternal,
    component: (props: TProps) => HTMLElement,
    props: TProps
): void {
    this.clear()
    this._currentComponent = component(props)
    this._element.appendChild(this._currentComponent)
}
