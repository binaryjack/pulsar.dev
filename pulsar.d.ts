/**
 * Pulsar JSX type definitions
 * Enables TSX syntax support in Pulsar components
 */

declare namespace JSX {
  export type Element = HTMLElement;
  export type Child = HTMLElement | string | number | boolean | null | undefined;
  export type Children = Child | Child[];
  export type Key = string | number;

  // Ref type for element references
  export interface Ref<T> {
    current: T;
  }

  // Event handler type
  export type EventHandler<E extends Event = Event> = (event: E) => void;

  // Helper type for element props with children, key, and className support
  type ElementProps<T> = Partial<Omit<T, 'children' | 'className' | 'style'>> & {
    children?: Children;
    key?: Key;
    class?: string;
    className?: string;
    style?: string | Partial<CSSStyleDeclaration> | Record<string, string | number> | null;
    ref?: Ref<T | null> | ((el: T | null) => void);

    // Event handlers - support both lowercase (DOM standard) and camelCase (React-style)
    // Prefer lowercase for consistency with DOM API
    onclick?: EventHandler<MouseEvent>;
    onClick?: EventHandler<MouseEvent>;
    onchange?: EventHandler<Event>;
    onChange?: EventHandler<Event>;
    oninput?: EventHandler<InputEvent>;
    onInput?: EventHandler<InputEvent>;
    onsubmit?: EventHandler<SubmitEvent>;
    onSubmit?: EventHandler<SubmitEvent>;
    onkeydown?: EventHandler<KeyboardEvent>;
    onKeyDown?: EventHandler<KeyboardEvent>;
    onkeyup?: EventHandler<KeyboardEvent>;
    onKeyUp?: EventHandler<KeyboardEvent>;
    onkeypress?: EventHandler<KeyboardEvent>;
    onKeyPress?: EventHandler<KeyboardEvent>;
    onfocus?: EventHandler<FocusEvent>;
    onFocus?: EventHandler<FocusEvent>;
    onblur?: EventHandler<FocusEvent>;
    onBlur?: EventHandler<FocusEvent>;
    onmouseenter?: EventHandler<MouseEvent>;
    onMouseEnter?: EventHandler<MouseEvent>;
    onmouseleave?: EventHandler<MouseEvent>;
    onMouseLeave?: EventHandler<MouseEvent>;
    onmouseover?: EventHandler<MouseEvent>;
    onMouseOver?: EventHandler<MouseEvent>;
    onmouseout?: EventHandler<MouseEvent>;
    onMouseOut?: EventHandler<MouseEvent>;
    onmousemove?: EventHandler<MouseEvent>;
    onMouseMove?: EventHandler<MouseEvent>;
    onmousedown?: EventHandler<MouseEvent>;
    onMouseDown?: EventHandler<MouseEvent>;
    onmouseup?: EventHandler<MouseEvent>;
    onMouseUp?: EventHandler<MouseEvent>;
  };

