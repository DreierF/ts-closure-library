import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
// Copyright 2017 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Custom assertions to ensure that an element has the appropriate
 * type.
 *
 * Using a goog.dom.safe wrapper on an object on the incorrect type (via an
 * incorrect static type cast) can result in security bugs: For instance,
 * g.d.s.setAnchorHref ensures that the URL assigned to the .href attribute
 * satisfies the SafeUrl contract, i.e., is safe to dereference as a hyperlink.
 * However, the value assigned to a HTMLLinkElement's .href property requires
 * the stronger TrustedResourceUrl contract, since it can refer to a stylesheet.
 * Thus, using g.d.s.setAnchorHref on an (incorrectly statically typed) object
 * of type HTMLLinkElement can result in a security vulnerability.
 * Assertions of the correct run-time type help prevent such incorrect use.
 *
 * In some cases, code using the DOM API is tested using mock objects (e.g., a
 * plain object such as {'href': url} instead of an actual Location object).
 * To allow such mocking, the assertions permit objects of types that are not
 * relevant DOM API objects at all (for instance, not Element or Location).
 *
 * Note that instanceof checks don't work straightforwardly in older versions of
 * IE, or across frames (see,
 * http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object,
 * http://stackoverflow.com/questions/26248599/instanceof-htmlelement-in-iframe-is-not-element-or-object).
 *
 * Hence, these assertions may pass vacuously in such scenarios. The resulting
 * risk of security bugs is limited by the following factors:
 *  - A bug can only arise in scenarios involving incorrect static typing (the
 *    wrapper methods are statically typed to demand objects of the appropriate,
 *    precise type).
 *  - Typically, code is tested and exercised in multiple browsers.
 */

/**
 * Asserts that a given object is a Location.
 *
 * To permit this assertion to pass in the context of tests where DOM APIs might
 * be mocked, also accepts any other type except for subtypes of {!Element}.
 * This is to ensure that, for instance, HTMLLinkElement is not being used in
 * place of a Location, since this could result in security bugs due to stronger
 * contracts required for assignments to the href property of the latter.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!Location}
 */
function assertIsLocation(o) {
  if (asserts.ENABLE_ASSERTS) {
    var win = getWindow_(o);
    if (win) {
      if (!o || (!(o instanceof win.Location) && o instanceof win.Element)) {
        asserts.fail(
            'Argument is not a Location (or a non-Element mock); got: %s',
            debugStringForType_(o));
      }
    }
  }
  return /** @type {!Location} */ (o);
};

/**
 * Asserts that a given object is either the given subtype of Element
 * or a non-Element, non-Location Mock.
 *
 * To permit this assertion to pass in the context of tests where DOM
 * APIs might be mocked, also accepts any other type except for
 * subtypes of {!Element}.  This is to ensure that, for instance,
 * HTMLScriptElement is not being used in place of a HTMLImageElement,
 * since this could result in security bugs due to stronger contracts
 * required for assignments to the src property of the latter.
 *
 * The DOM type is looked up in the window the object belongs to.  In
 * some contexts, this might not be possible (e.g. when running tests
 * outside a browser, cross-domain lookup). In this case, the
 * assertions are skipped.
 *
 * @param {?Object} o The object whose type to assert.
 * @param {string} typename The name of the DOM type.
 * @return {!Element} The object.
 * @private
 */
// TODO(bangert): Make an analog of goog.dom.TagName to correctly handle casts?
function assertIsElementType_(o, typename) {
  if (asserts.ENABLE_ASSERTS) {
    var win = getWindow_(o);
    if (win && typeof win[typename] != 'undefined') {
      if (!o ||
          (!(o instanceof win[typename]) &&
           (o instanceof win.Location || o instanceof win.Element))) {
        asserts.fail(
            'Argument is not a %s (or a non-Element, non-Location mock); ' +
                'got: %s',
            typename, debugStringForType_(o));
      }
    }
  }
  return /** @type {!Element} */ (o);
};

/**
 * Asserts that a given object is a HTMLAnchorElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not of type Location nor a subtype
 * of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLAnchorElement}
 * @deprecated Use asserts.dom.assertIsHtmlAnchorElement instead.
 */
function assertIsHTMLAnchorElement(o) {
  return /** @type {!HTMLAnchorElement} */ (
      assertIsElementType_(o, 'HTMLAnchorElement'));
};

/**
 * Asserts that a given object is a HTMLButtonElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLButtonElement}
 * @deprecated Use asserts.dom.assertIsHtmlButtonElement instead.
 */
function assertIsHTMLButtonElement(o) {
  return /** @type {!HTMLButtonElement} */ (
      assertIsElementType_(o, 'HTMLButtonElement'));
};

/**
 * Asserts that a given object is a HTMLLinkElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLLinkElement}
 * @deprecated Use asserts.dom.assertIsHtmlLinkElement instead.
 */
function assertIsHTMLLinkElement(o) {
  return /** @type {!HTMLLinkElement} */ (
      assertIsElementType_(o, 'HTMLLinkElement'));
};

/**
 * Asserts that a given object is a HTMLImageElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLImageElement}
 * @deprecated Use asserts.dom.assertIsHtmlImageElement instead.
 */
function assertIsHTMLImageElement(o) {
  return /** @type {!HTMLImageElement} */ (
      assertIsElementType_(o, 'HTMLImageElement'));
};

/**
 * Asserts that a given object is a HTMLAudioElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLAudioElement}
 * @deprecated Use asserts.dom.assertIsHtmlAudioElement instead.
 */
function assertIsHTMLAudioElement(o) {
  return /** @type {!HTMLAudioElement} */ (
      assertIsElementType_(o, 'HTMLAudioElement'));
};

/**
 * Asserts that a given object is a HTMLVideoElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLVideoElement}
 * @deprecated Use asserts.dom.assertIsHtmlVideoElement instead.
 */
function assertIsHTMLVideoElement(o) {
  return /** @type {!HTMLVideoElement} */ (
      assertIsElementType_(o, 'HTMLVideoElement'));
};

/**
 * Asserts that a given object is a HTMLInputElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLInputElement}
 * @deprecated Use asserts.dom.assertIsHtmlInputElement instead.
 */
function assertIsHTMLInputElement(o) {
  return /** @type {!HTMLInputElement} */ (
      assertIsElementType_(o, 'HTMLInputElement'));
};

/**
 * Asserts that a given object is a HTMLTextAreaElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLTextAreaElement}
 * @deprecated Use asserts.dom.assertIsHtmlTextAreaElement instead.
 */
function assertIsHTMLTextAreaElement(o) {
  return /** @type {!HTMLTextAreaElement} */ (
      assertIsElementType_(o, 'HTMLTextAreaElement'));
};

/**
 * Asserts that a given object is a HTMLCanvasElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLCanvasElement}
 * @deprecated Use asserts.dom.assertIsHtmlCanvasElement instead.
 */
function assertIsHTMLCanvasElement(o) {
  return /** @type {!HTMLCanvasElement} */ (
      assertIsElementType_(o, 'HTMLCanvasElement'));
};

/**
 * Asserts that a given object is a HTMLEmbedElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLEmbedElement}
 * @deprecated Use asserts.dom.assertIsHtmlEmbedElement instead.
 */
function assertIsHTMLEmbedElement(o) {
  return /** @type {!HTMLEmbedElement} */ (
      assertIsElementType_(o, 'HTMLEmbedElement'));
};

/**
 * Asserts that a given object is a HTMLFormElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLFormElement}
 * @deprecated Use asserts.dom.assertIsHtmlFormElement instead.
 */
function assertIsHTMLFormElement(o) {
  return /** @type {!HTMLFormElement} */ (
      assertIsElementType_(o, 'HTMLFormElement'));
};

/**
 * Asserts that a given object is a HTMLFrameElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLFrameElement}
 * @deprecated Use asserts.dom.assertIsHtmlFrameElement instead.
 */
function assertIsHTMLFrameElement(o) {
  return /** @type {!HTMLFrameElement} */ (
      assertIsElementType_(o, 'HTMLFrameElement'));
};

/**
 * Asserts that a given object is a HTMLIFrameElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLIFrameElement}
 * @deprecated Use asserts.dom.assertIsHtmlIFrameElement instead.
 */
function assertIsHTMLIFrameElement(o) {
  return /** @type {!HTMLIFrameElement} */ (
      assertIsElementType_(o, 'HTMLIFrameElement'));
};

/**
 * Asserts that a given object is a HTMLObjectElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLObjectElement}
 * @deprecated Use asserts.dom.assertIsHtmlObjectElement instead.
 */
function assertIsHTMLObjectElement(o) {
  return /** @type {!HTMLObjectElement} */ (
      assertIsElementType_(o, 'HTMLObjectElement'));
};

/**
 * Asserts that a given object is a HTMLScriptElement.
 *
 * To permit this assertion to pass in the context of tests where elements might
 * be mocked, also accepts objects that are not a subtype of Element.
 *
 * @param {?Object} o The object whose type to assert.
 * @return {!HTMLScriptElement}
 * @deprecated Use asserts.dom.assertIsHtmlScriptElement instead.
 */
function assertIsHTMLScriptElement(o) {
  return /** @type {!HTMLScriptElement} */ (
      assertIsElementType_(o, 'HTMLScriptElement'));
};

/**
 * Returns a string representation of a value's type.
 *
 * @param {*} value An object, or primitive.
 * @return {string} The best display name for the value.
 * @private
 */
function debugStringForType_(value) {
  if (google.isObject(value)) {
    try {
      return /** @type {string|undefined} */ (value.constructor.displayName) ||
          value.constructor.name || Object.prototype.toString.call(value);
    } catch (e) {
      return '<object could not be stringified>';
    }
  } else {
    return value === undefined ? 'undefined' :
                                 value === null ? 'null' : typeof value;
  }
};

/**
 * Gets window of element.
 * @param {?Object} o
 * @return {?Window}
 * @private
 * @suppress {strictMissingProperties} ownerDocument not defined on Object
 */
function getWindow_(o) {
  try {
    var doc = o && o.ownerDocument;
    // This can throw “Blocked a frame with origin "chrome-extension://..." from
    // accessing a cross-origin frame” in Chrome extension.
    var win =
        doc && /** @type {?Window} */ (doc.defaultView || doc.parentWindow);
    win = win || /** @type {!Window} */ (window);
    // This can throw “Permission denied to access property "Element" on
    // cross-origin object”.
    if (win.Element && win.Location) {
      return win;
    }
  } catch (ex) {
  }
  return null;
};

export {assertIsHTMLAnchorElement, assertIsHTMLAudioElement, assertIsHTMLButtonElement, assertIsHTMLCanvasElement, assertIsHTMLEmbedElement, assertIsHTMLFormElement, assertIsHTMLFrameElement, assertIsHTMLIFrameElement, assertIsHTMLImageElement, assertIsHTMLInputElement, assertIsHTMLLinkElement, assertIsHTMLObjectElement, assertIsHTMLScriptElement, assertIsHTMLTextAreaElement, assertIsHTMLVideoElement, assertIsLocation};