/**
 * Pulsar JSX type definitions
 * Enables TSX syntax support in Pulsar components
 */

declare namespace JSX {
  export type Element = HTMLElement;
  export type Child = HTMLElement | string | number | boolean | null | undefined;
  export type Children = Child | Child[];
  export type Key = string | number;

  // Helper type for element props with children, key, and className support
  type ElementProps<T> = Partial<Omit<T, 'children' | 'className'>> & {
    children?: Children;
    key?: Key;
    className?: string;
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
    children: {};
  }
}
