import { IApplicationInternal } from '../application-internal.interface';

/**
 * Mount the application to the DOM
 */
export const mount = function <TProps>(this: IApplicationInternal<TProps>): void {
  if (this._isMounted) {
    console.warn('[Bootstrap] Application already mounted');
    return;
  }

  try {
    console.log('[Bootstrap/mount] 1. Starting mount process...');

    // Resolve root element
    console.log(`[Bootstrap/mount] 2. Resolving root: ${this.config.root}`);
    if (typeof this.config.root === 'string') {
      const element = document.querySelector(this.config.root);
      console.log(`[Bootstrap/mount]    querySelector('${this.config.root}') found: ${!!element}`);
      if (!element) {
        throw new Error(`Root element not found: ${this.config.root}`);
      }
      this._rootElement = element as HTMLElement;
    } else {
      this._rootElement = this.config.root;
    }
    console.log('[Bootstrap/mount] 3. ✅ Root element resolved:', this._rootElement.tagName);

    // Create component
    console.log('[Bootstrap/mount] 4. Calling component function...');
    console.log(`[Bootstrap/mount]    component type: ${typeof this.config.component}`);
    console.log(`[Bootstrap/mount]    props:`, this.config.props);

    this._componentElement = this.config.component(this.config.props);

    console.log(`[Bootstrap/mount] 5. Component call returned:`, this._componentElement);
    console.log(`[Bootstrap/mount]    result type: ${typeof this._componentElement}`);
    console.log(`[Bootstrap/mount]    result nodeType: ${this._componentElement?.nodeType}`);
    console.log(`[Bootstrap/mount]    result tagName: ${this._componentElement?.tagName}`);

    // Wrap with wrapper component if provided
    let elementToMount = this._componentElement;
    if (this.config.wrapper) {
      console.log('[Bootstrap/mount] 6. Applying wrapper...');
      elementToMount = this.config.wrapper({
        children: this._componentElement,
      });
    }

    // Mount to DOM
    console.log('[Bootstrap/mount] 7. Clearing root innerHTML...');
    this._rootElement.innerHTML = '';
    console.log('[Bootstrap/mount] 8. Appending element to root...');
    console.log(`[Bootstrap/mount]    element to append:`, elementToMount);
    this._rootElement.appendChild(elementToMount);
    console.log('[Bootstrap/mount] 9. ✅ appendChild succeeded!');

    this._isMounted = true;

    // Call onMount callback
    if (this.config.onMount) {
      console.log('[Bootstrap/mount] 10. Calling onMount callback...');
      this.config.onMount(this._componentElement);
    }

    console.log('[Bootstrap] Application mounted successfully');
  } catch (error) {
    const err = error as Error;
    console.error('[Bootstrap] Mount failed:', err);
    if (this.config.onError) {
      this.config.onError(err);
    } else {
      throw err;
    }
  }
};
