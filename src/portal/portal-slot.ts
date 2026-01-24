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
  id: string
  /** Slot name (e.g., 'commands', 'footer', 'modal') */
  name: string
  /** Additional CSS class */
  class?: string
}

/**
 * PortalSlot - Declarative mount point for portals
 */
export const PortalSlot = ({ id, name, class: className }: IPortalSlotProps): HTMLElement => {
  const slot = document.createElement('div')
  slot.id = `${id}-${name}`
  
  if (className) {
    slot.className = className
  }
  
  // Mark as portal slot for debugging
  slot.setAttribute('data-portal-slot', name)
  
  return slot
}
