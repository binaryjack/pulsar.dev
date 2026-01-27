import { IOutletInternal } from "../../outlet-internal.interface";
/**
 * Render a component in the outlet
 */
export declare const render: <TProps>(this: IOutletInternal, component: (props: TProps) => HTMLElement, props: TProps) => void;
