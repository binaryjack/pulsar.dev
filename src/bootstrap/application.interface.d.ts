/**
 * Public application interface
 */
export interface IApplication {
    /**
     * Root DOM element
     */
    readonly rootElement: HTMLElement;
    /**
     * Mounted component element
     */
    readonly componentElement: HTMLElement | null;
    /**
     * Mount the component
     */
    mount(): void;
    /**
     * Unmount the component
     */
    unmount(): void;
    /**
     * Remount the component with new props
     */
    update<TProps>(props: TProps): void;
}
