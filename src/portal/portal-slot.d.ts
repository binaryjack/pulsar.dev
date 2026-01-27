/**
 * PortalSlot component
 * Creates a mount point for Portal components
 *
 * @example
 * ```tsx
 * // Create a slot
 * <PortalSlot id="form-a" name="commands" />
 * // Renders: <div id="form-a-commands"></div>
 *
 * // Use with Portal
 * <Portal id={form.id} target="commands">
 *   <CommandButtons />
 * </Portal>
 * ```
 */
export interface IPortalSlotProps {
    /** Unique identifier (e.g., form ID) */
    id: string;
    /** Slot name (e.g., 'commands', 'footer', 'modal') */
    name: string;
    /** Additional CSS class */
    class?: string;
}
/**
 * PortalSlot - Declarative mount point for portals
 */
export declare const PortalSlot: ({ id, name, class: className }: IPortalSlotProps) => HTMLElement;
