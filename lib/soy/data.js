import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import {SafeHtml} from './../html/safehtml.js';
import {SafeScript} from './../html/safescript.js';
import {SafeStyle} from './../html/safestyle.js';
import {SafeStyleSheet as Html_SafeStyleSheet} from './../html/safestylesheet.js';
import {SafeUrl} from './../html/safeurl.js';
import {TrustedResourceUrl} from './../html/trustedresourceurl.js';
import * as uncheckedconversions from './../html/uncheckedconversions.js';
import {Dir} from './../i18n/bidi.js';
import {Const} from './../string/const.js';
import {Uri} from './../uri/uri.js';
// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Soy data primitives.
 *
 * The goal is to encompass data types used by Soy, especially to mark content
 * as known to be "safe".
 */

/**
 * A type of textual content.
 *
 * This is an enum of type Object so that these values are unforgeable.
 *
 * @enum {!Object}
 */
let SanitizedContentKind = {

  /**
   * A snippet of HTML that does not start or end inside a tag, comment, entity,
   * or DOCTYPE; and that does not contain any executable code
   * (JS, {@code <object>}s, etc.) from a different trust domain.
   */
  HTML: google.DEBUG ? {sanitizedContentKindHtml: true} : {},

  /**
   * Executable JavaScript code or expression, safe for insertion in a
   * script-tag or event handler context, known to be free of any
   * attacker-controlled scripts. This can either be side-effect-free
   * JavaScript (such as JSON) or JavaScript that's entirely under Google's
   * control.
   */
  JS: google.DEBUG ? {sanitizedContentJsChars: true} : {},

  /** A properly encoded portion of a URI. */
  URI: google.DEBUG ? {sanitizedContentUri: true} : {},

  /** A resource URI not under attacker control. */
  TRUSTED_RESOURCE_URI:
      google.DEBUG ? {sanitizedContentTrustedResourceUri: true} : {},

  /**
   * Repeated attribute names and values. For example,
   * {@code dir="ltr" foo="bar" onclick="trustedFunction()" checked}.
   */
  ATTRIBUTES: google.DEBUG ? {sanitizedContentHtmlAttribute: true} : {},

  // TODO: Consider separating rules, declarations, and values into
  // separate types, but for simplicity, we'll treat explicitly blessed
  // SanitizedContent as allowed in all of these contexts.
  /**
   * A CSS3 declaration, property, value or group of semicolon separated
   * declarations.
   */
  STYLE: google.DEBUG ? {sanitizedContentStyle: true} : {},

  /** A CSS3 style sheet (list of rules). */
  CSS: google.DEBUG ? {sanitizedContentCss: true} : {}

  // TEXT doesn't produce SanitizedContent anymore, use renderText.
};

/**
 * A string-like object that carries a content-type and a content direction.
 *
 * IMPORTANT! Do not create these directly, nor instantiate the subclasses.
 * Instead, use a trusted, centrally reviewed library as endorsed by your team
 * to generate these objects. Otherwise, you risk accidentally creating
 * SanitizedContent that is attacker-controlled and gets evaluated unescaped in
 * templates.
 *
 * @abstract
 * @suppress {checkTypes} 
 */
class SanitizedContent {

  /**
   * A string-like object that carries a content-type and a content direction.
   *
   * IMPORTANT! Do not create these directly, nor instantiate the subclasses.
   * Instead, use a trusted, centrally reviewed library as endorsed by your team
   * to generate these objects. Otherwise, you risk accidentally creating
   * SanitizedContent that is attacker-controlled and gets evaluated unescaped in
   * templates.
   *
   * @suppress {checkTypes} 
   */
  constructor() {
    /**
     * The context in which this content is safe from XSS attacks.
     * @type {SanitizedContentKind}
     */
    this.contentKind = null;
  
    /**
     * The content's direction; null if unknown and thus to be estimated when
     * necessary.
     * @type {?Dir}
     */
    this.contentDir = null;
  
    /**
     * The already-safe content.
     * @protected
      * @type {string}
     */
    this.content = '';
  
  }

  /**
   * Gets the already-safe content.
   * @return {string}
   */
  getContent() {
    return this.content;
  };

  /** @override */
  toString() {
    return this.content;
  };

  /**
   * Converts sanitized content of kind HTML into SafeHtml
   * @return {!SafeHtml}
   * @throws {!Error} when the content kind is not HTML.
   */
  toSafeHtml() {
    if (this.contentKind !== SanitizedContentKind.HTML) {
      throw new Error('Sanitized content was not of kind HTML.');
    }
    return uncheckedconversions
        .safeHtmlFromStringKnownToSatisfyTypeContract(
            Const.from(
                'Soy SanitizedContent of kind HTML produces ' +
                'SafeHtml-contract-compliant value.'),
            this.toString(), this.contentDir);
  };

