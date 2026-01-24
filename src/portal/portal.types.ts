/**
 * Portal system types for rendering outside parent hierarchy
 */

/**
 * Portal props
 */
export interface IPortalProps {
  /**
   * Content to portal
   */
  children: HTMLElement | (() => HTMLElement);

  /**
   * Target container to render into
   * Can be selector string or HTMLElement
   * Defaults to document.body
   */
  mount?: string | HTMLElement;

  /**
   * Alternative: Use id + target pattern
   * Constructs mount selector as `#${id}-${target}`
   * @example <Portal id="form-a" target="commands">...</Portal>
   * Will mount to element with id="form-a-commands"
   */
  id?: string;
  target?: string;
}

/**
 * Internal portal state
 */
export interface IPortalState {
  /**
   * Target container
   */
  container: HTMLElement;

  /**
   * Placeholder in original position
   */
  placeholder: Comment;

  /**
   * Portaled content
   */
  content: HTMLElement | null;

  /**
   * Cleanup function
   */
  cleanup?: () => void;
}

/**
 * Portal manager for tracking active portals
 */
export interface IPortalManager {
  /**
   * Register a portal
   */
  register(portal: IPortalState): void;

  /**
   * Unregister a portal
   */
  unregister(portal: IPortalState): void;

  /**
   * Get all active portals
   */
  getPortals(): ReadonlyArray<IPortalState>;

  /**
   * Cleanup all portals
   */
  cleanup(): void;
}
