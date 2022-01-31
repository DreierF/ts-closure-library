import {HtmlElement} from './htmlelement.js';
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
 * @template T
 * @record
 */
class TagName {
  /**
   * Cast a string into the tagname for the associated constructor.
   *
   * @template T
   * @param {string} name
   * @param {function(new:T, ...?)} type
   * @return {!TagName<T>}
   */
  static cast(name, type) {
    return /** @type {?} */ (name);
  }

  /** @suppress {unusedPrivateMembers} */
  constructor() {
    /** @private {null} */
    this.googDomTagName_doNotImplementThisTypeOrElse_;

    /** @private {T} */
    this.ensureTypeScriptRemembersTypeT_;
  }

  /**
   * Appease the compiler that instances are stringafiable for the
   * purpose of being a dictionary key.
   *
   * Never implemented; always backed by `String::toString`.
   *
   * @override
   * @return {string}
   */
  toString() {}
};

/** @const {!TagName<!HTMLAnchorElement>} */
TagName.A = /** @type {?} */ ('A');

/** @const {!TagName<!HtmlElement>} */
TagName.ABBR = /** @type {?} */ ('ABBR');

/** @const {!TagName<!HtmlElement>} */
TagName.ACRONYM = /** @type {?} */ ('ACRONYM');

/** @const {!TagName<!HtmlElement>} */
TagName.ADDRESS = /** @type {?} */ ('ADDRESS');

/** @const {!TagName<!HTMLAppletElement>} */
TagName.APPLET = /** @type {?} */ ('APPLET');

/** @const {!TagName<!HTMLAreaElement>} */
TagName.AREA = /** @type {?} */ ('AREA');

/** @const {!TagName<!HtmlElement>} */
TagName.ARTICLE = /** @type {?} */ ('ARTICLE');

/** @const {!TagName<!HtmlElement>} */
TagName.ASIDE = /** @type {?} */ ('ASIDE');

/** @const {!TagName<!HTMLAudioElement>} */
TagName.AUDIO = /** @type {?} */ ('AUDIO');

/** @const {!TagName<!HtmlElement>} */
TagName.B = /** @type {?} */ ('B');

/** @const {!TagName<!HTMLBaseElement>} */
TagName.BASE = /** @type {?} */ ('BASE');

/** @const {!TagName<!HTMLBaseFontElement>} */
TagName.BASEFONT = /** @type {?} */ ('BASEFONT');

/** @const {!TagName<!HtmlElement>} */
TagName.BDI = /** @type {?} */ ('BDI');

/** @const {!TagName<!HtmlElement>} */
TagName.BDO = /** @type {?} */ ('BDO');

/** @const {!TagName<!HtmlElement>} */
TagName.BIG = /** @type {?} */ ('BIG');

/** @const {!TagName<!HTMLQuoteElement>} */
TagName.BLOCKQUOTE = /** @type {?} */ ('BLOCKQUOTE');

/** @const {!TagName<!HTMLBodyElement>} */
TagName.BODY = /** @type {?} */ ('BODY');

/** @const {!TagName<!HTMLBRElement>} */
TagName.BR = /** @type {?} */ ('BR');

/** @const {!TagName<!HTMLButtonElement>} */
TagName.BUTTON = /** @type {?} */ ('BUTTON');

/** @const {!TagName<!HTMLCanvasElement>} */
TagName.CANVAS = /** @type {?} */ ('CANVAS');

/** @const {!TagName<!HTMLTableCaptionElement>} */
TagName.CAPTION = /** @type {?} */ ('CAPTION');

/** @const {!TagName<!HtmlElement>} */
TagName.CENTER = /** @type {?} */ ('CENTER');

/** @const {!TagName<!HtmlElement>} */
TagName.CITE = /** @type {?} */ ('CITE');

/** @const {!TagName<!HtmlElement>} */
TagName.CODE = /** @type {?} */ ('CODE');

/** @const {!TagName<!HTMLTableColElement>} */
TagName.COL = /** @type {?} */ ('COL');

/** @const {!TagName<!HTMLTableColElement>} */
TagName.COLGROUP = /** @type {?} */ ('COLGROUP');

/** @const {!TagName<!HtmlElement>} */
TagName.COMMAND = /** @type {?} */ ('COMMAND');