  /**
   * Converts sanitized content of kind URI into SafeUrl without modification.
   * @return {!SafeUrl}
   * @throws {Error} when the content kind is not URI.
   */
  toSafeUrl() {
    if (this.contentKind !== SanitizedContentKind.URI) {
      throw new Error('Sanitized content was not of kind URI.');
    }
    return uncheckedconversions
        .safeUrlFromStringKnownToSatisfyTypeContract(
            Const.from(
                'Soy SanitizedContent of kind URI produces ' +
                'SafeHtml-contract-compliant value.'),
            this.toString());
  };
}

/**
 * Content of type {@link SanitizedContentKind.HTML}.
 *
 * The content is a string of HTML that can safely be embedded in a PCDATA
 * context in your app.  If you would be surprised to find that an HTML
 * sanitizer produced `s` (e.g.  it runs code or fetches bad URLs) and
 * you wouldn't write a template that produces `s` on security or privacy
 * grounds, then don't pass `s` here. The default content direction is
 * unknown, i.e. to be estimated when necessary.
 *
 * @extends {SanitizedContent}
 */
class SanitizedHtml extends SanitizedContent {

  /**
   * Content of type {@link SanitizedContentKind.HTML}.
   *
   * The content is a string of HTML that can safely be embedded in a PCDATA
   * context in your app.  If you would be surprised to find that an HTML
   * sanitizer produced `s` (e.g.  it runs code or fetches bad URLs) and
   * you wouldn't write a template that produces `s` on security or privacy
   * grounds, then don't pass `s` here. The default content direction is
   * unknown, i.e. to be estimated when necessary.
   *
   */
  constructor() {
    super();
    /** @override */
    this.contentKind =
        SanitizedContentKind.HTML;
  
  }

  /**
   * Checks if the value could be used as the Soy type {html}.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWith(value) {
    return typeof value === 'string' ||
        value instanceof SanitizedHtml ||
        value instanceof SafeHtml;
  };

  /**
   * Checks if the value could be used as the Soy type {html}.
   * Strict: disallows strings.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWithStrict(value) {
    return value instanceof SanitizedHtml ||
        value instanceof SafeHtml;
  };
}

/**
 * Content of type {@link SanitizedContentKind.JS}.
 *
 * The content is JavaScript source that when evaluated does not execute any
 * attacker-controlled scripts. The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
class SanitizedJs extends SanitizedContent {

  /**
   * Content of type {@link SanitizedContentKind.JS}.
   *
   * The content is JavaScript source that when evaluated does not execute any
   * attacker-controlled scripts. The content direction is LTR.
   *
   */
  constructor() {
    super();
    /** @override */
    this.contentKind =
        SanitizedContentKind.JS;
  
    /** @override */
    this.contentDir = Dir.LTR;
  
  }

  /**
   * Checks if the value could be used as the Soy type {js}.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWith(value) {
    return typeof value === 'string' ||
        value instanceof SanitizedJs ||
        value instanceof SafeScript;
  };

  /**
   * Checks if the value could be used as the Soy type {js}.
   * Strict: disallows strings.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWithStrict(value) {
    return value instanceof SanitizedJs ||
        value instanceof SafeHtml;
  };
}

/**
 * Content of type {@link SanitizedContentKind.URI}.
 *
 * The content is a URI chunk that the caller knows is safe to emit in a
 * template. The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
class SanitizedUri extends SanitizedContent {

  /**
   * Content of type {@link SanitizedContentKind.URI}.
   *
   * The content is a URI chunk that the caller knows is safe to emit in a
   * template. The content direction is LTR.
   *
   */
  constructor() {
    super();
    /** @override */
    this.contentKind =
        SanitizedContentKind.URI;
  
    /** @override */
    this.contentDir = Dir.LTR;
  
  }

  /**
   * Checks if the value could be used as the Soy type {uri}.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWith(value) {
    return typeof value === 'string' ||
        value instanceof SanitizedUri ||
        value instanceof SafeUrl ||
        value instanceof TrustedResourceUrl ||
        value instanceof Uri;
  };

  /**
   * Checks if the value could be used as the Soy type {uri}.
   * Strict: disallows strings.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWithStrict(value) {
    return value instanceof SanitizedUri ||
        value instanceof SafeUrl ||
        value instanceof TrustedResourceUrl ||
        value instanceof Uri;
  };
}

/**
 * Content of type
 * {@link SanitizedContentKind.TRUSTED_RESOURCE_URI}.
 *
 * The content is a TrustedResourceUri chunk that is not under attacker control.
 * The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
class SanitizedTrustedResourceUri extends SanitizedContent {

  /**
   * Content of type
   * {@link SanitizedContentKind.TRUSTED_RESOURCE_URI}.
   *
   * The content is a TrustedResourceUri chunk that is not under attacker control.
   * The content direction is LTR.
   *
   */
  constructor() {
    super();
    /** @override */
    this.contentKind =
        SanitizedContentKind.TRUSTED_RESOURCE_URI;
  
    /** @override */
    this.contentDir =
        Dir.LTR;
  
  }

