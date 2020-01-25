import {HtmlElement} from './htmlelement.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
class TagName {

  /**
   * A tag name with the type of the element stored in the generic.
   * @param {string} tagName
   * @template T
   */
  constructor(tagName) {
    /** @private {string} */
    this.tagName_ = tagName;
  }

  /**
   * Returns the tag name.
   * @return {string}
   * @override
   */
  toString() {
    return this.tagName_;
  };
}

// Closure Compiler unconditionally converts the following constants to their
// string value (TagName.A -> 'A'). These are the consequences:
// 1. Don't add any members or static members to TagName as they
//    couldn't be accessed after this optimization.
// 2. Keep the constant name and its string value the same:
//    TagName.X = new TagName('Y');
//    is converted to 'X', not 'Y'.

/** @type {!TagName<!HTMLAnchorElement>} */
TagName.A = new TagName('A');

/** @type {!TagName<!HtmlElement>} */
TagName.ABBR = new TagName('ABBR');

/** @type {!TagName<!HtmlElement>} */
TagName.ACRONYM = new TagName('ACRONYM');

/** @type {!TagName<!HtmlElement>} */
TagName.ADDRESS = new TagName('ADDRESS');

/** @type {!TagName<!HTMLAppletElement>} */
TagName.APPLET = new TagName('APPLET');

/** @type {!TagName<!HTMLAreaElement>} */
TagName.AREA = new TagName('AREA');

/** @type {!TagName<!HtmlElement>} */
TagName.ARTICLE = new TagName('ARTICLE');

/** @type {!TagName<!HtmlElement>} */
TagName.ASIDE = new TagName('ASIDE');

/** @type {!TagName<!HTMLAudioElement>} */
TagName.AUDIO = new TagName('AUDIO');

/** @type {!TagName<!HtmlElement>} */
TagName.B = new TagName('B');

/** @type {!TagName<!HTMLBaseElement>} */
TagName.BASE = new TagName('BASE');

/** @type {!TagName<!HTMLBaseFontElement>} */
TagName.BASEFONT = new TagName('BASEFONT');

/** @type {!TagName<!HtmlElement>} */
TagName.BDI = new TagName('BDI');

/** @type {!TagName<!HtmlElement>} */
TagName.BDO = new TagName('BDO');

/** @type {!TagName<!HtmlElement>} */
TagName.BIG = new TagName('BIG');

/** @type {!TagName<!HTMLQuoteElement>} */
TagName.BLOCKQUOTE = new TagName('BLOCKQUOTE');

/** @type {!TagName<!HTMLBodyElement>} */
TagName.BODY = new TagName('BODY');

/** @type {!TagName<!HTMLBRElement>} */
TagName.BR = new TagName('BR');

/** @type {!TagName<!HTMLButtonElement>} */
TagName.BUTTON = new TagName('BUTTON');

/** @type {!TagName<!HTMLCanvasElement>} */
TagName.CANVAS = new TagName('CANVAS');

/** @type {!TagName<!HTMLTableCaptionElement>} */
TagName.CAPTION = new TagName('CAPTION');

/** @type {!TagName<!HtmlElement>} */
TagName.CENTER = new TagName('CENTER');

/** @type {!TagName<!HtmlElement>} */
TagName.CITE = new TagName('CITE');

/** @type {!TagName<!HtmlElement>} */
TagName.CODE = new TagName('CODE');

/** @type {!TagName<!HTMLTableColElement>} */
TagName.COL = new TagName('COL');

/** @type {!TagName<!HTMLTableColElement>} */
TagName.COLGROUP = new TagName('COLGROUP');

/** @type {!TagName<!HtmlElement>} */
TagName.COMMAND = new TagName('COMMAND');

/** @type {!TagName<!HtmlElement>} */
TagName.DATA = new TagName('DATA');

/** @type {!TagName<!HTMLDataListElement>} */
TagName.DATALIST = new TagName('DATALIST');

/** @type {!TagName<!HtmlElement>} */
TagName.DD = new TagName('DD');

/** @type {!TagName<!HTMLModElement>} */
TagName.DEL = new TagName('DEL');

/** @type {!TagName<!HTMLDetailsElement>} */
TagName.DETAILS = new TagName('DETAILS');

/** @type {!TagName<!HtmlElement>} */
TagName.DFN = new TagName('DFN');

/** @type {!TagName<!HTMLDialogElement>} */
TagName.DIALOG = new TagName('DIALOG');

/** @type {!TagName<!HTMLDirectoryElement>} */
TagName.DIR = new TagName('DIR');

/** @type {!TagName<!HTMLDivElement>} */
TagName.DIV = new TagName('DIV');

/** @type {!TagName<!HTMLDListElement>} */
TagName.DL = new TagName('DL');

/** @type {!TagName<!HtmlElement>} */
TagName.DT = new TagName('DT');

/** @type {!TagName<!HtmlElement>} */
TagName.EM = new TagName('EM');

