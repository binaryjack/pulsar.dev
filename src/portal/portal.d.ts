import { IPortalProps } from './portal.types';
/**
 * Portal component for rendering content outside parent hierarchy
 * Useful for modals, tooltips, dropdowns, etc.
 *
 * @example
 * ```tsx
 * <Portal mount="#modal-root">
 *   <Modal>{content}</Modal>
 * </Portal>
 * ```
 *
 * @example
 * ```typescript
 * Portal({
 *   mount: document.body,
 *   children: () => {
 *     const modal = document.createElement('div')
 *     modal.className = 'modal'
 *     return modal
 *   }
 * })
 * ```
 */
export declare function Portal(props: IPortalProps): HTMLElement;
/**
 * Cleanup all portals
 * Call this when app unmounts
 */
export declare function cleanupPortals(): void;
