/**
 * Public outlet interface
 */
export interface IOutlet {
    /**
     * Render a component in this outlet
     */
    render<TProps>(component: (props: TProps) => HTMLElement, props: TProps): void;
    /**
     * Clear the outlet
     */
    clear(): void;
    /**
     * Get the outlet element
     */
    readonly element: HTMLElement;
}