/** @type {!TagName<!HTMLEmbedElement>} */
TagName.EMBED = new TagName('EMBED');

/** @type {!TagName<!HTMLFieldSetElement>} */
TagName.FIELDSET = new TagName('FIELDSET');

/** @type {!TagName<!HtmlElement>} */
TagName.FIGCAPTION = new TagName('FIGCAPTION');

/** @type {!TagName<!HtmlElement>} */
TagName.FIGURE = new TagName('FIGURE');

/** @type {!TagName<!HTMLFontElement>} */
TagName.FONT = new TagName('FONT');

/** @type {!TagName<!HtmlElement>} */
TagName.FOOTER = new TagName('FOOTER');

/** @type {!TagName<!HTMLFormElement>} */
TagName.FORM = new TagName('FORM');

/** @type {!TagName<!HTMLFrameElement>} */
TagName.FRAME = new TagName('FRAME');

/** @type {!TagName<!HTMLFrameSetElement>} */
TagName.FRAMESET = new TagName('FRAMESET');

/** @type {!TagName<!HTMLHeadingElement>} */
TagName.H1 = new TagName('H1');

/** @type {!TagName<!HTMLHeadingElement>} */
TagName.H2 = new TagName('H2');

/** @type {!TagName<!HTMLHeadingElement>} */
TagName.H3 = new TagName('H3');

/** @type {!TagName<!HTMLHeadingElement>} */
TagName.H4 = new TagName('H4');

/** @type {!TagName<!HTMLHeadingElement>} */
TagName.H5 = new TagName('H5');

/** @type {!TagName<!HTMLHeadingElement>} */
TagName.H6 = new TagName('H6');

/** @type {!TagName<!HTMLHeadElement>} */
TagName.HEAD = new TagName('HEAD');

/** @type {!TagName<!HtmlElement>} */
TagName.HEADER = new TagName('HEADER');

/** @type {!TagName<!HtmlElement>} */
TagName.HGROUP = new TagName('HGROUP');

/** @type {!TagName<!HTMLHRElement>} */
TagName.HR = new TagName('HR');

/** @type {!TagName<!HTMLHtmlElement>} */
TagName.HTML = new TagName('HTML');

/** @type {!TagName<!HtmlElement>} */
TagName.I = new TagName('I');

/** @type {!TagName<!HTMLIFrameElement>} */
TagName.IFRAME = new TagName('IFRAME');

/** @type {!TagName<!HTMLImageElement>} */
TagName.IMG = new TagName('IMG');

/** @type {!TagName<!HTMLInputElement>} */
TagName.INPUT = new TagName('INPUT');

/** @type {!TagName<!HTMLModElement>} */
TagName.INS = new TagName('INS');

/** @type {!TagName<!HTMLIsIndexElement>} */
TagName.ISINDEX = new TagName('ISINDEX');

/** @type {!TagName<!HtmlElement>} */
TagName.KBD = new TagName('KBD');

// HTMLKeygenElement is deprecated.
/** @type {!TagName<!HtmlElement>} */
TagName.KEYGEN = new TagName('KEYGEN');

/** @type {!TagName<!HTMLLabelElement>} */
TagName.LABEL = new TagName('LABEL');

/** @type {!TagName<!HTMLLegendElement>} */
TagName.LEGEND = new TagName('LEGEND');

/** @type {!TagName<!HTMLLIElement>} */
TagName.LI = new TagName('LI');

/** @type {!TagName<!HTMLLinkElement>} */
TagName.LINK = new TagName('LINK');

/** @type {!TagName<!HtmlElement>} */
TagName.MAIN = new TagName('MAIN');

/** @type {!TagName<!HTMLMapElement>} */
TagName.MAP = new TagName('MAP');

/** @type {!TagName<!HtmlElement>} */
TagName.MARK = new TagName('MARK');

/** @type {!TagName<!HtmlElement>} */
TagName.MATH = new TagName('MATH');

/** @type {!TagName<!HTMLMenuElement>} */
TagName.MENU = new TagName('MENU');

/** @type {!TagName<!HTMLMenuItemElement>} */
TagName.MENUITEM = new TagName('MENUITEM');

/** @type {!TagName<!HTMLMetaElement>} */
TagName.META = new TagName('META');

/** @type {!TagName<!HTMLMeterElement>} */
TagName.METER = new TagName('METER');

/** @type {!TagName<!HtmlElement>} */
TagName.NAV = new TagName('NAV');

/** @type {!TagName<!HtmlElement>} */
TagName.NOFRAMES = new TagName('NOFRAMES');

/** @type {!TagName<!HtmlElement>} */
TagName.NOSCRIPT = new TagName('NOSCRIPT');

/** @type {!TagName<!HTMLObjectElement>} */
TagName.OBJECT = new TagName('OBJECT');

/** @type {!TagName<!HTMLOListElement>} */
TagName.OL = new TagName('OL');

