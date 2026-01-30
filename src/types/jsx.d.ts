/**
 * Custom JSX type definitions for Visual Schema Builder
 * This allows .tsx files without requiring @types/react
 */

// Event types with proper target typing
declare global {
  interface PSREvent<T = EventTarget> extends Event {
    currentTarget: T;
    target: T;
  }

  interface PSRChangeEvent<T = HTMLElement> extends PSREvent<T> {
    target: T & { value: string };
    currentTarget: T & { value: string };
  }

  interface PSRInputEvent<T = HTMLElement> extends PSREvent<T> {
    target: T & { value: string };
    currentTarget: T & { value: string };
  }

  interface PSRMouseEvent<T = HTMLElement> extends MouseEvent {
    currentTarget: T;
    target: T;
  }

  interface PSRKeyboardEvent<T = HTMLElement> extends KeyboardEvent {
    currentTarget: T;
    target: T;
  }

  interface PSRFocusEvent<T = HTMLElement> extends FocusEvent {
    currentTarget: T;
    target: T;
  }
}

declare namespace JSX {
  // Intrinsic elements - HTML tags
  interface IntrinsicElements {
    // HTML Elements
    a: HTMLAttributes<HTMLAnchorElement>;
    abbr: HTMLAttributes<HTMLElement>;
    address: HTMLAttributes<HTMLElement>;
    area: HTMLAttributes<HTMLAreaElement>;
    article: HTMLAttributes<HTMLElement>;
    aside: HTMLAttributes<HTMLElement>;
    audio: HTMLAttributes<HTMLAudioElement>;
    b: HTMLAttributes<HTMLElement>;
    base: HTMLAttributes<HTMLBaseElement>;
    bdi: HTMLAttributes<HTMLElement>;
    bdo: HTMLAttributes<HTMLElement>;
    blockquote: HTMLAttributes<HTMLQuoteElement>;
    body: HTMLAttributes<HTMLBodyElement>;
    br: HTMLAttributes<HTMLBRElement>;
    button: HTMLAttributes<HTMLButtonElement>;
    canvas: HTMLAttributes<HTMLCanvasElement>;
    caption: HTMLAttributes<HTMLTableCaptionElement>;
    cite: HTMLAttributes<HTMLElement>;
    code: HTMLAttributes<HTMLElement>;
    col: HTMLAttributes<HTMLTableColElement>;
    colgroup: HTMLAttributes<HTMLTableColElement>;
    data: HTMLAttributes<HTMLDataElement>;
    datalist: HTMLAttributes<HTMLDataListElement>;
    dd: HTMLAttributes<HTMLElement>;
    del: HTMLAttributes<HTMLModElement>;
    details: HTMLAttributes<HTMLDetailsElement>;
    dfn: HTMLAttributes<HTMLElement>;
    dialog: HTMLAttributes<HTMLDialogElement>;
    div: HTMLAttributes<HTMLDivElement>;
    dl: HTMLAttributes<HTMLDListElement>;
    dt: HTMLAttributes<HTMLElement>;
    em: HTMLAttributes<HTMLElement>;
    embed: HTMLAttributes<HTMLEmbedElement>;
    fieldset: HTMLAttributes<HTMLFieldSetElement>;
    figcaption: HTMLAttributes<HTMLElement>;
    figure: HTMLAttributes<HTMLElement>;
    footer: HTMLAttributes<HTMLElement>;
    form: HTMLAttributes<HTMLFormElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    h4: HTMLAttributes<HTMLHeadingElement>;
    h5: HTMLAttributes<HTMLHeadingElement>;
    h6: HTMLAttributes<HTMLHeadingElement>;
    head: HTMLAttributes<HTMLHeadElement>;
    header: HTMLAttributes<HTMLElement>;
    hgroup: HTMLAttributes<HTMLElement>;
    hr: HTMLAttributes<HTMLHRElement>;
    html: HTMLAttributes<HTMLHtmlElement>;
    i: HTMLAttributes<HTMLElement>;
    iframe: HTMLAttributes<HTMLIFrameElement>;
    img: HTMLAttributes<HTMLImageElement>;
    input: HTMLAttributes<HTMLInputElement>;
    ins: HTMLAttributes<HTMLModElement>;
    kbd: HTMLAttributes<HTMLElement>;
    label: HTMLAttributes<HTMLLabelElement>;
    legend: HTMLAttributes<HTMLLegendElement>;
    li: HTMLAttributes<HTMLLIElement>;
    link: HTMLAttributes<HTMLLinkElement>;
    main: HTMLAttributes<HTMLElement>;
    map: HTMLAttributes<HTMLMapElement>;
    mark: HTMLAttributes<HTMLElement>;
    meta: HTMLAttributes<HTMLMetaElement>;
    meter: HTMLAttributes<HTMLMeterElement>;
    nav: HTMLAttributes<HTMLElement>;
    noscript: HTMLAttributes<HTMLElement>;
    object: HTMLAttributes<HTMLObjectElement>;
    ol: HTMLAttributes<HTMLOListElement>;
    optgroup: HTMLAttributes<HTMLOptGroupElement>;
    option: HTMLAttributes<HTMLOptionElement>;
    output: HTMLAttributes<HTMLOutputElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    param: HTMLAttributes<HTMLParamElement>;
    picture: HTMLAttributes<HTMLElement>;
    pre: HTMLAttributes<HTMLPreElement>;
    progress: HTMLAttributes<HTMLProgressElement>;
    q: HTMLAttributes<HTMLQuoteElement>;
    rp: HTMLAttributes<HTMLElement>;
    rt: HTMLAttributes<HTMLElement>;
    ruby: HTMLAttributes<HTMLElement>;
    s: HTMLAttributes<HTMLElement>;
    samp: HTMLAttributes<HTMLElement>;
    script: HTMLAttributes<HTMLScriptElement>;
    section: HTMLAttributes<HTMLElement>;
    select: HTMLAttributes<HTMLSelectElement>;
    slot: HTMLAttributes<HTMLSlotElement>;
    small: HTMLAttributes<HTMLElement>;
    source: HTMLAttributes<HTMLSourceElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    strong: HTMLAttributes<HTMLElement>;
    style: HTMLAttributes<HTMLStyleElement>;
    sub: HTMLAttributes<HTMLElement>;
    summary: HTMLAttributes<HTMLElement>;
    sup: HTMLAttributes<HTMLElement>;
    table: HTMLAttributes<HTMLTableElement>;
    tbody: HTMLAttributes<HTMLTableSectionElement>;
    td: HTMLAttributes<HTMLTableCellElement>;
    template: HTMLAttributes<HTMLTemplateElement>;
    textarea: HTMLAttributes<HTMLTextAreaElement>;
    tfoot: HTMLAttributes<HTMLTableSectionElement>;
    th: HTMLAttributes<HTMLTableCellElement>;
    thead: HTMLAttributes<HTMLTableSectionElement>;
    time: HTMLAttributes<HTMLTimeElement>;
    title: HTMLAttributes<HTMLTitleElement>;
    tr: HTMLAttributes<HTMLTableRowElement>;
    track: HTMLAttributes<HTMLTrackElement>;
    u: HTMLAttributes<HTMLElement>;
    ul: HTMLAttributes<HTMLUListElement>;
    var: HTMLAttributes<HTMLElement>;
    video: HTMLAttributes<HTMLVideoElement>;
    wbr: HTMLAttributes<HTMLElement>;

