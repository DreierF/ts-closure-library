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
 * A tag name for an HTML element.
 *
 * This type is a lie. All instances are actually strings. Do not implement it.
 *
 * It exists because we need an object type to host the template type parameter,
 * and that's not possible with literal or enum types. It is a record type so
 * that runtime type checks don't try to validate the lie.
 *
 * Closure Compiler unconditionally converts the following constants to their
 * string value (TagName.A -> 'A'). These are the consequences:
 * 1. Don't add any members or static members to TagName as they
 *    couldn't be accessed after this optimization.
 * 2. Keep the constant name and its string value the same:
 *    TagName.X = new TagName('Y');
 *    is converted to 'X', not 'Y'.
 *
 * @template T
 * @interface
 */
export class TagName<T> {
    /**
     * Cast a string into the tagname for the associated constructor.
     *
     * @template T
     * @param {string} name
     * @param {function(new:T, ...?)} type
     * @return {!TagName<T>}
     */
    static cast<T>(name: string, type: new (...arg1: unknown[]) => T): TagName<T>;
    /**
     * Appease the compiler that instances are stringafiable for the
     * purpose of being a dictionary key.
     *
     * Never implemented; always backed by `String::toString`.
     *
     * @override
     * @return {string}
     */
    toString(): string;
}
export namespace TagName {
    const A: TagName<HTMLElementTagNameMap['a']>;
    const ABBR: TagName<HTMLElementTagNameMap['abbr']>;
    const ACRONYM: TagName<HTMLElementTagNameMap['acronym']>;
    const ADDRESS: TagName<HTMLElementTagNameMap['address']>;
    const APPLET: TagName<HTMLElementTagNameMap['applet']>;
    const AREA: TagName<HTMLElementTagNameMap['area']>;
    const ARTICLE: TagName<HTMLElementTagNameMap['article']>;
    const ASIDE: TagName<HTMLElementTagNameMap['aside']>;
    const AUDIO: TagName<HTMLElementTagNameMap['audio']>;
    const B: TagName<HTMLElementTagNameMap['b']>;
    const BASE: TagName<HTMLElementTagNameMap['base']>;
    const BASEFONT: TagName<HTMLElementTagNameMap['basefont']>;
    const BDI: TagName<HTMLElementTagNameMap['bdi']>;
    const BDO: TagName<HTMLElementTagNameMap['bdo']>;
    const BIG: TagName<HTMLElementTagNameMap['big']>;
    const BLOCKQUOTE: TagName<HTMLElementTagNameMap['blockquote']>;
    const BODY: TagName<HTMLElementTagNameMap['body']>;
    const BR: TagName<HTMLElementTagNameMap['br']>;
    const BUTTON: TagName<HTMLElementTagNameMap['button']>;
    const CANVAS: TagName<HTMLElementTagNameMap['canvas']>;
    const CAPTION: TagName<HTMLElementTagNameMap['caption']>;
    const CENTER: TagName<HTMLElementTagNameMap['center']>;
    const CITE: TagName<HTMLElementTagNameMap['cite']>;
    const CODE: TagName<HTMLElementTagNameMap['code']>;
    const COL: TagName<HTMLElementTagNameMap['col']>;
    const COLGROUP: TagName<HTMLElementTagNameMap['colgroup']>;
    const COMMAND: TagName<HTMLElementTagNameMap['command']>;
    const DATA: TagName<HTMLElementTagNameMap['data']>;
    const DATALIST: TagName<HTMLElementTagNameMap['datalist']>;
    const DD: TagName<HTMLElementTagNameMap['dd']>;
    const DEL: TagName<HTMLElementTagNameMap['del']>;
    const DETAILS: TagName<HTMLElementTagNameMap['details']>;
    const DFN: TagName<HTMLElementTagNameMap['dfn']>;
    const DIALOG: TagName<HTMLElementTagNameMap['dialog']>;
    const DIR: TagName<HTMLElementTagNameMap['dir']>;
    const DIV: TagName<HTMLElementTagNameMap['div']>;
    const DL: TagName<HTMLElementTagNameMap['dl']>;
    const DT: TagName<HTMLElementTagNameMap['dt']>;
    const EM: TagName<HTMLElementTagNameMap['em']>;
    const EMBED: TagName<HTMLElementTagNameMap['embed']>;
    const FIELDSET: TagName<HTMLElementTagNameMap['fieldset']>;
    const FIGCAPTION: TagName<HTMLElementTagNameMap['figcaption']>;
    const FIGURE: TagName<HTMLElementTagNameMap['figure']>;
    const FONT: TagName<HTMLElementTagNameMap['font']>;
    const FOOTER: TagName<HTMLElementTagNameMap['footer']>;
    const FORM: TagName<HTMLElementTagNameMap['form']>;
    const FRAME: TagName<HTMLElementTagNameMap['frame']>;
    const FRAMESET: TagName<HTMLElementTagNameMap['frameset']>;
    const H1: TagName<HTMLElementTagNameMap['h1']>;
    const H2: TagName<HTMLElementTagNameMap['h2']>;
    const H3: TagName<HTMLElementTagNameMap['h3']>;
    const H4: TagName<HTMLElementTagNameMap['h4']>;
    const H5: TagName<HTMLElementTagNameMap['h5']>;
    const H6: TagName<HTMLElementTagNameMap['h6']>;
    const HEAD: TagName<HTMLElementTagNameMap['head']>;
    const HEADER: TagName<HTMLElementTagNameMap['header']>;
    const HGROUP: TagName<HTMLElementTagNameMap['hgroup']>;
    const HR: TagName<HTMLElementTagNameMap['hr']>;
    const HTML: TagName<HTMLElementTagNameMap['html']>;
    const I: TagName<HTMLElementTagNameMap['i']>;
    const IFRAME: TagName<HTMLElementTagNameMap['iframe']>;
    const IMG: TagName<HTMLElementTagNameMap['img']>;
    const INPUT: TagName<HTMLElementTagNameMap['input']>;
    const INS: TagName<HTMLElementTagNameMap['ins']>;
    const ISINDEX: TagName<HTMLElementTagNameMap['isindex']>;
    const KBD: TagName<HTMLElementTagNameMap['kbd']>;
    const KEYGEN: TagName<HTMLElementTagNameMap['keygen']>;
    const LABEL: TagName<HTMLElementTagNameMap['label']>;
    const LEGEND: TagName<HTMLElementTagNameMap['legend']>;
    const LI: TagName<HTMLElementTagNameMap['li']>;
    const LINK: TagName<HTMLElementTagNameMap['link']>;
    const MAIN: TagName<HTMLElementTagNameMap['main']>;
    const MAP: TagName<HTMLElementTagNameMap['map']>;
    const MARK: TagName<HTMLElementTagNameMap['mark']>;
    const MATH: TagName<HTMLElementTagNameMap['math']>;
    const MENU: TagName<HTMLElementTagNameMap['menu']>;
    const MENUITEM: TagName<HTMLElementTagNameMap['menuitem']>;
    const META: TagName<HTMLElementTagNameMap['meta']>;
    const METER: TagName<HTMLElementTagNameMap['meter']>;
    const NAV: TagName<HTMLElementTagNameMap['nav']>;
    const NOFRAMES: TagName<HTMLElementTagNameMap['noframes']>;
    const NOSCRIPT: TagName<HTMLElementTagNameMap['noscript']>;
    const OBJECT: TagName<HTMLElementTagNameMap['object']>;
    const OL: TagName<HTMLElementTagNameMap['ol']>;
    const OPTGROUP: TagName<HTMLElementTagNameMap['optgroup']>;
    const OPTION: TagName<HTMLElementTagNameMap['option']>;
    const OUTPUT: TagName<HTMLElementTagNameMap['output']>;
    const P: TagName<HTMLElementTagNameMap['p']>;
    const PARAM: TagName<HTMLElementTagNameMap['param']>;
    const PICTURE: TagName<HTMLElementTagNameMap['picture']>;
    const PRE: TagName<HTMLElementTagNameMap['pre']>;
    const PROGRESS: TagName<HTMLElementTagNameMap['progress']>;
    const Q: TagName<HTMLElementTagNameMap['q']>;
    const RP: TagName<HTMLElementTagNameMap['rp']>;
    const RT: TagName<HTMLElementTagNameMap['rt']>;
    const RTC: TagName<HTMLElementTagNameMap['rtc']>;
    const RUBY: TagName<HTMLElementTagNameMap['ruby']>;
    const S: TagName<HTMLElementTagNameMap['s']>;
    const SAMP: TagName<HTMLElementTagNameMap['samp']>;
    const SCRIPT: TagName<HTMLElementTagNameMap['script']>;
    const SECTION: TagName<HTMLElementTagNameMap['section']>;
    const SELECT: TagName<HTMLElementTagNameMap['select']>;
    const SMALL: TagName<HTMLElementTagNameMap['small']>;
    const SOURCE: TagName<HTMLElementTagNameMap['source']>;
    const SPAN: TagName<HTMLElementTagNameMap['span']>;
    const STRIKE: TagName<HTMLElementTagNameMap['strike']>;
    const STRONG: TagName<HTMLElementTagNameMap['strong']>;
    const STYLE: TagName<HTMLElementTagNameMap['style']>;
    const SUB: TagName<HTMLElementTagNameMap['sub']>;
    const SUMMARY: TagName<HTMLElementTagNameMap['summary']>;
    const SUP: TagName<HTMLElementTagNameMap['sup']>;
    const SVG: TagName<HTMLElementTagNameMap['svg']>;
    const TABLE: TagName<HTMLElementTagNameMap['table']>;
    const TBODY: TagName<HTMLElementTagNameMap['tbody']>;
    const TD: TagName<HTMLElementTagNameMap['td']>;
    const TEMPLATE: TagName<HTMLElementTagNameMap['template']>;
    const TEXTAREA: TagName<HTMLElementTagNameMap['textarea']>;
    const TFOOT: TagName<HTMLElementTagNameMap['tfoot']>;
    const TH: TagName<HTMLElementTagNameMap['th']>;
    const THEAD: TagName<HTMLElementTagNameMap['thead']>;
    const TIME: TagName<HTMLElementTagNameMap['time']>;
    const TITLE: TagName<HTMLElementTagNameMap['title']>;
    const TR: TagName<HTMLElementTagNameMap['tr']>;
    const TRACK: TagName<HTMLElementTagNameMap['track']>;
    const TT: TagName<HTMLElementTagNameMap['tt']>;
    const U: TagName<HTMLElementTagNameMap['u']>;
    const UL: TagName<HTMLElementTagNameMap['ul']>;
    const VAR: TagName<HTMLElementTagNameMap['var']>;
    const VIDEO: TagName<HTMLElementTagNameMap['video']>;
    const WBR: TagName<HTMLElementTagNameMap['wbr']>;
}