/** @const {!TagName<!HtmlElement>} */
TagName.DATA = /** @type {?} */ ('DATA');

/** @const {!TagName<!HTMLDataListElement>} */
TagName.DATALIST = /** @type {?} */ ('DATALIST');

/** @const {!TagName<!HtmlElement>} */
TagName.DD = /** @type {?} */ ('DD');

/** @const {!TagName<!HTMLModElement>} */
TagName.DEL = /** @type {?} */ ('DEL');

/** @const {!TagName<!HTMLDetailsElement>} */
TagName.DETAILS = /** @type {?} */ ('DETAILS');

/** @const {!TagName<!HtmlElement>} */
TagName.DFN = /** @type {?} */ ('DFN');

/** @const {!TagName<!HTMLDialogElement>} */
TagName.DIALOG = /** @type {?} */ ('DIALOG');

/** @const {!TagName<!HTMLDirectoryElement>} */
TagName.DIR = /** @type {?} */ ('DIR');

/** @const {!TagName<!HTMLDivElement>} */
TagName.DIV = /** @type {?} */ ('DIV');

/** @const {!TagName<!HTMLDListElement>} */
TagName.DL = /** @type {?} */ ('DL');

/** @const {!TagName<!HtmlElement>} */
TagName.DT = /** @type {?} */ ('DT');

/** @const {!TagName<!HtmlElement>} */
TagName.EM = /** @type {?} */ ('EM');

/** @const {!TagName<!HTMLEmbedElement>} */
TagName.EMBED = /** @type {?} */ ('EMBED');

/** @const {!TagName<!HTMLFieldSetElement>} */
TagName.FIELDSET = /** @type {?} */ ('FIELDSET');

/** @const {!TagName<!HtmlElement>} */
TagName.FIGCAPTION = /** @type {?} */ ('FIGCAPTION');

/** @const {!TagName<!HtmlElement>} */
TagName.FIGURE = /** @type {?} */ ('FIGURE');

/** @const {!TagName<!HTMLFontElement>} */
TagName.FONT = /** @type {?} */ ('FONT');

/** @const {!TagName<!HtmlElement>} */
TagName.FOOTER = /** @type {?} */ ('FOOTER');

/** @const {!TagName<!HTMLFormElement>} */
TagName.FORM = /** @type {?} */ ('FORM');

/** @const {!TagName<!HTMLFrameElement>} */
TagName.FRAME = /** @type {?} */ ('FRAME');

/** @const {!TagName<!HTMLFrameSetElement>} */
TagName.FRAMESET = /** @type {?} */ ('FRAMESET');

/** @const {!TagName<!HTMLHeadingElement>} */
TagName.H1 = /** @type {?} */ ('H1');

/** @const {!TagName<!HTMLHeadingElement>} */
TagName.H2 = /** @type {?} */ ('H2');

/** @const {!TagName<!HTMLHeadingElement>} */
TagName.H3 = /** @type {?} */ ('H3');

/** @const {!TagName<!HTMLHeadingElement>} */
TagName.H4 = /** @type {?} */ ('H4');

/** @const {!TagName<!HTMLHeadingElement>} */
TagName.H5 = /** @type {?} */ ('H5');

/** @const {!TagName<!HTMLHeadingElement>} */
TagName.H6 = /** @type {?} */ ('H6');

/** @const {!TagName<!HTMLHeadElement>} */
TagName.HEAD = /** @type {?} */ ('HEAD');

/** @const {!TagName<!HtmlElement>} */
TagName.HEADER = /** @type {?} */ ('HEADER');

/** @const {!TagName<!HtmlElement>} */
TagName.HGROUP = /** @type {?} */ ('HGROUP');

/** @const {!TagName<!HTMLHRElement>} */
TagName.HR = /** @type {?} */ ('HR');

/** @const {!TagName<!HTMLHtmlElement>} */
TagName.HTML = /** @type {?} */ ('HTML');

/** @const {!TagName<!HtmlElement>} */
TagName.I = /** @type {?} */ ('I');

/** @const {!TagName<!HTMLIFrameElement>} */
TagName.IFRAME = /** @type {?} */ ('IFRAME');