    // SVG Elements
    svg: SVGAttributes<SVGSVGElement>;
    path: SVGAttributes<SVGPathElement>;
    circle: SVGAttributes<SVGCircleElement>;
    rect: SVGAttributes<SVGRectElement>;
    line: SVGAttributes<SVGLineElement>;
    polyline: SVGAttributes<SVGPolylineElement>;
    polygon: SVGAttributes<SVGPolygonElement>;
    ellipse: SVGAttributes<SVGEllipseElement>;
    g: SVGAttributes<SVGGElement>;
    defs: SVGAttributes<SVGDefsElement>;
    clipPath: SVGAttributes<SVGClipPathElement>;
    mask: SVGAttributes<SVGMaskElement>;
    linearGradient: SVGAttributes<SVGLinearGradientElement>;
    radialGradient: SVGAttributes<SVGRadialGradientElement>;
    stop: SVGAttributes<SVGStopElement>;
    text: SVGAttributes<SVGTextElement>;
    tspan: SVGAttributes<SVGTSpanElement>;
  }

  // SVG Attribute types
  interface SVGAttributes<T = SVGElement> extends HTMLAttributes<T> {
    // SVG-specific attributes
    d?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    'stroke-width'?: string | number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    'stroke-linecap'?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
    'stroke-linejoin'?: 'miter' | 'round' | 'bevel';
    strokeDasharray?: string | number;
    'stroke-dasharray'?: string | number;
    strokeDashoffset?: string | number;
    'stroke-dashoffset'?: string | number;
    fillOpacity?: string | number;
    'fill-opacity'?: string | number;
    strokeOpacity?: string | number;
    'stroke-opacity'?: string | number;
    opacity?: string | number;
    viewBox?: string;
    xmlns?: string;
    x?: string | number;
    y?: string | number;
    x1?: string | number;
    y1?: string | number;
    x2?: string | number;
    y2?: string | number;
    cx?: string | number;
    cy?: string | number;
    r?: string | number;
    rx?: string | number;
    ry?: string | number;
    points?: string;
    transform?: string;
    preserveAspectRatio?: string;
    offset?: string | number;
    stopColor?: string;
    'stop-color'?: string;
    stopOpacity?: string | number;
    'stop-opacity'?: string | number;
  }

  // Element type - what JSX expressions evaluate to
  type Element = any;