/** @type {!TagName<!HTMLOptGroupElement>} */
TagName.OPTGROUP = new TagName('OPTGROUP');

/** @type {!TagName<!HTMLOptionElement>} */
TagName.OPTION = new TagName('OPTION');

/** @type {!TagName<!HTMLOutputElement>} */
TagName.OUTPUT = new TagName('OUTPUT');

/** @type {!TagName<!HTMLParagraphElement>} */
TagName.P = new TagName('P');

/** @type {!TagName<!HTMLParamElement>} */
TagName.PARAM = new TagName('PARAM');

/** @type {!TagName<!HTMLPictureElement>} */
TagName.PICTURE = new TagName('PICTURE');

/** @type {!TagName<!HTMLPreElement>} */
TagName.PRE = new TagName('PRE');

/** @type {!TagName<!HTMLProgressElement>} */
TagName.PROGRESS = new TagName('PROGRESS');

/** @type {!TagName<!HTMLQuoteElement>} */
TagName.Q = new TagName('Q');

/** @type {!TagName<!HtmlElement>} */
TagName.RP = new TagName('RP');

/** @type {!TagName<!HtmlElement>} */
TagName.RT = new TagName('RT');

/** @type {!TagName<!HtmlElement>} */
TagName.RTC = new TagName('RTC');

/** @type {!TagName<!HtmlElement>} */
TagName.RUBY = new TagName('RUBY');

/** @type {!TagName<!HtmlElement>} */
TagName.S = new TagName('S');

/** @type {!TagName<!HtmlElement>} */
TagName.SAMP = new TagName('SAMP');

/** @type {!TagName<!HTMLScriptElement>} */
TagName.SCRIPT = new TagName('SCRIPT');

/** @type {!TagName<!HtmlElement>} */
TagName.SECTION = new TagName('SECTION');

/** @type {!TagName<!HTMLSelectElement>} */
TagName.SELECT = new TagName('SELECT');

/** @type {!TagName<!HtmlElement>} */
TagName.SMALL = new TagName('SMALL');

/** @type {!TagName<!HTMLSourceElement>} */
TagName.SOURCE = new TagName('SOURCE');

/** @type {!TagName<!HTMLSpanElement>} */
TagName.SPAN = new TagName('SPAN');

/** @type {!TagName<!HtmlElement>} */
TagName.STRIKE = new TagName('STRIKE');

/** @type {!TagName<!HtmlElement>} */
TagName.STRONG = new TagName('STRONG');

/** @type {!TagName<!HTMLStyleElement>} */
TagName.STYLE = new TagName('STYLE');

/** @type {!TagName<!HtmlElement>} */
TagName.SUB = new TagName('SUB');

/** @type {!TagName<!HtmlElement>} */
TagName.SUMMARY = new TagName('SUMMARY');

/** @type {!TagName<!HtmlElement>} */
TagName.SUP = new TagName('SUP');

/** @type {!TagName<!HtmlElement>} */
TagName.SVG = new TagName('SVG');

/** @type {!TagName<!HTMLTableElement>} */
TagName.TABLE = new TagName('TABLE');

/** @type {!TagName<!HTMLTableSectionElement>} */
TagName.TBODY = new TagName('TBODY');

/** @type {!TagName<!HTMLTableCellElement>} */
TagName.TD = new TagName('TD');

/** @type {!TagName<!HTMLTemplateElement>} */
TagName.TEMPLATE = new TagName('TEMPLATE');

/** @type {!TagName<!HTMLTextAreaElement>} */
TagName.TEXTAREA = new TagName('TEXTAREA');

/** @type {!TagName<!HTMLTableSectionElement>} */
TagName.TFOOT = new TagName('TFOOT');

/** @type {!TagName<!HTMLTableCellElement>} */
TagName.TH = new TagName('TH');

/** @type {!TagName<!HTMLTableSectionElement>} */
TagName.THEAD = new TagName('THEAD');

/** @type {!TagName<!HtmlElement>} */
TagName.TIME = new TagName('TIME');

/** @type {!TagName<!HTMLTitleElement>} */
TagName.TITLE = new TagName('TITLE');

/** @type {!TagName<!HTMLTableRowElement>} */
TagName.TR = new TagName('TR');

/** @type {!TagName<!HTMLTrackElement>} */
TagName.TRACK = new TagName('TRACK');

/** @type {!TagName<!HtmlElement>} */
TagName.TT = new TagName('TT');

/** @type {!TagName<!HtmlElement>} */
TagName.U = new TagName('U');

/** @type {!TagName<!HTMLUListElement>} */
TagName.UL = new TagName('UL');

/** @type {!TagName<!HtmlElement>} */
TagName.VAR = new TagName('VAR');

/** @type {!TagName<!HTMLVideoElement>} */
TagName.VIDEO = new TagName('VIDEO');

/** @type {!TagName<!HtmlElement>} */
TagName.WBR = new TagName('WBR');

export {TagName};