  interface IntrinsicElements {
    // HTML Elements
    a: ElementProps<HTMLAnchorElement>;
    abbr: ElementProps<HTMLElement>;
    address: ElementProps<HTMLElement>;
    area: ElementProps<HTMLAreaElement>;
    article: ElementProps<HTMLElement>;
    aside: ElementProps<HTMLElement>;
    audio: ElementProps<HTMLAudioElement>;
    b: ElementProps<HTMLElement>;
    base: ElementProps<HTMLBaseElement>;
    bdi: ElementProps<HTMLElement>;
    bdo: ElementProps<HTMLElement>;
    blockquote: ElementProps<HTMLQuoteElement>;
    body: ElementProps<HTMLBodyElement>;
    br: ElementProps<HTMLBRElement>;
    button: ElementProps<HTMLButtonElement>;
    canvas: ElementProps<HTMLCanvasElement>;
    caption: ElementProps<HTMLTableCaptionElement>;
    cite: ElementProps<HTMLElement>;
    code: ElementProps<HTMLElement>;
    col: ElementProps<HTMLTableColElement>;
    colgroup: ElementProps<HTMLTableColElement>;
    data: ElementProps<HTMLDataElement>;
    datalist: ElementProps<HTMLDataListElement>;
    dd: ElementProps<HTMLElement>;
    del: ElementProps<HTMLModElement>;
    details: ElementProps<HTMLDetailsElement>;
    dfn: ElementProps<HTMLElement>;
    dialog: ElementProps<HTMLDialogElement>;
    div: ElementProps<HTMLDivElement>;
    dl: ElementProps<HTMLDListElement>;
    dt: ElementProps<HTMLElement>;
    em: ElementProps<HTMLElement>;
    embed: ElementProps<HTMLEmbedElement>;
    fieldset: ElementProps<HTMLFieldSetElement>;
    figcaption: ElementProps<HTMLElement>;
    figure: ElementProps<HTMLElement>;
    footer: ElementProps<HTMLElement>;
    form: ElementProps<HTMLFormElement>;
    h1: ElementProps<HTMLHeadingElement>;
    h2: ElementProps<HTMLHeadingElement>;
    h3: ElementProps<HTMLHeadingElement>;
    h4: ElementProps<HTMLHeadingElement>;
    h5: ElementProps<HTMLHeadingElement>;
    h6: ElementProps<HTMLHeadingElement>;
    head: ElementProps<HTMLHeadElement>;
    header: ElementProps<HTMLElement>;
    hgroup: ElementProps<HTMLElement>;
    hr: ElementProps<HTMLHRElement>;
    html: ElementProps<HTMLHtmlElement>;
    i: ElementProps<HTMLElement>;
    iframe: ElementProps<HTMLIFrameElement>;
    img: ElementProps<HTMLImageElement>;
    input: Partial<Omit<HTMLInputElement, 'children' | 'value' | 'defaultValue' | 'className'>> & {
      children?: Children;
      value?: string | number;
      defaultValue?: string | number;
      key?: Key;
      className?: string;
    };
    ins: ElementProps<HTMLModElement>;
    kbd: ElementProps<HTMLElement>;
    label: ElementProps<HTMLLabelElement>;
    legend: ElementProps<HTMLLegendElement>;
    li: ElementProps<HTMLLIElement>;
    link: ElementProps<HTMLLinkElement>;
    main: ElementProps<HTMLElement>;
    map: ElementProps<HTMLMapElement>;
    mark: ElementProps<HTMLElement>;
    meta: ElementProps<HTMLMetaElement>;
    meter: ElementProps<HTMLMeterElement>;
    nav: ElementProps<HTMLElement>;
    noscript: ElementProps<HTMLElement>;
    object: ElementProps<HTMLObjectElement>;
    ol: ElementProps<HTMLOListElement>;
    optgroup: ElementProps<HTMLOptGroupElement>;
    option: ElementProps<HTMLOptionElement>;
    output: ElementProps<HTMLOutputElement>;
    p: ElementProps<HTMLParagraphElement>;
    picture: ElementProps<HTMLPictureElement>;
    pre: ElementProps<HTMLPreElement>;
    progress: ElementProps<HTMLProgressElement>;
    q: ElementProps<HTMLQuoteElement>;
    rp: ElementProps<HTMLElement>;
    rt: ElementProps<HTMLElement>;
    ruby: ElementProps<HTMLElement>;
    s: ElementProps<HTMLElement>;
    samp: ElementProps<HTMLElement>;
    script: ElementProps<HTMLScriptElement>;
    section: ElementProps<HTMLElement>;
    select: ElementProps<HTMLSelectElement>;
    slot: ElementProps<HTMLSlotElement>;
    small: ElementProps<HTMLElement>;
    source: ElementProps<HTMLSourceElement>;
    span: ElementProps<HTMLSpanElement>;
    strong: ElementProps<HTMLElement>;
    style: ElementProps<HTMLStyleElement>;
    sub: ElementProps<HTMLElement>;
    summary: ElementProps<HTMLElement>;
    sup: ElementProps<HTMLElement>;
    table: ElementProps<HTMLTableElement>;
    tbody: ElementProps<HTMLTableSectionElement>;
    td: ElementProps<HTMLTableCellElement>;
    template: ElementProps<HTMLTemplateElement>;
    textarea: ElementProps<HTMLTextAreaElement>;
    tfoot: ElementProps<HTMLTableSectionElement>;
    th: ElementProps<HTMLTableCellElement>;
    thead: ElementProps<HTMLTableSectionElement>;
    time: ElementProps<HTMLTimeElement>;
    title: ElementProps<HTMLTitleElement>;
    tr: ElementProps<HTMLTableRowElement>;
    track: ElementProps<HTMLTrackElement>;
    u: ElementProps<HTMLElement>;
    ul: ElementProps<HTMLUListElement>;
    var: ElementProps<HTMLElement>;
    video: ElementProps<HTMLVideoElement>;
    wbr: ElementProps<HTMLElement>;
  }

  interface ElementChildrenAttribute {
    children: Children;
  }
}