/** @const {!TagName<!HTMLImageElement>} */
TagName.IMG = /** @type {?} */ ('IMG');

/** @const {!TagName<!HTMLInputElement>} */
TagName.INPUT = /** @type {?} */ ('INPUT');

/** @const {!TagName<!HTMLModElement>} */
TagName.INS = /** @type {?} */ ('INS');

/** @const {!TagName<!HTMLIsIndexElement>} */
TagName.ISINDEX = /** @type {?} */ ('ISINDEX');

/** @const {!TagName<!HtmlElement>} */
TagName.KBD = /** @type {?} */ ('KBD');

// HTMLKeygenElement is deprecated.
/** @const {!TagName<!HtmlElement>} */
TagName.KEYGEN = /** @type {?} */ ('KEYGEN');

/** @const {!TagName<!HTMLLabelElement>} */
TagName.LABEL = /** @type {?} */ ('LABEL');

/** @const {!TagName<!HTMLLegendElement>} */
TagName.LEGEND = /** @type {?} */ ('LEGEND');

/** @const {!TagName<!HTMLLIElement>} */
TagName.LI = /** @type {?} */ ('LI');

/** @const {!TagName<!HTMLLinkElement>} */
TagName.LINK = /** @type {?} */ ('LINK');

/** @const {!TagName<!HtmlElement>} */
TagName.MAIN = /** @type {?} */ ('MAIN');

/** @const {!TagName<!HTMLMapElement>} */
TagName.MAP = /** @type {?} */ ('MAP');

/** @const {!TagName<!HtmlElement>} */
TagName.MARK = /** @type {?} */ ('MARK');

/** @const {!TagName<!HtmlElement>} */
TagName.MATH = /** @type {?} */ ('MATH');

/** @const {!TagName<!HTMLMenuElement>} */
TagName.MENU = /** @type {?} */ ('MENU');

/** @const {!TagName<!HTMLMenuItemElement>} */
TagName.MENUITEM = /** @type {?} */ ('MENUITEM');

/** @const {!TagName<!HTMLMetaElement>} */
TagName.META = /** @type {?} */ ('META');

/** @const {!TagName<!HTMLMeterElement>} */
TagName.METER = /** @type {?} */ ('METER');

/** @const {!TagName<!HtmlElement>} */
TagName.NAV = /** @type {?} */ ('NAV');

/** @const {!TagName<!HtmlElement>} */
TagName.NOFRAMES = /** @type {?} */ ('NOFRAMES');

/** @const {!TagName<!HtmlElement>} */
TagName.NOSCRIPT = /** @type {?} */ ('NOSCRIPT');

/** @const {!TagName<!HTMLObjectElement>} */
TagName.OBJECT = /** @type {?} */ ('OBJECT');

/** @const {!TagName<!HTMLOListElement>} */
TagName.OL = /** @type {?} */ ('OL');

/** @const {!TagName<!HTMLOptGroupElement>} */
TagName.OPTGROUP = /** @type {?} */ ('OPTGROUP');

/** @const {!TagName<!HTMLOptionElement>} */
TagName.OPTION = /** @type {?} */ ('OPTION');

/** @const {!TagName<!HTMLOutputElement>} */
TagName.OUTPUT = /** @type {?} */ ('OUTPUT');

/** @const {!TagName<!HTMLParagraphElement>} */
TagName.P = /** @type {?} */ ('P');

/** @const {!TagName<!HTMLParamElement>} */
TagName.PARAM = /** @type {?} */ ('PARAM');

/** @const {!TagName<!HTMLPictureElement>} */
TagName.PICTURE = /** @type {?} */ ('PICTURE');

/** @const {!TagName<!HTMLPreElement>} */
TagName.PRE = /** @type {?} */ ('PRE');

/** @const {!TagName<!HTMLProgressElement>} */
TagName.PROGRESS = /** @type {?} */ ('PROGRESS');

/** @const {!TagName<!HTMLQuoteElement>} */
TagName.Q = /** @type {?} */ ('Q');

/** @const {!TagName<!HtmlElement>} */
TagName.RP = /** @type {?} */ ('RP');

/** @const {!TagName<!HtmlElement>} */
TagName.RT = /** @type {?} */ ('RT');

