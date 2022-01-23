/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
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
    const A: TagName<HTMLAnchorElement>;
    const ABBR: TagName<HtmlElement>;
    const ACRONYM: TagName<HtmlElement>;
    const ADDRESS: TagName<HtmlElement>;
    const APPLET: TagName<HTMLAppletElement>;
    const AREA: TagName<HTMLAreaElement>;
    const ARTICLE: TagName<HtmlElement>;
    const ASIDE: TagName<HtmlElement>;
    const AUDIO: TagName<HTMLAudioElement>;
    const B: TagName<HtmlElement>;
    const BASE: TagName<HTMLBaseElement>;
    const BASEFONT: TagName<HTMLBaseFontElement>;
    const BDI: TagName<HtmlElement>;
    const BDO: TagName<HtmlElement>;
    const BIG: TagName<HtmlElement>;
    const BLOCKQUOTE: TagName<HTMLQuoteElement>;
    const BODY: TagName<HTMLBodyElement>;
    const BR: TagName<HTMLBRElement>;
    const BUTTON: TagName<HTMLButtonElement>;
    const CANVAS: TagName<HTMLCanvasElement>;
    const CAPTION: TagName<HTMLTableCaptionElement>;
    const CENTER: TagName<HtmlElement>;
    const CITE: TagName<HtmlElement>;
    const CODE: TagName<HtmlElement>;
    const COL: TagName<HTMLTableColElement>;
    const COLGROUP: TagName<HTMLTableColElement>;
    const COMMAND: TagName<HtmlElement>;
    const DATA: TagName<HtmlElement>;
    const DATALIST: TagName<HTMLDataListElement>;
    const DD: TagName<HtmlElement>;
    const DEL: TagName<HTMLModElement>;
    const DETAILS: TagName<HTMLDetailsElement>;
    const DFN: TagName<HtmlElement>;
    const DIALOG: TagName<HTMLDialogElement>;
    const DIR: TagName<HTMLDirectoryElement>;
    const DIV: TagName<HTMLDivElement>;
    const DL: TagName<HTMLDListElement>;
    const DT: TagName<HtmlElement>;
    const EM: TagName<HtmlElement>;
    const EMBED: TagName<HTMLEmbedElement>;
    const FIELDSET: TagName<HTMLFieldSetElement>;
    const FIGCAPTION: TagName<HtmlElement>;
    const FIGURE: TagName<HtmlElement>;
    const FONT: TagName<HTMLFontElement>;
    const FOOTER: TagName<HtmlElement>;
    const FORM: TagName<HTMLFormElement>;
    const FRAME: TagName<HTMLFrameElement>;
    const FRAMESET: TagName<HTMLFrameSetElement>;
    const H1: TagName<HTMLHeadingElement>;
    const H2: TagName<HTMLHeadingElement>;
    const H3: TagName<HTMLHeadingElement>;
    const H4: TagName<HTMLHeadingElement>;
    const H5: TagName<HTMLHeadingElement>;
    const H6: TagName<HTMLHeadingElement>;
    const HEAD: TagName<HTMLHeadElement>;
    const HEADER: TagName<HtmlElement>;
    const HGROUP: TagName<HtmlElement>;
    const HR: TagName<HTMLHRElement>;
    const HTML: TagName<HTMLHtmlElement>;
    const I: TagName<HtmlElement>;
    const IFRAME: TagName<HTMLIFrameElement>;
    const IMG: TagName<HTMLImageElement>;
    const INPUT: TagName<HTMLInputElement>;
    const INS: TagName<HTMLModElement>;
    const ISINDEX: TagName<any>;
    const KBD: TagName<HtmlElement>;
    const KEYGEN: TagName<HtmlElement>;
    const LABEL: TagName<HTMLLabelElement>;
    const LEGEND: TagName<HTMLLegendElement>;
    const LI: TagName<HTMLLIElement>;
    const LINK: TagName<HTMLLinkElement>;
    const MAIN: TagName<HtmlElement>;
    const MAP: TagName<HTMLMapElement>;
    const MARK: TagName<HtmlElement>;
    const MATH: TagName<HtmlElement>;
    const MENU: TagName<HTMLMenuElement>;
    const MENUITEM: TagName<any>;
    const META: TagName<HTMLMetaElement>;
    const METER: TagName<HTMLMeterElement>;
    const NAV: TagName<HtmlElement>;
    const NOFRAMES: TagName<HtmlElement>;
    const NOSCRIPT: TagName<HtmlElement>;
    const OBJECT: TagName<HTMLObjectElement>;
    const OL: TagName<HTMLOListElement>;
    const OPTGROUP: TagName<HTMLOptGroupElement>;
    const OPTION: TagName<HTMLOptionElement>;
    const OUTPUT: TagName<HTMLOutputElement>;
    const P: TagName<HTMLParagraphElement>;
    const PARAM: TagName<HTMLParamElement>;
    const PICTURE: TagName<HTMLPictureElement>;
    const PRE: TagName<HTMLPreElement>;
    const PROGRESS: TagName<HTMLProgressElement>;
    const Q: TagName<HTMLQuoteElement>;
    const RP: TagName<HtmlElement>;
    const RT: TagName<HtmlElement>;
    const RTC: TagName<HtmlElement>;
    const RUBY: TagName<HtmlElement>;
    const S: TagName<HtmlElement>;
    const SAMP: TagName<HtmlElement>;
    const SCRIPT: TagName<HTMLScriptElement>;
    const SECTION: TagName<HtmlElement>;
    const SELECT: TagName<HTMLSelectElement>;
    const SMALL: TagName<HtmlElement>;
    const SOURCE: TagName<HTMLSourceElement>;
    const SPAN: TagName<HTMLSpanElement>;
    const STRIKE: TagName<HtmlElement>;
    const STRONG: TagName<HtmlElement>;
    const STYLE: TagName<HTMLStyleElement>;
    const SUB: TagName<HtmlElement>;
    const SUMMARY: TagName<HtmlElement>;
    const SUP: TagName<HtmlElement>;
    const SVG: TagName<HtmlElement>;
    const TABLE: TagName<HTMLTableElement>;
    const TBODY: TagName<HTMLTableSectionElement>;
    const TD: TagName<HTMLTableCellElement>;
    const TEMPLATE: TagName<HTMLTemplateElement>;
    const TEXTAREA: TagName<HTMLTextAreaElement>;
    const TFOOT: TagName<HTMLTableSectionElement>;
    const TH: TagName<HTMLTableCellElement>;
    const THEAD: TagName<HTMLTableSectionElement>;
    const TIME: TagName<HtmlElement>;
    const TITLE: TagName<HTMLTitleElement>;
    const TR: TagName<HTMLTableRowElement>;
    const TRACK: TagName<HTMLTrackElement>;
    const TT: TagName<HtmlElement>;
    const U: TagName<HtmlElement>;
    const UL: TagName<HTMLUListElement>;
    const VAR: TagName<HtmlElement>;
    const VIDEO: TagName<HTMLVideoElement>;
    const WBR: TagName<HtmlElement>;
}
import { HtmlElement } from "./htmlelement.js";