  // Attribute types
  interface HTMLAttributes<T = HTMLElement> {
    // Children
    children?: any;

    // Special React-like attributes
    key?: string | number | null;

    // Standard HTML Attributes
    accessKey?: string | null;
    className?: string | null;
    contentEditable?: boolean | string | null;
    dir?: string | null;
    draggable?: boolean | null;
    hidden?: boolean | null;
    id?: string | null;
    lang?: string | null;
    spellcheck?: boolean | null;
    style?: string | Partial<CSSStyleDeclaration> | null;
    tabIndex?: number | null;
    title?: string | null;
    translate?: boolean | string | null;

    // ARIA attributes (kebab-case)
    role?: string | null;
    'aria-label'?: string | null;
    'aria-labelledby'?: string | null;
    'aria-describedby'?: string | null;
    'aria-hidden'?: boolean | string | null;
    'aria-expanded'?: boolean | string | null;
    'aria-controls'?: string | null;
    'aria-live'?: string | null;
    'aria-atomic'?: boolean | string | null;
    'aria-relevant'?: string | null;
    'aria-busy'?: boolean | string | null;
    'aria-disabled'?: boolean | string | null;
    'aria-selected'?: boolean | string | null;

    // ARIA attributes (camelCase alternatives)
    ariaLabel?: string | null;
    ariaLabelledby?: string | null;
    ariaDescribedby?: string | null;
    ariaHidden?: boolean | string | null;
    ariaExpanded?: boolean | string | null;
    ariaControls?: string | null;
    ariaLive?: string | null;
    ariaAtomic?: boolean | string | null;
    ariaRelevant?: string | null;
    ariaBusy?: boolean | string | null;
    ariaDisabled?: boolean | string | null;
    ariaSelected?: boolean | string | null;

    // Event handlers (properly typed with generic T)
    onClick?: ((event: PSRMouseEvent<T>) => void) | null;
    onclick?: ((event: PSRMouseEvent<T>) => void) | null;
    onDblClick?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseDown?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseUp?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseMove?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseEnter?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseLeave?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseOver?: ((event: PSRMouseEvent<T>) => void) | null;
    onMouseOut?: ((event: PSRMouseEvent<T>) => void) | null;

    onKeyDown?: ((event: PSRKeyboardEvent<T>) => void) | null;
    onkeydown?: ((event: PSRKeyboardEvent<T>) => void) | null;
    onKeyUp?: ((event: PSRKeyboardEvent<T>) => void) | null;
    onKeyPress?: ((event: PSRKeyboardEvent<T>) => void) | null;

    onFocus?: ((event: PSRFocusEvent<T>) => void) | null;
    onBlur?: ((event: PSRFocusEvent<T>) => void) | null;

    onInput?: ((event: PSRInputEvent<T>) => void) | null;
    onChange?: ((event: PSRChangeEvent<T>) => void) | null;
    onSubmit?: ((event: PSREvent<T>) => void) | null;

    onScroll?: (event: PSREvent<T>) => void;
    onWheel?: (event: WheelEvent) => void;

    onTouchStart?: (event: TouchEvent) => void;
    onTouchMove?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
    onTouchCancel?: (event: TouchEvent) => void;

    onPointerDown?: (event: PointerEvent) => void;
    onPointerMove?: (event: PointerEvent) => void;
    onPointerUp?: (event: PointerEvent) => void;
    onPointerCancel?: (event: PointerEvent) => void;
    onPointerEnter?: (event: PointerEvent) => void;
    onPointerLeave?: (event: PointerEvent) => void;
    onPointerOver?: (event: PointerEvent) => void;
    onPointerOut?: (event: PointerEvent) => void;

    // Form-specific attributes
    disabled?: boolean | null;
    checked?: boolean | null;
    defaultChecked?: boolean | null;
    value?: string | number | null;
    defaultValue?: string | number | null;
    placeholder?: string | null;
    name?: string | null;
    type?: string | null;
    for?: string | null;
    htmlFor?: string | null;
    accept?: string | null;
    action?: string | null;
    method?: string | null;
    enctype?: string | null;
    autocomplete?: string | null;
    autofocus?: boolean | null;
    maxlength?: number | null;
    minlength?: number | null;
    max?: string | number | null;
    min?: string | number | null;
    multiple?: boolean | null;
    pattern?: string | null;
    readonly?: boolean | null;
    required?: boolean | null;
    step?: string | number | null;
    rows?: number | null;
    cols?: number | null;
    selected?: boolean | null;

    // Media attributes
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    loading?: 'eager' | 'lazy';

    // Link attributes
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    download?: string;

    // Data attributes (allow any data-* attribute)
    [key: `data-${string}`]: any;

    // Ref for DOM element access
    ref?: any;
  }

  // Element children can be various types
  type ElementChildrenAttribute = { children: {} };

  // Define Children type for compatibility with any valid child
  type Children = HTMLElement | HTMLElement[] | string | number | boolean | null | undefined | any;
}
