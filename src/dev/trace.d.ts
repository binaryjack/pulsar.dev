/**
 * Track component lifecycles in development
 */
interface IComponentTrace {
    name: string;
    mountTime: number;
    updateCount: number;
}
/**
 * Start tracking a component
 */
export declare function traceComponentMount(name: string): void;
/**
 * Track component update
 */
export declare function traceComponentUpdate(name: string): void;
/**
 * Stop tracking and report stats
 */
export declare function traceComponentUnmount(name: string): void;
/**
 * Get all active component traces
 */
export declare function getComponentTraces(): ReadonlyMap<string, Readonly<IComponentTrace>>;
/**
 * Warn about excessive updates
 */
export declare function checkExcessiveUpdates(name: string, threshold?: number): void;
export {};
