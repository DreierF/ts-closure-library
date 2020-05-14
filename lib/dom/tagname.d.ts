/**
 * @fileoverview Defines the TagName class. Its constants enumerate
 * all HTML tag names specified in either the W3C HTML 4.01 index of elements
 * or the HTML5.1 specification.
 *
 * References:
 * https://www.w3.org/TR/html401/index/elements.html
 * https://www.w3.org/TR/html51/dom.html#elements
 */
/**
 * A tag name with the type of the element stored in the generic.
 * @template T
 */
export class TagName<T> {
    /**
     * A tag name with the type of the element stored in the generic.
     * @param {string} tagName
     * @template T
     */
    constructor(tagName: string);
    /** @private {string} */
    private tagName_;
    /**
     * Returns the tag name.
     * @return {string}
     * @override
     */
    toString(): string;
}
export namespace TagName {
    export const A: TagName<HTMLAnchorElement>;
    export const ABBR: TagName<HtmlElement>;
    export const ACRONYM: TagName<HtmlElement>;
    export const ADDRESS: TagName<HtmlElement>;
    export const APPLET: TagName<HTMLAppletElement>;
    export const AREA: TagName<HTMLAreaElement>;
    export const ARTICLE: TagName<HtmlElement>;
    export const ASIDE: TagName<HtmlElement>;
    export const AUDIO: TagName<HTMLAudioElement>;
    export const B: TagName<HtmlElement>;
    export const BASE: TagName<HTMLBaseElement>;
    export const BASEFONT: TagName<HTMLBaseFontElement>;
    export const BDI: TagName<HtmlElement>;
    export const BDO: TagName<HtmlElement>;
    export const BIG: TagName<HtmlElement>;
    export const BLOCKQUOTE: TagName<HTMLQuoteElement>;
    export const BODY: TagName<HTMLBodyElement>;
    export const BR: TagName<HTMLBRElement>;
    export const BUTTON: TagName<HTMLButtonElement>;
    export const CANVAS: TagName<HTMLCanvasElement>;
    export const CAPTION: TagName<HTMLTableCaptionElement>;
    export const CENTER: TagName<HtmlElement>;
    export const CITE: TagName<HtmlElement>;
    export const CODE: TagName<HtmlElement>;
    export const COL: TagName<HTMLTableColElement>;
    export const COLGROUP: TagName<HTMLTableColElement>;
    export const COMMAND: TagName<HtmlElement>;
    export const DATA: TagName<HtmlElement>;
    export const DATALIST: TagName<HTMLDataListElement>;
    export const DD: TagName<HtmlElement>;
    export const DEL: TagName<HTMLModElement>;
    export const DETAILS: TagName<HTMLDetailsElement>;
    export const DFN: TagName<HtmlElement>;
    export const DIALOG: TagName<HTMLDialogElement>;
    export const DIR: TagName<HTMLDirectoryElement>;
    export const DIV: TagName<HTMLDivElement>;
    export const DL: TagName<HTMLDListElement>;
    export const DT: TagName<HtmlElement>;
    export const EM: TagName<HtmlElement>;
    export const EMBED: TagName<HTMLEmbedElement>;
    export const FIELDSET: TagName<HTMLFieldSetElement>;
    export const FIGCAPTION: TagName<HtmlElement>;
    export const FIGURE: TagName<HtmlElement>;
    export const FONT: TagName<HTMLFontElement>;
    export const FOOTER: TagName<HtmlElement>;
    export const FORM: TagName<HTMLFormElement>;
    export const FRAME: TagName<HTMLFrameElement>;
    export const FRAMESET: TagName<HTMLFrameSetElement>;
    export const H1: TagName<HTMLHeadingElement>;
    export const H2: TagName<HTMLHeadingElement>;
    export const H3: TagName<HTMLHeadingElement>;
    export const H4: TagName<HTMLHeadingElement>;
    export const H5: TagName<HTMLHeadingElement>;
    export const H6: TagName<HTMLHeadingElement>;
    export const HEAD: TagName<HTMLHeadElement>;
    export const HEADER: TagName<HtmlElement>;
    export const HGROUP: TagName<HtmlElement>;
    export const HR: TagName<HTMLHRElement>;
    export const HTML: TagName<HTMLHtmlElement>;
    export const I: TagName<HtmlElement>;
    export const IFRAME: TagName<HTMLIFrameElement>;
    export const IMG: TagName<HTMLImageElement>;
    export const INPUT: TagName<HTMLInputElement>;
    export const INS: TagName<HTMLModElement>;
    export const ISINDEX: TagName<any>;
    export const KBD: TagName<HtmlElement>;
    export const KEYGEN: TagName<HtmlElement>;
    export const LABEL: TagName<HTMLLabelElement>;
    export const LEGEND: TagName<HTMLLegendElement>;
    export const LI: TagName<HTMLLIElement>;
    export const LINK: TagName<HTMLLinkElement>;
    export const MAIN: TagName<HtmlElement>;
    export const MAP: TagName<HTMLMapElement>;
    export const MARK: TagName<HtmlElement>;
    export const MATH: TagName<HtmlElement>;
    export const MENU: TagName<HTMLMenuElement>;
    export const MENUITEM: TagName<any>;
    export const META: TagName<HTMLMetaElement>;
    export const METER: TagName<HTMLMeterElement>;
    export const NAV: TagName<HtmlElement>;
    export const NOFRAMES: TagName<HtmlElement>;
    export const NOSCRIPT: TagName<HtmlElement>;
    export const OBJECT: TagName<HTMLObjectElement>;
    export const OL: TagName<HTMLOListElement>;
    export const OPTGROUP: TagName<HTMLOptGroupElement>;
    export const OPTION: TagName<HTMLOptionElement>;
    export const OUTPUT: TagName<HTMLOutputElement>;
    export const P: TagName<HTMLParagraphElement>;
    export const PARAM: TagName<HTMLParamElement>;
    export const PICTURE: TagName<HTMLPictureElement>;
    export const PRE: TagName<HTMLPreElement>;
    export const PROGRESS: TagName<HTMLProgressElement>;
    export const Q: TagName<HTMLQuoteElement>;
    export const RP: TagName<HtmlElement>;
    export const RT: TagName<HtmlElement>;
    export const RTC: TagName<HtmlElement>;
    export const RUBY: TagName<HtmlElement>;
    export const S: TagName<HtmlElement>;
    export const SAMP: TagName<HtmlElement>;
    export const SCRIPT: TagName<HTMLScriptElement>;
    export const SECTION: TagName<HtmlElement>;
    export const SELECT: TagName<HTMLSelectElement>;
    export const SMALL: TagName<HtmlElement>;
    export const SOURCE: TagName<HTMLSourceElement>;
    export const SPAN: TagName<HTMLSpanElement>;
    export const STRIKE: TagName<HtmlElement>;
    export const STRONG: TagName<HtmlElement>;
    export const STYLE: TagName<HTMLStyleElement>;
    export const SUB: TagName<HtmlElement>;
    export const SUMMARY: TagName<HtmlElement>;
    export const SUP: TagName<HtmlElement>;
    export const SVG: TagName<HtmlElement>;
    export const TABLE: TagName<HTMLTableElement>;
    export const TBODY: TagName<HTMLTableSectionElement>;
    export const TD: TagName<HTMLTableCellElement>;
    export const TEMPLATE: TagName<HTMLTemplateElement>;
    export const TEXTAREA: TagName<HTMLTextAreaElement>;
    export const TFOOT: TagName<HTMLTableSectionElement>;
    export const TH: TagName<HTMLTableCellElement>;
    export const THEAD: TagName<HTMLTableSectionElement>;
    export const TIME: TagName<HtmlElement>;
    export const TITLE: TagName<HTMLTitleElement>;
    export const TR: TagName<HTMLTableRowElement>;
    export const TRACK: TagName<HTMLTrackElement>;
    export const TT: TagName<HtmlElement>;
    export const U: TagName<HtmlElement>;
    export const UL: TagName<HTMLUListElement>;
    export const VAR: TagName<HtmlElement>;
    export const VIDEO: TagName<HTMLVideoElement>;
    export const WBR: TagName<HtmlElement>;
}
import { HtmlElement } from "./htmlelement.js";
