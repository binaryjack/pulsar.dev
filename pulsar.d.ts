/**
 * Pulsar JSX type definitions
 * Enables TSX syntax support in Pulsar components
 */

declare namespace JSX {
  type Element = HTMLElement;
  type Child = HTMLElement | string | number | boolean | null | undefined;
  type Children = Child | Child[];

  interface IntrinsicElements {
    // HTML Elements
    a: Partial<Omit<HTMLAnchorElement, 'children'>> & { children?: Children };
    abbr: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    address: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    area: Partial<Omit<HTMLAreaElement, 'children'>> & { children?: Children };
    article: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    aside: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    audio: Partial<Omit<HTMLAudioElement, 'children'>> & { children?: Children };
    b: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    base: Partial<Omit<HTMLBaseElement, 'children'>> & { children?: Children };
    bdi: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    bdo: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    blockquote: Partial<Omit<HTMLQuoteElement, 'children'>> & { children?: Children };
    body: Partial<Omit<HTMLBodyElement, 'children'>> & { children?: Children };
    br: Partial<Omit<HTMLBRElement, 'children'>> & { children?: Children };
    button: Partial<Omit<HTMLButtonElement, 'children'>> & { children?: Children };
    canvas: Partial<Omit<HTMLCanvasElement, 'children'>> & { children?: Children };
    caption: Partial<Omit<HTMLTableCaptionElement, 'children'>> & { children?: Children };
    cite: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    code: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    col: Partial<Omit<HTMLTableColElement, 'children'>> & { children?: Children };
    colgroup: Partial<Omit<HTMLTableColElement, 'children'>> & { children?: Children };
    data: Partial<Omit<HTMLDataElement, 'children'>> & { children?: Children };
    datalist: Partial<Omit<HTMLDataListElement, 'children'>> & { children?: Children };
    dd: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    del: Partial<Omit<HTMLModElement, 'children'>> & { children?: Children };
    details: Partial<Omit<HTMLDetailsElement, 'children'>> & { children?: Children };
    dfn: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    dialog: Partial<Omit<HTMLDialogElement, 'children'>> & { children?: Children };
    div: Partial<Omit<HTMLDivElement, 'children'>> & { children?: Children };
    dl: Partial<Omit<HTMLDListElement, 'children'>> & { children?: Children };
    dt: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    em: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    embed: Partial<Omit<HTMLEmbedElement, 'children'>> & { children?: Children };
    fieldset: Partial<Omit<HTMLFieldSetElement, 'children'>> & { children?: Children };
    figcaption: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    figure: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    footer: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    form: Partial<Omit<HTMLFormElement, 'children'>> & { children?: Children };
    h1: Partial<Omit<HTMLHeadingElement, 'children'>> & { children?: Children };
    h2: Partial<Omit<HTMLHeadingElement, 'children'>> & { children?: Children };
    h3: Partial<Omit<HTMLHeadingElement, 'children'>> & { children?: Children };
    h4: Partial<Omit<HTMLHeadingElement, 'children'>> & { children?: Children };
    h5: Partial<Omit<HTMLHeadingElement, 'children'>> & { children?: Children };
    h6: Partial<Omit<HTMLHeadingElement, 'children'>> & { children?: Children };
    head: Partial<Omit<HTMLHeadElement, 'children'>> & { children?: Children };
    header: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    hgroup: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    hr: Partial<Omit<HTMLHRElement, 'children'>> & { children?: Children };
    html: Partial<Omit<HTMLHtmlElement, 'children'>> & { children?: Children };
    i: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    iframe: Partial<Omit<HTMLIFrameElement, 'children'>> & { children?: Children };
    img: Partial<Omit<HTMLImageElement, 'children'>> & { children?: Children };
    input: Partial<Omit<HTMLInputElement, 'children' | 'value' | 'defaultValue'>> & {
      children?: Children;
      value?: string | number;
      defaultValue?: string | number;
    };
    ins: Partial<Omit<HTMLModElement, 'children'>> & { children?: Children };
    kbd: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    label: Partial<Omit<HTMLLabelElement, 'children'>> & { children?: Children };
    legend: Partial<Omit<HTMLLegendElement, 'children'>> & { children?: Children };
    li: Partial<Omit<HTMLLIElement, 'children'>> & { children?: Children };
    link: Partial<Omit<HTMLLinkElement, 'children'>> & { children?: Children };
    main: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    map: Partial<Omit<HTMLMapElement, 'children'>> & { children?: Children };
    mark: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    meta: Partial<Omit<HTMLMetaElement, 'children'>> & { children?: Children };
    meter: Partial<Omit<HTMLMeterElement, 'children'>> & { children?: Children };
    nav: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    noscript: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    object: Partial<Omit<HTMLObjectElement, 'children'>> & { children?: Children };
    ol: Partial<Omit<HTMLOListElement, 'children'>> & { children?: Children };
    optgroup: Partial<Omit<HTMLOptGroupElement, 'children'>> & { children?: Children };
    option: Partial<Omit<HTMLOptionElement, 'children'>> & { children?: Children };
    output: Partial<Omit<HTMLOutputElement, 'children'>> & { children?: Children };
    p: Partial<Omit<HTMLParagraphElement, 'children'>> & { children?: Children };
    picture: Partial<Omit<HTMLPictureElement, 'children'>> & { children?: Children };
    pre: Partial<Omit<HTMLPreElement, 'children'>> & { children?: Children };
    progress: Partial<Omit<HTMLProgressElement, 'children'>> & { children?: Children };
    q: Partial<Omit<HTMLQuoteElement, 'children'>> & { children?: Children };
    rp: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    rt: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    ruby: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    s: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    samp: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    script: Partial<Omit<HTMLScriptElement, 'children'>> & { children?: Children };
    section: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    select: Partial<Omit<HTMLSelectElement, 'children'>> & { children?: Children };
    slot: Partial<Omit<HTMLSlotElement, 'children'>> & { children?: Children };
    small: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    source: Partial<Omit<HTMLSourceElement, 'children'>> & { children?: Children };
    span: Partial<Omit<HTMLSpanElement, 'children'>> & { children?: Children };
    strong: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    style: Partial<Omit<HTMLStyleElement, 'children'>> & { children?: Children };
    sub: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    summary: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    sup: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    table: Partial<Omit<HTMLTableElement, 'children'>> & { children?: Children };
    tbody: Partial<Omit<HTMLTableSectionElement, 'children'>> & { children?: Children };
    td: Partial<Omit<HTMLTableCellElement, 'children'>> & { children?: Children };
    template: Partial<Omit<HTMLTemplateElement, 'children'>> & { children?: Children };
    textarea: Partial<Omit<HTMLTextAreaElement, 'children'>> & { children?: Children };
    tfoot: Partial<Omit<HTMLTableSectionElement, 'children'>> & { children?: Children };
    th: Partial<Omit<HTMLTableCellElement, 'children'>> & { children?: Children };
    thead: Partial<Omit<HTMLTableSectionElement, 'children'>> & { children?: Children };
    time: Partial<Omit<HTMLTimeElement, 'children'>> & { children?: Children };
    title: Partial<Omit<HTMLTitleElement, 'children'>> & { children?: Children };
    tr: Partial<Omit<HTMLTableRowElement, 'children'>> & { children?: Children };
    track: Partial<Omit<HTMLTrackElement, 'children'>> & { children?: Children };
    u: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    ul: Partial<Omit<HTMLUListElement, 'children'>> & { children?: Children };
    var: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    video: Partial<Omit<HTMLVideoElement, 'children'>> & { children?: Children };
    wbr: Partial<Omit<HTMLElement, 'children'>> & { children?: Children };
    tfoot: Partial<HTMLTableSectionElement>;
    th: Partial<HTMLTableCellElement>;
    thead: Partial<HTMLTableSectionElement>;
    time: Partial<HTMLTimeElement>;
    title: Partial<HTMLTitleElement>;
    tr: Partial<HTMLTableRowElement>;
    track: Partial<HTMLTrackElement>;
    u: Partial<HTMLElement>;
    ul: Partial<HTMLUListElement>;
    var: Partial<HTMLElement>;
    video: Partial<HTMLVideoElement>;
    wbr: Partial<HTMLElement>;
  }

  interface ElementChildrenAttribute {
    children: {};
  }
}