  /**
   * Converts sanitized content into TrustedResourceUrl without modification.
   * @return {!TrustedResourceUrl}
   */
  toTrustedResourceUrl() {
    return uncheckedconversions
        .trustedResourceUrlFromStringKnownToSatisfyTypeContract(
            Const.from(
                'Soy SanitizedContent of kind TRUSTED_RESOURCE_URI produces ' +
                'TrustedResourceUrl-contract-compliant value.'),
            this.toString());
  };

  /**
   * Checks if the value could be used as the Soy type {trusted_resource_uri}.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWith(value) {
    return typeof value === 'string' ||
        value instanceof SanitizedTrustedResourceUri ||
        value instanceof TrustedResourceUrl;
  };

  /**
   * Checks if the value could be used as the Soy type {trusted_resource_uri}.
   * Strict: disallows strings.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWithStrict(
      value) {
    return value instanceof SanitizedTrustedResourceUri ||
        value instanceof TrustedResourceUrl;
  };
}

/**
 * Content of type {@link SanitizedContentKind.ATTRIBUTES}.
 *
 * The content should be safely embeddable within an open tag, such as a
 * key="value" pair. The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
class SanitizedHtmlAttribute extends SanitizedContent {

  /**
   * Content of type {@link SanitizedContentKind.ATTRIBUTES}.
   *
   * The content should be safely embeddable within an open tag, such as a
   * key="value" pair. The content direction is LTR.
   *
   */
  constructor() {
    super();
    /** @override */
    this.contentKind =
        SanitizedContentKind.ATTRIBUTES;
  
    /** @override */
    this.contentDir =
        Dir.LTR;
  
  }

  /**
   * Checks if the value could be used as the Soy type {attribute}.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWith(value) {
    return typeof value === 'string' ||
        value instanceof SanitizedHtmlAttribute;
  };

  /**
   * Checks if the value could be used as the Soy type {attribute}.
   * Strict: disallows strings.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWithStrict(value) {
    return value instanceof SanitizedHtmlAttribute;
  };
}

/**
 * Content of type {@link SanitizedContentKind.CSS}.
 *
 * The content is non-attacker-exploitable CSS, such as {@code @import url(x)}.
 * The content direction is LTR.
 *
 * @extends {SanitizedContent}
 */
class SanitizedCss extends SanitizedContent {

  /**
   * Content of type {@link SanitizedContentKind.CSS}.
   *
   * The content is non-attacker-exploitable CSS, such as {@code @import url(x)}.
   * The content direction is LTR.
   *
   */
  constructor() {
    super();
    /** @override */
    this.contentKind =
        SanitizedContentKind.CSS;
  
    /** @override */
    this.contentDir = Dir.LTR;
  
  }

  /**
   * Checks if the value could be used as the Soy type {css}.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWith(value) {
    return typeof value === 'string' ||
        value instanceof SanitizedCss ||
        value instanceof SafeStyle ||
        value instanceof Html_SafeStyleSheet;
  };

  /**
   * Checks if the value could be used as the Soy type {css}.
   * Strict: disallows strings.
   * @param {*} value
   * @return {boolean}
   */
  static isCompatibleWithStrict(value) {
    return value instanceof SanitizedCss ||
        value instanceof SafeStyle ||
        value instanceof Html_SafeStyleSheet;
  };

  /**
   * Converts SanitizedCss into SafeStyleSheet.
   * Note: SanitizedCss in Soy represents both SafeStyle and SafeStyleSheet in
   * Closure. It's about to be split so that SanitizedCss represents only
   * SafeStyleSheet.
   * @return {!Html_SafeStyleSheet}
   */
  toSafeStyleSheet() {
    var value = this.toString();
    asserts.assert(
        /[@{]|^\s*$/.test(value),
        'value doesn\'t look like style sheet: ' + value);
    return uncheckedconversions
        .safeStyleSheetFromStringKnownToSatisfyTypeContract(
            Const.from(
                'Soy SanitizedCss produces SafeStyleSheet-contract-compliant ' +
                'value.'),
            value);
  };
}

export {SanitizedContent, SanitizedContentKind, SanitizedCss, SanitizedHtml, SanitizedHtmlAttribute, SanitizedJs, SanitizedTrustedResourceUri, SanitizedUri};