/** @const {!TagName<!HtmlElement>} */
TagName.RTC = /** @type {?} */ ('RTC');

/** @const {!TagName<!HtmlElement>} */
TagName.RUBY = /** @type {?} */ ('RUBY');

/** @const {!TagName<!HtmlElement>} */
TagName.S = /** @type {?} */ ('S');

/** @const {!TagName<!HtmlElement>} */
TagName.SAMP = /** @type {?} */ ('SAMP');

/** @const {!TagName<!HTMLScriptElement>} */
TagName.SCRIPT = /** @type {?} */ ('SCRIPT');

/** @const {!TagName<!HtmlElement>} */
TagName.SECTION = /** @type {?} */ ('SECTION');

/** @const {!TagName<!HTMLSelectElement>} */
TagName.SELECT = /** @type {?} */ ('SELECT');

/** @const {!TagName<!HtmlElement>} */
TagName.SMALL = /** @type {?} */ ('SMALL');

/** @const {!TagName<!HTMLSourceElement>} */
TagName.SOURCE = /** @type {?} */ ('SOURCE');

/** @const {!TagName<!HTMLSpanElement>} */
TagName.SPAN = /** @type {?} */ ('SPAN');

/** @const {!TagName<!HtmlElement>} */
TagName.STRIKE = /** @type {?} */ ('STRIKE');

/** @const {!TagName<!HtmlElement>} */
TagName.STRONG = /** @type {?} */ ('STRONG');

/** @const {!TagName<!HTMLStyleElement>} */
TagName.STYLE = /** @type {?} */ ('STYLE');

/** @const {!TagName<!HtmlElement>} */
TagName.SUB = /** @type {?} */ ('SUB');

/** @const {!TagName<!HtmlElement>} */
TagName.SUMMARY = /** @type {?} */ ('SUMMARY');

/** @const {!TagName<!HtmlElement>} */
TagName.SUP = /** @type {?} */ ('SUP');

/** @const {!TagName<!HtmlElement>} */
TagName.SVG = /** @type {?} */ ('SVG');

/** @const {!TagName<!HTMLTableElement>} */
TagName.TABLE = /** @type {?} */ ('TABLE');

/** @const {!TagName<!HTMLTableSectionElement>} */
TagName.TBODY = /** @type {?} */ ('TBODY');

/** @const {!TagName<!HTMLTableCellElement>} */
TagName.TD = /** @type {?} */ ('TD');

/** @const {!TagName<!HTMLTemplateElement>} */
TagName.TEMPLATE = /** @type {?} */ ('TEMPLATE');

/** @const {!TagName<!HTMLTextAreaElement>} */
TagName.TEXTAREA = /** @type {?} */ ('TEXTAREA');

/** @const {!TagName<!HTMLTableSectionElement>} */
TagName.TFOOT = /** @type {?} */ ('TFOOT');

/** @const {!TagName<!HTMLTableCellElement>} */
TagName.TH = /** @type {?} */ ('TH');

/** @const {!TagName<!HTMLTableSectionElement>} */
TagName.THEAD = /** @type {?} */ ('THEAD');

/** @const {!TagName<!HtmlElement>} */
TagName.TIME = /** @type {?} */ ('TIME');

/** @const {!TagName<!HTMLTitleElement>} */
TagName.TITLE = /** @type {?} */ ('TITLE');

/** @const {!TagName<!HTMLTableRowElement>} */
TagName.TR = /** @type {?} */ ('TR');

/** @const {!TagName<!HTMLTrackElement>} */
TagName.TRACK = /** @type {?} */ ('TRACK');

/** @const {!TagName<!HtmlElement>} */
TagName.TT = /** @type {?} */ ('TT');

/** @const {!TagName<!HtmlElement>} */
TagName.U = /** @type {?} */ ('U');

/** @const {!TagName<!HTMLUListElement>} */
TagName.UL = /** @type {?} */ ('UL');

/** @const {!TagName<!HtmlElement>} */
TagName.VAR = /** @type {?} */ ('VAR');

/** @const {!TagName<!HTMLVideoElement>} */
TagName.VIDEO = /** @type {?} */ ('VIDEO');

/** @const {!TagName<!HtmlElement>} */
TagName.WBR = /** @type {?} */ ('WBR');

export {TagName};