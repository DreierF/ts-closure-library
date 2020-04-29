import * as googarray from './../array/array.js';
import * as goog_asserts from './../asserts/asserts.js';
import {AssertionError} from './../asserts/asserts.js';
import * as google from './../google.js';
import {SafeHtml} from './../html/safehtml.js';
import * as uncheckedconversions from './../html/uncheckedconversions.js';
import {Coordinate} from './../math/coordinate.js';
import {Size} from './../math/size.js';
import * as goog_object from './../object/object.js';
import {Const} from './../string/const.js';
import * as strings from './../string/string.js';
import {Unicode} from './../string/string.js';
import * as userAgent from './../useragent/useragent.js';
import * as BrowserFeature from './browserfeature.js';
import {NodeType} from './nodetype.js';
import * as domsafe from './safe.js';
import {TagName} from './tagname.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Utilities for manipulating the browser's Document Object Model
 * Inspiration taken *heavily* from mochikit (http://mochikit.com/).
 *
 * You can use {@link DomHelper} to create new dom helpers that refer
 * to a different document object.  This is useful if you are working with
 * frames or multiple windows.
 *
 * @suppress {strictMissingProperties}
 */

// TODO(arv): Rename/refactor getTextContent and getRawTextContent. The problem
// is that getTextContent should mimic the DOM3 textContent. We should add a
// getInnerText (or getText) which tries to return the visible text, innerText.

/**
 * @type {boolean} Whether we know at compile time that the browser is in
 * quirks mode.
 */
const ASSUME_QUIRKS_MODE = false;

/**
 * @type {boolean} Whether we know at compile time that the browser is in
 * standards compliance mode.
 */
const ASSUME_STANDARDS_MODE = false;

/**
 * Whether we know the compatibility mode at compile time.
 * @type {boolean}
 * @private
 */
let COMPAT_MODE_KNOWN_ =
    ASSUME_QUIRKS_MODE || ASSUME_STANDARDS_MODE;

/**
 * Gets the DomHelper object for the document where the element resides.
 * @param {(Node|Window)=} opt_element If present, gets the DomHelper for this
 *     element.
 * @return {!DomHelper} The DomHelper.
 */
function getDomHelper(opt_element) {
  return opt_element ?
      new DomHelper(getOwnerDocument(opt_element)) :
      (defaultDomHelper_ ||
       (defaultDomHelper_ = new DomHelper()));
};

/**
 * Cached default DOM helper.
 * @type {!DomHelper|undefined}
 * @private
 */
let defaultDomHelper_;

/**
 * Gets the document object being used by the dom library.
 * @return {!Document} Document object.
 * @deprecated Use document instead
 */
function getDocument() {
  return document;
};

/**
 * Gets an element from the current document by element id.
 *
 * If an Element is passed in, it is returned.
 *
 * @param {string|Element} element Element ID or a DOM node.
 * @return {Element} The element with the given ID, or the node passed in.
 * @deprecated Use document.getElementById(id) instead
 */
function getElement(element) {
  return getElementHelper_(document, element);
};

/**
 * Gets an element by id from the given document (if present).
 * If an element is given, it is returned.
 * @param {!Document} doc
 * @param {string|Element} element Element ID or a DOM node.
 * @return {Element} The resulting element.
 * @private
 */
function getElementHelper_(doc, element) {
  return typeof element === 'string' ? doc.getElementById(element) : element;
};

/**
 * Gets an element by id, asserting that the element is found.
 *
 * This is used when an element is expected to exist, and should fail with
 * an assertion error if it does not (if assertions are enabled).
 *
 * @param {string} id Element ID.
 * @return {!Element} The element with the given ID, if it exists.
 */
function getRequiredElement(id) {
  return getRequiredElementHelper_(document, id);
};

/**
 * Helper function for getRequiredElementHelper functions, both static and
 * on DomHelper.  Asserts the element with the given id exists.
 * @param {!Document} doc
 * @param {string} id
 * @return {!Element} The element with the given ID, if it exists.
 * @private
 */
function getRequiredElementHelper_(doc, id) {
  // To prevent users passing in Elements as is permitted in getElement().
  goog_asserts.assertString(id);
  var element = getElementHelper_(doc, id);
  element =
      goog_asserts.assertElement(element, 'No element found with id: ' + id);
  return element;
};

/**
 * Alias for getElement.
 * @param {string|Element} element Element ID or a DOM node.
 * @return {Element} The element with the given ID, or the node passed in.
 * @deprecated Use {@link getElement} instead.
 */
let $ = getElement;

/**
 * Gets elements by tag name.
 * @param {!TagName<T>} tagName
 * @param {(!Document|!Element)=} opt_parent Parent element or document where to
 *     look for elements. Defaults to document.
 * @return {!NodeList<R>} List of elements. The members of the list are
 *     {!Element} if tagName is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
function getElementsByTagName(tagName, opt_parent) {
  var parent = opt_parent || document;
  return parent.getElementsByTagName(String(tagName));
};

/**
 * Looks up elements by both tag and class name, using browser native functions
 * (`querySelectorAll`, `getElementsByTagName` or
 * `getElementsByClassName`) where possible. This function
 * is a useful, if limited, way of collecting a list of DOM elements
 * with certain characteristics.  `querySelectorAll` offers a
 * more powerful and general solution which allows matching on CSS3
 * selector expressions.
 *
 * Note that tag names are case sensitive in the SVG namespace, and this
 * function converts opt_tag to uppercase for comparisons. For queries in the
 * SVG namespace you should use querySelector or querySelectorAll instead.
 * https://bugzilla.mozilla.org/show_bug.cgi?id=963870
 * https://bugs.webkit.org/show_bug.cgi?id=83438
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll}
 *
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|Element)=} opt_el Optional element to look in.
 * @return {!IArrayLike<R>} Array-like list of elements (only a length property
 *     and numerical indices are guaranteed to exist). The members of the array
 *     are {!Element} if opt_tag is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
function getElementsByTagNameAndClass(opt_tag, opt_class, opt_el) {
  return getElementsByTagNameAndClass_(
      document, opt_tag, opt_class, opt_el);
};

/**
 * Gets the first element matching the tag and the class.
 *
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|Element)=} opt_el Optional element to look in.
 * @return {?R} Reference to a DOM node. The return type is {?Element} if
 *     tagName is a string or a more specific type if it is a member of
 *     TagName (e.g. {?HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
function getElementByTagNameAndClass(opt_tag, opt_class, opt_el) {
  return getElementByTagNameAndClass_(
      document, opt_tag, opt_class, opt_el);
};

/**
 * Returns a static, array-like list of the elements with the provided
 * className.
 *
 * @param {string} className the name of the class to look for.
 * @param {(Document|Element)=} opt_el Optional element to look in.
 * @return {!IArrayLike<!Element>} The items found with the class name provided.
 * @deprecated Use document.querySelectorAll('.classname') or element.querySelectorAll('.classname') instead
 */
function getElementsByClass(className, opt_el) {
  var parent = opt_el || document;
  if (canUseQuerySelector_(parent)) {
    return parent.querySelectorAll('.' + className);
  }
  return getElementsByTagNameAndClass_(
      document, '*', className, opt_el);
};

/**
 * Returns the first element with the provided className.
 *
 * @param {string} className the name of the class to look for.
 * @param {Element|Document=} opt_el Optional element to look in.
 * @return {Element} The first item with the class name provided.
 * @deprecated Use document.querySelector('.classname') or element.querySelector('.classname') instead
 */
function getElementByClass(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if (parent.getElementsByClassName) {
    retVal = parent.getElementsByClassName(className)[0];
  } else {
    retVal =
        getElementByTagNameAndClass_(document, '*', className, opt_el);
  }
  return retVal || null;
};

/**
 * Ensures an element with the given className exists, and then returns the
 * first element with the provided className.
 *
 * @param {string} className the name of the class to look for.
 * @param {!Element|!Document=} opt_root Optional element or document to look
 *     in.
 * @return {!Element} The first item with the class name provided.
 * @throws {AssertionError} Thrown if no element is found.
 */
function getRequiredElementByClass(className, opt_root) {
  var retValue = getElementByClass(className, opt_root);
  return goog_asserts.assert(
      retValue, 'No element found with className: ' + className);
};

/**
 * Prefer the standardized (http://www.w3.org/TR/selectors-api/), native and
 * fast W3C Selectors API.
 * @param {!(Element|Document)} parent The parent document object.
 * @return {boolean} whether or not we can use parent.querySelector* APIs.
 * @private
 */
function canUseQuerySelector_(parent) {
  return !!(parent.querySelectorAll && parent.querySelector);
};

/**
 * Helper for `getElementsByTagNameAndClass`.
 * @param {!Document} doc The document to get the elements in.
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|Element)=} opt_el Optional element to look in.
 * @return {!IArrayLike<R>} Array-like list of elements (only a length property
 *     and numerical indices are guaranteed to exist). The members of the array
 *     are {!Element} if opt_tag is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 * @private
 */
function getElementsByTagNameAndClass_(
    doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName =
      (opt_tag && opt_tag != '*') ? String(opt_tag).toUpperCase() : '';

  if (canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? '.' + opt_class : '');
    return parent.querySelectorAll(query);
  }

  // Use the native getElementsByClassName if available, under the assumption
  // that even when the tag name is specified, there will be fewer elements to
  // filter through when going by class than by tag name
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);

    if (tagName) {
      var arrayLike = {};
      var len = 0;

      // Filter for specific tags if requested.
      for (var i = 0, el; el = els[i]; i++) {
        if (tagName == el.nodeName) {
          arrayLike[len++] = el;
        }
      }
      arrayLike.length = len;

      return /** @type {!IArrayLike<!Element>} */ (arrayLike);
    } else {
      return els;
    }
  }

  var els = parent.getElementsByTagName(tagName || '*');

  if (opt_class) {
    var arrayLike = {};
    var len = 0;
    for (var i = 0, el; el = els[i]; i++) {
      var className = el.className;
      // Check if className has a split function since SVG className does not.
      if (typeof className.split == 'function' &&
          googarray.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el;
      }
    }
    arrayLike.length = len;
    return /** @type {!IArrayLike<!Element>} */ (arrayLike);
  } else {
    return els;
  }
};

/**
 * Helper for getElementByTagNameAndClass.
 *
 * @param {!Document} doc The document to get the elements in.
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {(Document|Element)=} opt_el Optional element to look in.
 * @return {?R} Reference to a DOM node. The return type is {?Element} if
 *     tagName is a string or a more specific type if it is a member of
 *     TagName (e.g. {?HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 * @private
 */
function getElementByTagNameAndClass_(
    doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tag = (opt_tag && opt_tag != '*') ? String(opt_tag).toUpperCase() : '';
  if (canUseQuerySelector_(parent) && (tag || opt_class)) {
    return parent.querySelector(tag + (opt_class ? '.' + opt_class : ''));
  }
  var elements =
      getElementsByTagNameAndClass_(doc, opt_tag, opt_class, opt_el);
  return elements[0] || null;
};

/**
 * Alias for `getElementsByTagNameAndClass`.
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {Element=} opt_el Optional element to look in.
 * @return {!IArrayLike<R>} Array-like list of elements (only a length property
 *     and numerical indices are guaranteed to exist). The members of the array
 *     are {!Element} if opt_tag is not a member of TagName or more
 *     specific types if it is (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 * @deprecated Use {@link getElementsByTagNameAndClass} instead.
 */
let $$ = getElementsByTagNameAndClass;

/**
 * Sets multiple properties, and sometimes attributes, on an element. Note that
 * properties are simply object properties on the element instance, while
 * attributes are visible in the DOM. Many properties map to attributes with the
 * same names, some with different names, and there are also unmappable cases.
 *
 * This method sets properties by default (which means that custom attributes
 * are not supported). These are the exeptions (some of which is legacy):
 * - "style": Even though this is an attribute name, it is translated to a
 *   property, "style.cssText". Note that this property sanitizes and formats
 *   its value, unlike the attribute.
 * - "class": This is an attribute name, it is translated to the "className"
 *   property.
 * - "for": This is an attribute name, it is translated to the "htmlFor"
 *   property.
 * - Entries in {@see DIRECT_ATTRIBUTE_MAP_} are set as attributes,
 *   this is probably due to browser quirks.
 * - "aria-*", "data-*": Always set as attributes, they have no property
 *   counterparts.
 *
 * @param {Element} element DOM node to set properties on.
 * @param {Object} properties Hash of property:value pairs.
 *     Property values can be strings or strings.TypedString values (such as
 *     goog.html.SafeUrl).
 */
function setProperties(element, properties) {
  goog_object.forEach(properties, function(val, key) {
    if (val && typeof val == 'object' && val.implementsGoogStringTypedString) {
      val = val.getTypedStringValue();
    }
    if (key == 'style') {
      element.style.cssText = val;
    } else if (key == 'class') {
      element.className = val;
    } else if (key == 'for') {
      element.htmlFor = val;
    } else if (DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(key)) {
      element.setAttribute(DIRECT_ATTRIBUTE_MAP_[key], val);
    } else if (
        strings.startsWith(key, 'aria-') ||
        strings.startsWith(key, 'data-')) {
      element.setAttribute(key, val);
    } else {
      element[key] = val;
    }
  });
};

/**
 * Map of attributes that should be set using
 * element.setAttribute(key, val) instead of element[key] = val.  Used
 * by setProperties.
 *
 * @private {!Object<string, string>}
 * @const
 */
let DIRECT_ATTRIBUTE_MAP_ = {
  'cellpadding': 'cellPadding',
  'cellspacing': 'cellSpacing',
  'colspan': 'colSpan',
  'frameborder': 'frameBorder',
  'height': 'height',
  'maxlength': 'maxLength',
  'nonce': 'nonce',
  'role': 'role',
  'rowspan': 'rowSpan',
  'type': 'type',
  'usemap': 'useMap',
  'valign': 'vAlign',
  'width': 'width'
};

/**
 * Gets the dimensions of the viewport.
 *
 * Gecko Standards mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Width of viewport including scrollbar.
 * body.clientWidth   Width of body element.
 *
 * docEl.clientHeight Height of viewport excluding scrollbar.
 * win.innerHeight    Height of viewport including scrollbar.
 * body.clientHeight  Height of document.
 *
 * Gecko Backwards compatible mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Width of viewport including scrollbar.
 * body.clientWidth   Width of viewport excluding scrollbar.
 *
 * docEl.clientHeight Height of document.
 * win.innerHeight    Height of viewport including scrollbar.
 * body.clientHeight  Height of viewport excluding scrollbar.
 *
 * IE6/7 Standards mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Undefined.
 * body.clientWidth   Width of body element.
 *
 * docEl.clientHeight Height of viewport excluding scrollbar.
 * win.innerHeight    Undefined.
 * body.clientHeight  Height of document element.
 *
 * IE5 + IE6/7 Backwards compatible mode:
 * docEl.clientWidth  0.
 * win.innerWidth     Undefined.
 * body.clientWidth   Width of viewport excluding scrollbar.
 *
 * docEl.clientHeight 0.
 * win.innerHeight    Undefined.
 * body.clientHeight  Height of viewport excluding scrollbar.
 *
 * Opera 9 Standards and backwards compatible mode:
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * win.innerWidth     Width of viewport including scrollbar.
 * body.clientWidth   Width of viewport excluding scrollbar.
 *
 * docEl.clientHeight Height of document.
 * win.innerHeight    Height of viewport including scrollbar.
 * body.clientHeight  Height of viewport excluding scrollbar.
 *
 * WebKit:
 * Safari 2
 * docEl.clientHeight Same as scrollHeight.
 * docEl.clientWidth  Same as innerWidth.
 * win.innerWidth     Width of viewport excluding scrollbar.
 * win.innerHeight    Height of the viewport including scrollbar.
 * frame.innerHeight  Height of the viewport exluding scrollbar.
 *
 * Safari 3 (tested in 522)
 *
 * docEl.clientWidth  Width of viewport excluding scrollbar.
 * docEl.clientHeight Height of viewport excluding scrollbar in strict mode.
 * body.clientHeight  Height of viewport excluding scrollbar in quirks mode.
 *
 * @param {Window=} opt_window Optional window element to test.
 * @return {!Size} Object with values 'width' and 'height'.
 */
function getViewportSize(opt_window) {
  // TODO(arv): This should not take an argument
  return getViewportSize_(opt_window || window);
};

/**
 * Helper for `getViewportSize`.
 * @param {Window} win The window to get the view port size for.
 * @return {!Size} Object with values 'width' and 'height'.
 * @private
 */
function getViewportSize_(win) {
  var doc = win.document;
  var el = isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new Size(el.clientWidth, el.clientHeight);
};

/**
 * Calculates the height of the document.
 *
 * @return {number} The height of the current document.
 */
function getDocumentHeight() {
  return getDocumentHeight_(window);
};

/**
 * Calculates the height of the document of the given window.
 *
 * @param {!Window} win The window whose document height to retrieve.
 * @return {number} The height of the document of the given window.
 */
function getDocumentHeightForWindow(win) {
  return getDocumentHeight_(win);
};

/**
 * Calculates the height of the document of the given window.
 *
 * Function code copied from the opensocial gadget api:
 *   gadgets.window.adjustHeight(opt_height)
 *
 * @private
 * @param {!Window} win The window whose document height to retrieve.
 * @return {number} The height of the document of the given window.
 */
function getDocumentHeight_(win) {
  // NOTE(eae): This method will return the window size rather than the document
  // size in webkit quirks mode.
  var doc = win.document;
  var height = 0;

  if (doc) {
    // Calculating inner content height is hard and different between
    // browsers rendering in Strict vs. Quirks mode.  We use a combination of
    // three properties within document.body and document.documentElement:
    // - scrollHeight
    // - offsetHeight
    // - clientHeight
    // These values differ significantly between browsers and rendering modes.
    // But there are patterns.  It just takes a lot of time and persistence
    // to figure out.

    var body = doc.body;
    var docEl = /** @type {!HTMLElement} */ (doc.documentElement);
    if (!(docEl && body)) {
      return 0;
    }

    // Get the height of the viewport
    var vh = getViewportSize_(win).height;
    if (isCss1CompatMode_(doc) && docEl.scrollHeight) {
      // In Strict mode:
      // The inner content height is contained in either:
      //    document.documentElement.scrollHeight
      //    document.documentElement.offsetHeight
      // Based on studying the values output by different browsers,
      // use the value that's NOT equal to the viewport height found above.
      height =
          docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight;
    } else {
      // In Quirks mode:
      // documentElement.clientHeight is equal to documentElement.offsetHeight
      // except in IE.  In most browsers, document.documentElement can be used
      // to calculate the inner content height.
      // However, in other browsers (e.g. IE), document.body must be used
      // instead.  How do we know which one to use?
      // If document.documentElement.clientHeight does NOT equal
      // document.documentElement.offsetHeight, then use document.body.
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if (docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight;
      }

      // Detect whether the inner content height is bigger or smaller
      // than the bounding box (viewport).  If bigger, take the larger
      // value.  If smaller, take the smaller value.
      if (sh > vh) {
        // Content is larger
        height = sh > oh ? sh : oh;
      } else {
        // Content is smaller
        height = sh < oh ? sh : oh;
      }
    }
  }

  return height;
};

/**
 * Gets the page scroll distance as a coordinate object.
 *
 * @param {Window=} opt_window Optional window element to test.
 * @return {!Coordinate} Object with values 'x' and 'y'.
 * @deprecated Use {@link getDocumentScroll} instead.
 */
function getPageScroll(opt_window) {
  var win = opt_window || window || window;
  return getDomHelper(win.document).getDocumentScroll();
};

/**
 * Gets the document scroll distance as a coordinate object.
 *
 * @return {!Coordinate} Object with values 'x' and 'y'.
 */
function getDocumentScroll() {
  return getDocumentScroll_(document);
};

/**
 * Helper for `getDocumentScroll`.
 *
 * @param {!Document} doc The document to get the scroll for.
 * @return {!Coordinate} Object with values 'x' and 'y'.
 * @private
 */
function getDocumentScroll_(doc) {
  var el = getDocumentScrollElement_(doc);
  var win = getWindow_(doc);
  if (userAgent.IE && userAgent.isVersionOrHigher('10') &&
      win.pageYOffset != el.scrollTop) {
    // The keyboard on IE10 touch devices shifts the page using the pageYOffset
    // without modifying scrollTop. For this case, we want the body scroll
    // offsets.
    return new Coordinate(el.scrollLeft, el.scrollTop);
  }
  return new Coordinate(
      win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};

/**
 * Gets the document scroll element.
 * @return {!Element} Scrolling element.
 */
function getDocumentScrollElement() {
  return getDocumentScrollElement_(document);
};

/**
 * Helper for `getDocumentScrollElement`.
 * @param {!Document} doc The document to get the scroll element for.
 * @return {!Element} Scrolling element.
 * @private
 */
function getDocumentScrollElement_(doc) {
  // Old WebKit needs body.scrollLeft in both quirks mode and strict mode. We
  // also default to the documentElement if the document does not have a body
  // (e.g. a SVG document).
  // Uses http://dev.w3.org/csswg/cssom-view/#dom-document-scrollingelement to
  // avoid trying to guess about browser behavior from the UA string.
  if (doc.scrollingElement) {
    return doc.scrollingElement;
  }
  if (!userAgent.WEBKIT && isCss1CompatMode_(doc)) {
    return doc.documentElement;
  }
  return doc.body || doc.documentElement;
};

/**
 * Gets the window object associated with the given document.
 *
 * @param {Document=} opt_doc  Document object to get window for.
 * @return {!Window} The window associated with the given document.
 */
function getWindow(opt_doc) {
  // TODO(arv): This should not take an argument.
  return opt_doc ? getWindow_(opt_doc) : window;
};

/**
 * Helper for `getWindow`.
 *
 * @param {!Document} doc  Document object to get window for.
 * @return {!Window} The window associated with the given document.
 * @private
 */
function getWindow_(doc) {
  return /** @type {!Window} */ (doc.parentWindow || doc.defaultView);
};

/**
 * Returns a dom node with a set of attributes.  This function accepts varargs
 * for subsequent nodes to be added.  Subsequent nodes will be added to the
 * first node as childNodes.
 *
 * So:
 * <code>createDom(TagName.DIV, null, createDom(TagName.P),
 * createDom(TagName.P));</code> would return a div with two child
 * paragraphs
 *
 * This function uses {@link setProperties} to set attributes: the
 * `opt_attributes` parameter follows the same rules.
 *
 * @param {string|!TagName<T>} tagName Tag to create.
 * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
 *     of name-value pairs for attributes. If a string, then this is the
 *     className of the new element. If an array, the elements will be joined
 *     together as the className of the new element.
 * @param {...(Object|string|Array|NodeList|null|undefined)} var_args Further
 *     DOM nodes or strings for text nodes. If one of the var_args is an array
 *     or NodeList, its elements will be added as childNodes instead.
 * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
 *     is a string or a more specific type if it is a member of
 *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
function createDom(tagName, opt_attributes, var_args) {
  return createDom_(document, arguments);
};

/**
 * Helper for `createDom`.
 * @param {!Document} doc The document to create the DOM in.
 * @param {!Arguments} args Argument object passed from the callers. See
 *     `createDom` for details.
 * @return {!Element} Reference to a DOM node.
 * @private
 */
function createDom_(doc, args) {
  var tagName = String(args[0]);
  var attributes = args[1];

  // Internet Explorer is dumb:
  // name: https://msdn.microsoft.com/en-us/library/ms534184(v=vs.85).aspx
  // type: https://msdn.microsoft.com/en-us/library/ms534700(v=vs.85).aspx
  // Also does not allow setting of 'type' attribute on 'input' or 'button'.
  if (!BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes &&
      (attributes.name || attributes.type)) {
    var tagNameArr = ['<', tagName];
    if (attributes.name) {
      tagNameArr.push(' name="', strings.htmlEscape(attributes.name), '"');
    }
    if (attributes.type) {
      tagNameArr.push(' type="', strings.htmlEscape(attributes.type), '"');

      // Clone attributes map to remove 'type' without mutating the input.
      var clone = {};
      goog_object.extend(clone, attributes);

      // JSCompiler can't see how goog_object.extend added this property,
      // because it was essentially added by reflection.
      // So it needs to be quoted.
      delete clone['type'];

      attributes = clone;
    }
    tagNameArr.push('>');
    tagName = tagNameArr.join('');
  }

  var element = createElement_(doc, tagName);

  if (attributes) {
    if (typeof attributes === 'string') {
      element.className = attributes;
    } else if (google.isArray(attributes)) {
      element.className = attributes.join(' ');
    } else {
      setProperties(element, attributes);
    }
  }

  if (args.length > 2) {
    append_(doc, element, args, 2);
  }

  return element;
};

/**
 * Appends a node with text or other nodes.
 * @param {!Document} doc The document to create new nodes in.
 * @param {!Node} parent The node to append nodes to.
 * @param {!Arguments} args The values to add. See `append`.
 * @param {number} startIndex The index of the array to start from.
 * @private
 */
function append_(doc, parent, args, startIndex) {
  function childHandler(child) {
    // TODO(user): More coercion, ala MochiKit?
    if (child) {
      parent.appendChild(
          typeof child === 'string' ? doc.createTextNode(child) : child);
    }
  }

  for (var i = startIndex; i < args.length; i++) {
    var arg = args[i];
    // TODO(attila): Fix isArrayLike to return false for a text node.
    if (google.isArrayLike(arg) && !isNodeLike(arg)) {
      // If the argument is a node list, not a real array, use a clone,
      // because forEach can't be used to mutate a NodeList.
      googarray.forEach(
          isNodeList(arg) ? googarray.toArray(arg) : arg,
          childHandler);
    } else {
      childHandler(arg);
    }
  }
};

/**
 * Alias for `createDom`.
 * @param {string|!TagName<T>} tagName Tag to create.
 * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
 *     of name-value pairs for attributes. If a string, then this is the
 *     className of the new element. If an array, the elements will be joined
 *     together as the className of the new element.
 * @param {...(Object|string|Array|NodeList|null|undefined)} var_args Further
 *     DOM nodes or strings for text nodes. If one of the var_args is an array,
 *     its children will be added as childNodes instead.
 * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
 *     is a string or a more specific type if it is a member of
 *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 * @deprecated Use {@link createDom} instead.
 */
let $dom = createDom;

/**
 * Creates a new element.
 * @param {string|!TagName<T>} name Tag to create.
 * @return {R} The new element. The return type is {!Element} if name is
 *     a string or a more specific type if it is a member of TagName
 *     (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
function createElement(name) {
  return createElement_(document, name);
};

/**
 * Creates a new element.
 * @param {!Document} doc The document to create the element in.
 * @param {string|!TagName<T>} name Tag to create.
 * @return {R} The new element. The return type is {!Element} if name is
 *     a string or a more specific type if it is a member of TagName
 *     (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 * @private
 */
function createElement_(doc, name) {
  name = String(name);
  if (doc.contentType === 'application/xhtml+xml') name = name.toLowerCase();
  return doc.createElement(name);
};

/**
 * Creates a new text node.
 * @param {number|string} content Content.
 * @return {!Text} The new text node.
 */
function createTextNode(content) {
  return document.createTextNode(String(content));
};

/**
 * Create a table.
 * @param {number} rows The number of rows in the table.  Must be >= 1.
 * @param {number} columns The number of columns in the table.  Must be >= 1.
 * @param {boolean=} opt_fillWithNbsp If true, fills table entries with
 *     `Unicode.NBSP` characters.
 * @return {!Element} The created table.
 */
function createTable(rows, columns, opt_fillWithNbsp) {
  // TODO(mlourenco): Return HTMLTableElement, also in prototype function.
  // Callers need to be updated to e.g. not assign numbers to table.cellSpacing.
  return createTable_(document, rows, columns, !!opt_fillWithNbsp);
};

/**
 * Create a table.
 * @param {!Document} doc Document object to use to create the table.
 * @param {number} rows The number of rows in the table.  Must be >= 1.
 * @param {number} columns The number of columns in the table.  Must be >= 1.
 * @param {boolean} fillWithNbsp If true, fills table entries with
 *     `Unicode.NBSP` characters.
 * @return {!HTMLTableElement} The created table.
 * @private
 */
function createTable_(doc, rows, columns, fillWithNbsp) {
  var table = createElement_(doc, TagName.TABLE);
  var tbody =
      table.appendChild(createElement_(doc, TagName.TBODY));
  for (var i = 0; i < rows; i++) {
    var tr = createElement_(doc, TagName.TR);
    for (var j = 0; j < columns; j++) {
      var td = createElement_(doc, TagName.TD);
      // IE <= 9 will create a text node if we set text content to the empty
      // string, so we avoid doing it unless necessary. This ensures that the
      // same DOM tree is returned on all browsers.
      if (fillWithNbsp) {
        setTextContent(td, Unicode.NBSP);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  return table;
};

/**
 * Creates a new Node from constant strings of HTML markup.
 * @param {...!Const} var_args The HTML strings to concatenate then
 *     convert into a node.
 * @return {!Node}
 */
function constHtmlToNode(var_args) {
  var stringArray = googarray.map(arguments, Const.unwrap);
  var safeHtml =
      uncheckedconversions
          .safeHtmlFromStringKnownToSatisfyTypeContract(
              Const.from(
                  'Constant HTML string, that gets turned into a ' +
                  'Node later, so it will be automatically balanced.'),
              stringArray.join(''));
  return safeHtmlToNode(safeHtml);
};

/**
 * Converts HTML markup into a node. This is a safe version of
 * `goog.dom.htmlToDocumentFragment` which is now deleted.
 * @param {!SafeHtml} html The HTML markup to convert.
 * @return {!Node} The resulting node.
 */
function safeHtmlToNode(html) {
  return safeHtmlToNode_(document, html);
};

/**
 * Helper for `safeHtmlToNode`.
 * @param {!Document} doc The document.
 * @param {!SafeHtml} html The HTML markup to convert.
 * @return {!Node} The resulting node.
 * @private
 */
function safeHtmlToNode_(doc, html) {
  var tempDiv = createElement_(doc, TagName.DIV);
  if (BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    domsafe.setInnerHtml(
        tempDiv, SafeHtml.concat(SafeHtml.BR, html));
    tempDiv.removeChild(goog_asserts.assert(tempDiv.firstChild));
  } else {
    domsafe.setInnerHtml(tempDiv, html);
  }
  return childrenToNode_(doc, tempDiv);
};

/**
 * Helper for `safeHtmlToNode_`.
 * @param {!Document} doc The document.
 * @param {!Node} tempDiv The input node.
 * @return {!Node} The resulting node.
 * @private
 */
function childrenToNode_(doc, tempDiv) {
  if (tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(goog_asserts.assert(tempDiv.firstChild));
  } else {
    var fragment = doc.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
};

/**
 * Returns true if the browser is in "CSS1-compatible" (standards-compliant)
 * mode, false otherwise.
 * @return {boolean} True if in CSS1-compatible mode.
 */
function isCss1CompatMode() {
  return isCss1CompatMode_(document);
};

/**
 * Returns true if the browser is in "CSS1-compatible" (standards-compliant)
 * mode, false otherwise.
 * @param {!Document} doc The document to check.
 * @return {boolean} True if in CSS1-compatible mode.
 * @private
 */
function isCss1CompatMode_(doc) {
  if (COMPAT_MODE_KNOWN_) {
    return ASSUME_STANDARDS_MODE;
  }

  return doc.compatMode == 'CSS1Compat';
};

/**
 * Determines if the given node can contain children, intended to be used for
 * HTML generation.
 *
 * IE natively supports node.canHaveChildren but has inconsistent behavior.
 * Prior to IE8 the base tag allows children and in IE9 all nodes return true
 * for canHaveChildren.
 *
 * In practice all non-IE browsers allow you to add children to any node, but
 * the behavior is inconsistent:
 *
 * <pre>
 *   var a = createElement(TagName.BR);
 *   a.appendChild(document.createTextNode('foo'));
 *   a.appendChild(document.createTextNode('bar'));
 *   console.log(a.childNodes.length);  // 2
 *   console.log(a.innerHTML);  // Chrome: "", IE9: "foobar", FF3.5: "foobar"
 * </pre>
 *
 * For more information, see:
 * http://dev.w3.org/html5/markup/syntax.html#syntax-elements
 *
 * TODO(user): Rename shouldAllowChildren() ?
 *
 * @param {Node} node The node to check.
 * @return {boolean} Whether the node can contain children.
 */
function canHaveChildren(node) {
  if (node.nodeType != NodeType.ELEMENT) {
    return false;
  }
  switch (/** @type {!Element} */ (node).tagName) {
    case String(TagName.APPLET):
    case String(TagName.AREA):
    case String(TagName.BASE):
    case String(TagName.BR):
    case String(TagName.COL):
    case String(TagName.COMMAND):
    case String(TagName.EMBED):
    case String(TagName.FRAME):
    case String(TagName.HR):
    case String(TagName.IMG):
    case String(TagName.INPUT):
    case String(TagName.IFRAME):
    case String(TagName.ISINDEX):
    case String(TagName.KEYGEN):
    case String(TagName.LINK):
    case String(TagName.NOFRAMES):
    case String(TagName.NOSCRIPT):
    case String(TagName.META):
    case String(TagName.OBJECT):
    case String(TagName.PARAM):
    case String(TagName.SCRIPT):
    case String(TagName.SOURCE):
    case String(TagName.STYLE):
    case String(TagName.TRACK):
    case String(TagName.WBR):
      return false;
  }
  return true;
};

/**
 * Appends a child to a node.
 * @param {Node} parent Parent.
 * @param {Node} child Child.
 * @deprecated Use Element.appendChild instead (dom.appendChild(p,c) -> p.appendChild(c))
 */
function appendChild(parent, child) {
  goog_asserts.assert(
      parent != null && child != null,
      'goog.dom.appendChild expects non-null arguments');
  parent.appendChild(child);
};

/**
 * Appends a node with text or other nodes.
 * @param {!Node} parent The node to append nodes to.
 * @param {...Appendable} var_args The things to append to the node.
 *     If this is a Node it is appended as is.
 *     If this is a string then a text node is appended.
 *     If this is an array like object then fields 0 to length - 1 are appended.
 */
function append(parent, var_args) {
  append_(getOwnerDocument(parent), parent, arguments, 1);
};

/**
 * Removes all the child nodes on a DOM node.
 * @param {Node} node Node to remove children from.
 */
function removeChildren(node) {
  // Note: Iterations over live collections can be slow, this is the fastest
  // we could find. The double parenthesis are used to prevent JsCompiler and
  // strict warnings.
  var child;
  while ((child = node.firstChild)) {
    node.removeChild(child);
  }
};

/**
 * Inserts a new node before an existing reference node (i.e. as the previous
 * sibling). If the reference node has no parent, then does nothing.
 * @param {Node} newNode Node to insert.
 * @param {Node} refNode Reference node to insert before.
 */
function insertSiblingBefore(newNode, refNode) {
  goog_asserts.assert(
      newNode != null && refNode != null,
      'goog.dom.insertSiblingBefore expects non-null arguments');
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
  }
};

/**
 * Inserts a new node after an existing reference node (i.e. as the next
 * sibling). If the reference node has no parent, then does nothing.
 * @param {Node} newNode Node to insert.
 * @param {Node} refNode Reference node to insert after.
 */
function insertSiblingAfter(newNode, refNode) {
  goog_asserts.assert(
      newNode != null && refNode != null,
      'goog.dom.insertSiblingAfter expects non-null arguments');
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
  }
};

/**
 * Insert a child at a given index. If index is larger than the number of child
 * nodes that the parent currently has, the node is inserted as the last child
 * node.
 * @param {Element} parent The element into which to insert the child.
 * @param {Node} child The element to insert.
 * @param {number} index The index at which to insert the new child node. Must
 *     not be negative.
 */
function insertChildAt(parent, child, index) {
  // Note that if the second argument is null, insertBefore
  // will append the child at the end of the list of children.
  goog_asserts.assert(
      parent != null, 'goog.dom.insertChildAt expects a non-null parent');
  parent.insertBefore(child, parent.childNodes[index] || null);
};

/**
 * Removes a node from its parent.
 * @param {Node} node The node to remove.
 * @return {Node} The node removed if removed; else, null.
 * @deprecated Use node.parentNode?.removeChild(node) instead
 */
function removeNode(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};

/**
 * Replaces a node in the DOM tree. Will do nothing if `oldNode` has no
 * parent.
 * @param {Node} newNode Node to insert.
 * @param {Node} oldNode Node to replace.
 */
function replaceNode(newNode, oldNode) {
  goog_asserts.assert(
      newNode != null && oldNode != null,
      'goog.dom.replaceNode expects non-null arguments');
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};

/**
 * Flattens an element. That is, removes it and replace it with its children.
 * Does nothing if the element is not in the document.
 * @param {Element} element The element to flatten.
 * @return {Element|undefined} The original element, detached from the document
 *     tree, sans children; or undefined, if the element was not in the document
 *     to begin with.
 */
function flattenElement(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != NodeType.DOCUMENT_FRAGMENT) {
    // Use IE DOM method (supported by Opera too) if available
    if (element.removeNode) {
      return /** @type {Element} */ (element.removeNode(false));
    } else {
      // Move all children of the original node up one level.
      while ((child = element.firstChild)) {
        parent.insertBefore(child, element);
      }

      // Detach the original element.
      return /** @type {Element} */ (removeNode(element));
    }
  }
};

/**
 * Returns an array containing just the element children of the given element.
 * @param {Element} element The element whose element children we want.
 * @return {!(Array<!Element>|NodeList<!Element>)} An array or array-like list
 *     of just the element children of the given element.
 */
function getChildren(element) {
  // We check if the children attribute is supported for child elements
  // since IE8 misuses the attribute by also including comments.
  if (BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE &&
      element.children != undefined) {
    return element.children;
  }
  // Fall back to manually filtering the element's child nodes.
  return googarray.filter(element.childNodes, function(node) {
    return node.nodeType == NodeType.ELEMENT;
  });
};

/**
 * Returns the first child node that is an element.
 * @param {Node} node The node to get the first child element of.
 * @return {Element} The first child node of `node` that is an element.
 */
function getFirstElementChild(node) {
  if (node.firstElementChild !== undefined) {
    return /** @type {!Element} */ (node).firstElementChild;
  }
  return getNextElementNode_(node.firstChild, true);
};

/**
 * Returns the last child node that is an element.
 * @param {Node} node The node to get the last child element of.
 * @return {Element} The last child node of `node` that is an element.
 */
function getLastElementChild(node) {
  if (node.lastElementChild !== undefined) {
    return /** @type {!Element} */ (node).lastElementChild;
  }
  return getNextElementNode_(node.lastChild, false);
};

/**
 * Returns the first next sibling that is an element.
 * @param {Node} node The node to get the next sibling element of.
 * @return {Element} The next sibling of `node` that is an element.
 */
function getNextElementSibling(node) {
  if (node.nextElementSibling !== undefined) {
    return /** @type {!Element} */ (node).nextElementSibling;
  }
  return getNextElementNode_(node.nextSibling, true);
};

/**
 * Returns the first previous sibling that is an element.
 * @param {Node} node The node to get the previous sibling element of.
 * @return {Element} The first previous sibling of `node` that is
 *     an element.
 */
function getPreviousElementSibling(node) {
  if (node.previousElementSibling !== undefined) {
    return /** @type {!Element} */ (node).previousElementSibling;
  }
  return getNextElementNode_(node.previousSibling, false);
};

/**
 * Returns the first node that is an element in the specified direction,
 * starting with `node`.
 * @param {Node} node The node to get the next element from.
 * @param {boolean} forward Whether to look forwards or backwards.
 * @return {Element} The first element.
 * @private
 */
function getNextElementNode_(node, forward) {
  while (node && node.nodeType != NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling;
  }

  return /** @type {Element} */ (node);
};

/**
 * Returns the next node in source order from the given node.
 * @param {Node} node The node.
 * @return {Node} The next node in the DOM tree, or null if this was the last
 *     node.
 */
function getNextNode(node) {
  if (!node) {
    return null;
  }

  if (node.firstChild) {
    return node.firstChild;
  }

  while (node && !node.nextSibling) {
    node = node.parentNode;
  }

  return node ? node.nextSibling : null;
};

/**
 * Returns the previous node in source order from the given node.
 * @param {Node} node The node.
 * @return {Node} The previous node in the DOM tree, or null if this was the
 *     first node.
 */
function getPreviousNode(node) {
  if (!node) {
    return null;
  }

  if (!node.previousSibling) {
    return node.parentNode;
  }

  node = node.previousSibling;
  while (node && node.lastChild) {
    node = node.lastChild;
  }

  return node;
};

/**
 * Whether the object looks like a DOM node.
 * @param {?} obj The object being tested for node likeness.
 * @return {boolean} Whether the object looks like a DOM node.
 */
function isNodeLike(obj) {
  return google.isObject(obj) && obj.nodeType > 0;
};

/**
 * Whether the object looks like an Element.
 * @param {?} obj The object being tested for Element likeness.
 * @return {boolean} Whether the object looks like an Element.
 */
function isElement(obj) {
  return google.isObject(obj) && obj.nodeType == NodeType.ELEMENT;
};

/**
 * Returns true if the specified value is a Window object. This includes the
 * global window for HTML pages, and iframe windows.
 * @param {?} obj Variable to test.
 * @return {boolean} Whether the variable is a window.
 */
function isWindow(obj) {
  return google.isObject(obj) && obj['window'] == obj;
};

/**
 * Returns an element's parent, if it's an Element.
 * @param {Element} element The DOM element.
 * @return {Element} The parent, or null if not an Element.
 * @deprecated Use Element.parentElement (or Element.parentNode)
 */
function getParentElement(element) {
  var parent;
  if (BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    var isIe9 = userAgent.IE && userAgent.isVersionOrHigher('9') &&
        !userAgent.isVersionOrHigher('10');
    // SVG elements in IE9 can't use the parentElement property.
    // window['SVGElement'] is not defined in IE9 quirks mode.
    if (!(isIe9 && window['SVGElement'] &&
          element instanceof window['SVGElement'])) {
      parent = element.parentElement;
      if (parent) {
        return parent;
      }
    }
  }
  parent = element.parentNode;
  return isElement(parent) ? /** @type {!Element} */ (parent) : null;
};

/**
 * Whether a node contains another node.
 * @param {?Node|undefined} parent The node that should contain the other node.
 * @param {?Node|undefined} descendant The node to test presence of.
 * @return {boolean} Whether the parent node contains the descendant node.
 */
function contains(parent, descendant) {
  if (!parent || !descendant) {
    return false;
  }
  // We use browser specific methods for this if available since it is faster
  // that way.

  // IE DOM
  if (parent.contains && descendant.nodeType == NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }

  // W3C DOM Level 3
  if (typeof parent.compareDocumentPosition != 'undefined') {
    return parent == descendant ||
        Boolean(parent.compareDocumentPosition(descendant) & 16);
  }

  // W3C DOM Level 1
  while (descendant && parent != descendant) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
};

/**
 * Compares the document order of two nodes, returning 0 if they are the same
 * node, a negative number if node1 is before node2, and a positive number if
 * node2 is before node1.  Note that we compare the order the tags appear in the
 * document so in the tree <b><i>text</i></b> the B node is considered to be
 * before the I node.
 *
 * @param {Node} node1 The first node to compare.
 * @param {Node} node2 The second node to compare.
 * @return {number} 0 if the nodes are the same node, a negative number if node1
 *     is before node2, and a positive number if node2 is before node1.
 */
function compareNodeOrder(node1, node2) {
  // Fall out quickly for equality.
  if (node1 == node2) {
    return 0;
  }

  // Use compareDocumentPosition where available
  if (node1.compareDocumentPosition) {
    // 4 is the bitmask for FOLLOWS.
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }

  // Special case for document nodes on IE 7 and 8.
  if (userAgent.IE && !userAgent.isDocumentModeOrHigher(9)) {
    if (node1.nodeType == NodeType.DOCUMENT) {
      return -1;
    }
    if (node2.nodeType == NodeType.DOCUMENT) {
      return 1;
    }
  }

  // Process in IE using sourceIndex - we check to see if the first node has
  // a source index or if its parent has one.
  if ('sourceIndex' in node1 ||
      (node1.parentNode && 'sourceIndex' in node1.parentNode)) {
    var isElement1 = node1.nodeType == NodeType.ELEMENT;
    var isElement2 = node2.nodeType == NodeType.ELEMENT;

    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    } else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;

      if (parent1 == parent2) {
        return compareSiblingOrder_(node1, node2);
      }

      if (!isElement1 && contains(parent1, node2)) {
        return -1 * compareParentsDescendantNodeIe_(node1, node2);
      }

      if (!isElement2 && contains(parent2, node1)) {
        return compareParentsDescendantNodeIe_(node2, node1);
      }

      return (isElement1 ? node1.sourceIndex : parent1.sourceIndex) -
          (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
    }
  }

  // For Safari, we compare ranges.
  var doc = getOwnerDocument(node1);

  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);

  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);

  return range1.compareBoundaryPoints(
      window['Range'].START_TO_END, range2);
};

/**
 * Utility function to compare the position of two nodes, when
 * `textNode`'s parent is an ancestor of `node`.  If this entry
 * condition is not met, this function will attempt to reference a null object.
 * @param {!Node} textNode The textNode to compare.
 * @param {Node} node The node to compare.
 * @return {number} -1 if node is before textNode, +1 otherwise.
 * @private
 */
function compareParentsDescendantNodeIe_(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    // If textNode is a child of node, then node comes first.
    return -1;
  }
  var sibling = node;
  while (sibling.parentNode != parent) {
    sibling = sibling.parentNode;
  }
  return compareSiblingOrder_(sibling, textNode);
};

/**
 * Utility function to compare the position of two nodes known to be non-equal
 * siblings.
 * @param {Node} node1 The first node to compare.
 * @param {!Node} node2 The second node to compare.
 * @return {number} -1 if node1 is before node2, +1 otherwise.
 * @private
 */
function compareSiblingOrder_(node1, node2) {
  var s = node2;
  while ((s = s.previousSibling)) {
    if (s == node1) {
      // We just found node1 before node2.
      return -1;
    }
  }

  // Since we didn't find it, node1 must be after node2.
  return 1;
};

/**
 * Find the deepest common ancestor of the given nodes.
 * @param {...Node} var_args The nodes to find a common ancestor of.
 * @return {Node} The common ancestor of the nodes, or null if there is none.
 *     null will only be returned if two or more of the nodes are from different
 *     documents.
 */
function findCommonAncestor(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  } else if (count == 1) {
    return arguments[0];
  }

  var paths = [];
  var minLength = Infinity;
  for (i = 0; i < count; i++) {
    // Compute the list of ancestors.
    var ancestors = [];
    var node = arguments[i];
    while (node) {
      ancestors.unshift(node);
      node = node.parentNode;
    }

    // Save the list for comparison.
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0; i < minLength; i++) {
    var first = paths[0][i];
    for (var j = 1; j < count; j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
};

/**
 * Returns whether node is in a document or detached. Throws an error if node
 * itself is a document. This specifically handles two cases beyond naive use of
 * builtins: (1) it works correctly in IE, and (2) it works for elements from
 * different documents/iframes. If neither of these considerations are relevant
 * then a simple `document.contains(node)` may be used instead.
 * @param {!Node} node
 * @return {boolean}
 */
function isInDocument(node) {
  return (node.ownerDocument.compareDocumentPosition(node) & 16) == 16;
};

/**
 * Returns the owner document for a node.
 * @param {Node|Window} node The node to get the document for.
 * @return {!Document} The document owning the node.
 */
function getOwnerDocument(node) {
  // TODO(nnaze): Update param signature to be non-nullable.
  goog_asserts.assert(node, 'Node cannot be null or undefined.');
  return /** @type {!Document} */ (
      node.nodeType == NodeType.DOCUMENT ? node : node.ownerDocument ||
              node.document);
};

/**
 * Cross-browser function for getting the document element of a frame or iframe.
 * @param {Element} frame Frame element.
 * @return {!Document} The frame content document.
 */
function getFrameContentDocument(frame) {
  return frame.contentDocument ||
      /** @type {!HTMLFrameElement} */ (frame).contentWindow.document;
};

/**
 * Cross-browser function for getting the window of a frame or iframe.
 * @param {Element} frame Frame element.
 * @return {Window} The window associated with the given frame, or null if none
 *     exists.
 */
function getFrameContentWindow(frame) {
  try {
    return frame.contentWindow ||
        (frame.contentDocument ? getWindow(frame.contentDocument) :
                                 null);
  } catch (e) {
    // NOTE(user): In IE8, checking the contentWindow or contentDocument
    // properties will throw a "Unspecified Error" exception if the iframe is
    // not inserted in the DOM. If we get this we can be sure that no window
    // exists, so return null.
  }
  return null;
};

/**
 * Sets the text content of a node, with cross-browser support.
 * @param {Node} node The node to change the text content of.
 * @param {string|number} text The value that should replace the node's content.
 */
function setTextContent(node, text) {
  goog_asserts.assert(
      node != null,
      'goog.dom.setTextContent expects a non-null value for node');

  if ('textContent' in node) {
    node.textContent = text;
  } else if (node.nodeType == NodeType.TEXT) {
    /** @type {!Text} */ (node).data = String(text);
  } else if (
      node.firstChild && node.firstChild.nodeType == NodeType.TEXT) {
    // If the first child is a text node we just change its data and remove the
    // rest of the children.
    while (node.lastChild != node.firstChild) {
      node.removeChild(goog_asserts.assert(node.lastChild));
    }
    /** @type {!Text} */ (node.firstChild).data = String(text);
  } else {
    removeChildren(node);
    var doc = getOwnerDocument(node);
    node.appendChild(doc.createTextNode(String(text)));
  }
};

/**
 * Gets the outerHTML of a node, which is like innerHTML, except that it
 * actually contains the HTML of the node itself.
 * @param {Element} element The element to get the HTML of.
 * @return {string} The outerHTML of the given element.
 */
function getOuterHtml(element) {
  goog_asserts.assert(
      element !== null,
      'goog.dom.getOuterHtml expects a non-null value for element');
  // IE, Opera and WebKit all have outerHTML.
  if ('outerHTML' in element) {
    return element.outerHTML;
  } else {
    var doc = getOwnerDocument(element);
    var div = createElement_(doc, TagName.DIV);
    div.appendChild(element.cloneNode(true));
    return div.innerHTML;
  }
};

/**
 * Finds the first descendant node that matches the filter function, using depth
 * first search. This function offers the most general purpose way of finding a
 * matching element.
 *
 * Prefer using `querySelector` if the matching criteria can be expressed as a
 * CSS selector, or `findElement` if you would filter for `nodeType ==
 * Node.ELEMENT_NODE`.
 *
 * @param {Node} root The root of the tree to search.
 * @param {function(Node) : boolean} p The filter function.
 * @return {Node|undefined} The found node or undefined if none is found.
 */
function findNode(root, p) {
  var rv = [];
  var found = findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined;
};

/**
 * Finds all the descendant nodes that match the filter function, using depth
 * first search. This function offers the most general-purpose way
 * of finding a set of matching elements.
 *
 * Prefer using `querySelectorAll` if the matching criteria can be expressed as
 * a CSS selector, or `findElements` if you would filter for
 * `nodeType == Node.ELEMENT_NODE`.
 *
 * @param {Node} root The root of the tree to search.
 * @param {function(Node) : boolean} p The filter function.
 * @return {!Array<!Node>} The found nodes or an empty array if none are found.
 */
function findNodes(root, p) {
  var rv = [];
  findNodes_(root, p, rv, false);
  return rv;
};

/**
 * Finds the first or all the descendant nodes that match the filter function,
 * using a depth first search.
 * @param {Node} root The root of the tree to search.
 * @param {function(Node) : boolean} p The filter function.
 * @param {!Array<!Node>} rv The found nodes are added to this array.
 * @param {boolean} findOne If true we exit after the first found node.
 * @return {boolean} Whether the search is complete or not. True in case findOne
 *     is true and the node is found. False otherwise.
 * @private
 */
function findNodes_(root, p, rv, findOne) {
  if (root != null) {
    var child = root.firstChild;
    while (child) {
      if (p(child)) {
        rv.push(child);
        if (findOne) {
          return true;
        }
      }
      if (findNodes_(child, p, rv, findOne)) {
        return true;
      }
      child = child.nextSibling;
    }
  }
  return false;
};

/**
 * Finds the first descendant element (excluding `root`) that matches the filter
 * function, using depth first search. Prefer using `querySelector` if the
 * matching criteria can be expressed as a CSS selector.
 *
 * @param {!Element | !Document} root
 * @param {function(!Element): boolean} pred Filter function.
 * @return {?Element} First matching element or null if there is none.
 */
function findElement(root, pred) {
  var stack = getChildrenReverse_(root);
  while (stack.length > 0) {
    var next = stack.pop();
    if (pred(next)) return next;
    for (var c = next.lastElementChild; c; c = c.previousElementSibling) {
      stack.push(c);
    }
  }
  return null;
};

/**
 * Finds all the descendant elements (excluding `root`) that match the filter
 * function, using depth first search. Prefer using `querySelectorAll` if the
 * matching criteria can be expressed as a CSS selector.
 *
 * @param {!Element | !Document} root
 * @param {function(!Element): boolean} pred Filter function.
 * @return {!Array<!Element>}
 */
function findElements(root, pred) {
  var result = [], stack = getChildrenReverse_(root);
  while (stack.length > 0) {
    var next = stack.pop();
    if (pred(next)) result.push(next);
    for (var c = next.lastElementChild; c; c = c.previousElementSibling) {
      stack.push(c);
    }
  }
  return result;
};

/**
 * @param {!Element | !Document} node
 * @return {!Array<!Element>} node's child elements in reverse order.
 * @private
 */
function getChildrenReverse_(node) {
  // document.lastElementChild doesn't exist in IE9; fall back to
  // documentElement.
  if (node.nodeType == NodeType.DOCUMENT) {
    return [node.documentElement];
  } else {
    var children = [];
    for (var c = node.lastElementChild; c; c = c.previousElementSibling) {
      children.push(c);
    }
    return children;
  }
};

/**
 * Map of tags whose content to ignore when calculating text length.
 * @private {!Object<string, number>}
 * @const
 */
let TAGS_TO_IGNORE_ = {
  'SCRIPT': 1,
  'STYLE': 1,
  'HEAD': 1,
  'IFRAME': 1,
  'OBJECT': 1
};

/**
 * Map of tags which have predefined values with regard to whitespace.
 * @private {!Object<string, string>}
 * @const
 */
let PREDEFINED_TAG_VALUES_ = {
  'IMG': ' ',
  'BR': '\n'
};

/**
 * Returns true if the element has a tab index that allows it to receive
 * keyboard focus (tabIndex >= 0), false otherwise.  Note that some elements
 * natively support keyboard focus, even if they have no tab index.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element has a tab index that allows keyboard
 *     focus.
 */
function isFocusableTabIndex(element) {
  return hasSpecifiedTabIndex_(element) &&
      isTabIndexFocusable_(element);
};

/**
 * Enables or disables keyboard focus support on the element via its tab index.
 * Only elements for which {@link isFocusableTabIndex} returns true
 * (or elements that natively support keyboard focus, like form elements) can
 * receive keyboard focus.  See http://go/tabindex for more info.
 * @param {Element} element Element whose tab index is to be changed.
 * @param {boolean} enable Whether to set or remove a tab index on the element
 *     that supports keyboard focus.
 */
function setFocusableTabIndex(element, enable) {
  if (enable) {
    element.tabIndex = 0;
  } else {
    // Set tabIndex to -1 first, then remove it. This is a workaround for
    // Safari (confirmed in version 4 on Windows). When removing the attribute
    // without setting it to -1 first, the element remains keyboard focusable
    // despite not having a tabIndex attribute anymore.
    element.tabIndex = -1;
    element.removeAttribute('tabIndex');  // Must be camelCase!
  }
};

/**
 * Returns true if the element can be focused, i.e. it has a tab index that
 * allows it to receive keyboard focus (tabIndex >= 0), or it is an element
 * that natively supports keyboard focus.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element allows keyboard focus.
 */
function isFocusable(element) {
  var focusable;
  // Some elements can have unspecified tab index and still receive focus.
  if (nativelySupportsFocus_(element)) {
    // Make sure the element is not disabled ...
    focusable = !element.disabled &&
        // ... and if a tab index is specified, it allows focus.
        (!hasSpecifiedTabIndex_(element) ||
         isTabIndexFocusable_(element));
  } else {
    focusable = isFocusableTabIndex(element);
  }

  // IE requires elements to be visible in order to focus them.
  return focusable && userAgent.IE ?
      hasNonZeroBoundingRect_(/** @type {!HTMLElement} */ (element)) :
      focusable;
};

/**
 * Returns true if the element has a specified tab index.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element has a specified tab index.
 * @private
 */
function hasSpecifiedTabIndex_(element) {
  // IE8 and below don't support hasAttribute(), instead check whether the
  // 'tabindex' attributeNode is specified. Otherwise check hasAttribute().
  if (userAgent.IE && !userAgent.isVersionOrHigher('9')) {
    var attrNode = element.getAttributeNode('tabindex');  // Must be lowercase!
    return attrNode != null && attrNode.specified;
  } else {
    return element.hasAttribute('tabindex');
  }
};

/**
 * Returns true if the element's tab index allows the element to be focused.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element's tab index allows focus.
 * @private
 */
function isTabIndexFocusable_(element) {
  var index = /** @type {!HTMLElement} */ (element).tabIndex;
  // NOTE: IE9 puts tabIndex in 16-bit int, e.g. -2 is 65534.
  return typeof (index) === 'number' && index >= 0 && index < 32768;
};

/**
 * Returns true if the element is focusable even when tabIndex is not set.
 * @param {!Element} element Element to check.
 * @return {boolean} Whether the element natively supports focus.
 * @private
 */
function nativelySupportsFocus_(element) {
  return (
      element.tagName == TagName.A && element.hasAttribute('href') ||
      element.tagName == TagName.INPUT ||
      element.tagName == TagName.TEXTAREA ||
      element.tagName == TagName.SELECT ||
      element.tagName == TagName.BUTTON);
};

/**
 * Returns true if the element has a bounding rectangle that would be visible
 * (i.e. its width and height are greater than zero).
 * @param {!HTMLElement} element Element to check.
 * @return {boolean} Whether the element has a non-zero bounding rectangle.
 * @private
 */
function hasNonZeroBoundingRect_(element) {
  var rect;
  if (!google.isFunction(element['getBoundingClientRect']) ||
      // In IE, getBoundingClientRect throws on detached nodes.
      (userAgent.IE && element.parentElement == null)) {
    rect = {'height': element.offsetHeight, 'width': element.offsetWidth};
  } else {
    rect = element.getBoundingClientRect();
  }
  return rect != null && rect.height > 0 && rect.width > 0;
};

/**
 * Returns the text content of the current node, without markup and invisible
 * symbols. New lines are stripped and whitespace is collapsed,
 * such that each character would be visible.
 *
 * In browsers that support it, innerText is used.  Other browsers attempt to
 * simulate it via node traversal.  Line breaks are canonicalized in IE.
 *
 * @param {Node} node The node from which we are getting content.
 * @return {string} The text content.
 */
function getTextContent(node) {
  var textContent;
  // Note(arv): IE9, Opera, and Safari 3 support innerText but they include
  // text nodes in script tags. So we revert to use a user agent test here.
  if (BrowserFeature.CAN_USE_INNER_TEXT && node !== null &&
      ('innerText' in node)) {
    textContent = strings.canonicalizeNewlines(node.innerText);
    // Unfortunately .innerText() returns text with &shy; symbols
    // We need to filter it out and then remove duplicate whitespaces
  } else {
    var buf = [];
    getTextContent_(node, buf, true);
    textContent = buf.join('');
  }

  // Strip &shy; entities. goog.format.insertWordBreaks inserts them in Opera.
  textContent = textContent.replace(/ \xAD /g, ' ').replace(/\xAD/g, '');
  // Strip &#8203; entities. goog.format.insertWordBreaks inserts them in IE8.
  textContent = textContent.replace(/\u200B/g, '');

  // Skip this replacement on old browsers with working innerText, which
  // automatically turns &nbsp; into ' ' and / +/ into ' ' when reading
  // innerText.
  if (!BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, ' ');
  }
  if (textContent != ' ') {
    textContent = textContent.replace(/^\s*/, '');
  }

  return textContent;
};

/**
 * Returns the text content of the current node, without markup.
 *
 * Unlike `getTextContent` this method does not collapse whitespaces
 * or normalize lines breaks.
 *
 * @param {Node} node The node from which we are getting content.
 * @return {string} The raw text content.
 */
function getRawTextContent(node) {
  var buf = [];
  getTextContent_(node, buf, false);

  return buf.join('');
};

/**
 * Recursive support function for text content retrieval.
 *
 * @param {Node} node The node from which we are getting content.
 * @param {Array<string>} buf string buffer.
 * @param {boolean} normalizeWhitespace Whether to normalize whitespace.
 * @private
 */
function getTextContent_(node, buf, normalizeWhitespace) {
  if (node.nodeName in TAGS_TO_IGNORE_) {
    // ignore certain tags
  } else if (node.nodeType == NodeType.TEXT) {
    if (normalizeWhitespace) {
      buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ''));
    } else {
      buf.push(node.nodeValue);
    }
  } else if (node.nodeName in PREDEFINED_TAG_VALUES_) {
    buf.push(PREDEFINED_TAG_VALUES_[node.nodeName]);
  } else {
    var child = node.firstChild;
    while (child) {
      getTextContent_(child, buf, normalizeWhitespace);
      child = child.nextSibling;
    }
  }
};

/**
 * Returns the text length of the text contained in a node, without markup. This
 * is equivalent to the selection length if the node was selected, or the number
 * of cursor movements to traverse the node. Images & BRs take one space.  New
 * lines are ignored.
 *
 * @param {Node} node The node whose text content length is being calculated.
 * @return {number} The length of `node`'s text content.
 */
function getNodeTextLength(node) {
  return getTextContent(node).length;
};

/**
 * Returns the text offset of a node relative to one of its ancestors. The text
 * length is the same as the length calculated by getNodeTextLength.
 *
 * @param {Node} node The node whose offset is being calculated.
 * @param {Node=} opt_offsetParent The node relative to which the offset will
 *     be calculated. Defaults to the node's owner document's body.
 * @return {number} The text offset.
 */
function getNodeTextOffset(node, opt_offsetParent) {
  var root = opt_offsetParent || getOwnerDocument(node).body;
  var buf = [];
  while (node && node != root) {
    var cur = node;
    while ((cur = cur.previousSibling)) {
      buf.unshift(getTextContent(cur));
    }
    node = node.parentNode;
  }
  // Trim left to deal with FF cases when there might be line breaks and empty
  // nodes at the front of the text
  return strings.trimLeft(buf.join('')).replace(/ +/g, ' ').length;
};

/**
 * Returns the node at a given offset in a parent node.  If an object is
 * provided for the optional third parameter, the node and the remainder of the
 * offset will stored as properties of this object.
 * @param {Node} parent The parent node.
 * @param {number} offset The offset into the parent node.
 * @param {Object=} opt_result Object to be used to store the return value. The
 *     return value will be stored in the form {node: Node, remainder: number}
 *     if this object is provided.
 * @return {Node} The node at the given offset.
 */
function getNodeAtOffset(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur = null;
  while (stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if (cur.nodeName in TAGS_TO_IGNORE_) {
      // ignore certain tags
    } else if (cur.nodeType == NodeType.TEXT) {
      var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, '').replace(/ +/g, ' ');
      pos += text.length;
    } else if (cur.nodeName in PREDEFINED_TAG_VALUES_) {
      pos += PREDEFINED_TAG_VALUES_[cur.nodeName].length;
    } else {
      for (var i = cur.childNodes.length - 1; i >= 0; i--) {
        stack.push(cur.childNodes[i]);
      }
    }
  }
  if (google.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur;
  }

  return cur;
};

/**
 * Returns true if the object is a `NodeList`.  To qualify as a NodeList,
 * the object must have a numeric length property and an item function (which
 * has type 'string' on IE for some reason).
 * @param {Object} val Object to test.
 * @return {boolean} Whether the object is a NodeList.
 */
function isNodeList(val) {
  // TODO(attila): Now the isNodeList is part of google.dom we can use
  // userAgent to make this simpler.
  // A NodeList must have a length property of type 'number' on all platforms.
  if (val && typeof val.length == 'number') {
    // A NodeList is an object everywhere except Safari, where it's a function.
    if (google.isObject(val)) {
      // A NodeList must have an item function (on non-IE platforms) or an item
      // property of type 'string' (on IE).
      return typeof val.item == 'function' || typeof val.item == 'string';
    } else if (google.isFunction(val)) {
      // On Safari, a NodeList is a function with an item property that is also
      // a function.
      return typeof /** @type {?} */ (val.item) == 'function';
    }
  }

  // Not a NodeList.
  return false;
};

/**
 * Walks up the DOM hierarchy returning the first ancestor that has the passed
 * tag name and/or class name. If the passed element matches the specified
 * criteria, the element itself is returned.
 * @param {Node} element The DOM node to start with.
 * @param {?(TagName<T>|string)=} opt_tag The tag name to match (or
 *     null/undefined to match only based on class name).
 * @param {?string=} opt_class The class name to match (or null/undefined to
 *     match only based on tag name).
 * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
 *     dom.
 * @return {?R} The first ancestor that matches the passed criteria, or
 *     null if no match is found. The return type is {?Element} if opt_tag is
 *     not a member of TagName or a more specific type if it is (e.g.
 *     {?HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
function getAncestorByTagNameAndClass(
    element, opt_tag, opt_class, opt_maxSearchSteps) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? String(opt_tag).toUpperCase() : null;
  return /** @type {Element} */ (getAncestor(element, function(node) {
    return (!tagName || node.nodeName == tagName) &&
        (!opt_class ||
         typeof node.className === 'string' &&
             googarray.contains(node.className.split(/\s+/), opt_class));
  }, true, opt_maxSearchSteps));
};

/**
 * Walks up the DOM hierarchy returning the first ancestor that has the passed
 * class name. If the passed element matches the specified criteria, the
 * element itself is returned.
 * @param {Node} element The DOM node to start with.
 * @param {string} className The class name to match.
 * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
 *     dom.
 * @return {Element} The first ancestor that matches the passed criteria, or
 *     null if none match.
 */
function getAncestorByClass(element, className, opt_maxSearchSteps) {
  return getAncestorByTagNameAndClass(
      element, null, className, opt_maxSearchSteps);
};

/**
 * Walks up the DOM hierarchy returning the first ancestor that passes the
 * matcher function.
 * @param {Node} element The DOM node to start with.
 * @param {function(Node) : boolean} matcher A function that returns true if the
 *     passed node matches the desired criteria.
 * @param {boolean=} opt_includeNode If true, the node itself is included in
 *     the search (the first call to the matcher will pass startElement as
 *     the node to test).
 * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
 *     dom.
 * @return {Node} DOM node that matched the matcher, or null if there was
 *     no match.
 */
function getAncestor(
    element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if (element && !opt_includeNode) {
    element = element.parentNode;
  }
  var steps = 0;
  while (element &&
         (opt_maxSearchSteps == null || steps <= opt_maxSearchSteps)) {
    goog_asserts.assert(element.name != 'parentNode');
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  // Reached the root of the DOM without a match
  return null;
};

/**
 * Determines the active element in the given document.
 * @param {Document} doc The document to look in.
 * @return {Element} The active element.
 */
function getActiveElement(doc) {
  // While in an iframe, IE9 will throw "Unspecified error" when accessing
  // activeElement.
  try {
    var activeElement = doc && doc.activeElement;
    // While not in an iframe, IE9-11 sometimes gives null.
    // While in an iframe, IE11 sometimes returns an empty object.
    return activeElement && activeElement.nodeName ? activeElement : null;
  } catch (e) {
    return null;
  }
};

/**
 * Gives the current devicePixelRatio.
 *
 * By default, this is the value of window.devicePixelRatio (which should be
 * preferred if present).
 *
 * If window.devicePixelRatio is not present, the ratio is calculated with
 * window.matchMedia, if present. Otherwise, gives 1.0.
 *
 * Some browsers (including Chrome) consider the browser zoom level in the pixel
 * ratio, so the value may change across multiple calls.
 *
 * @return {number} The number of actual pixels per virtual pixel.
 */
function getPixelRatio() {
  var win = getWindow();
  if (win.devicePixelRatio !== undefined) {
    return win.devicePixelRatio;
  } else if (win.matchMedia) {
    // Should be for IE10 and FF6-17 (this basically clamps to lower)
    // Note that the order of these statements is important
    return matchesPixelRatio_(3) || matchesPixelRatio_(2) ||
           matchesPixelRatio_(1.5) || matchesPixelRatio_(1) ||
           .75;
  }
  return 1;
};

/**
 * Calculates a mediaQuery to check if the current device supports the
 * given actual to virtual pixel ratio.
 * @param {number} pixelRatio The ratio of actual pixels to virtual pixels.
 * @return {number} pixelRatio if applicable, otherwise 0.
 * @private
 */
function matchesPixelRatio_(pixelRatio) {
  var win = getWindow();
  /**
   * Due to the 1:96 fixed ratio of CSS in to CSS px, 1dppx is equivalent to
   * 96dpi.
   * @const {number}
   */
  var dpiPerDppx = 96;
  var query =
      // FF16-17
      '(min-resolution: ' + pixelRatio + 'dppx),' +
      // FF6-15
      '(min--moz-device-pixel-ratio: ' + pixelRatio + '),' +
      // IE10 (this works for the two browsers above too but I don't want to
      // trust the 1:96 fixed ratio magic)
      '(min-resolution: ' + (pixelRatio * dpiPerDppx) + 'dpi)';
  return win.matchMedia(query).matches ? pixelRatio : 0;
};

/**
 * Gets '2d' context of a canvas. Shortcut for canvas.getContext('2d') with a
 * type information.
 * @param {!HTMLCanvasElement|!OffscreenCanvas} canvas
 * @return {!CanvasRenderingContext2D}
 */
function getCanvasContext2D(canvas) {
  return /** @type {!CanvasRenderingContext2D} */ (canvas.getContext('2d'));
};

/**
 * Create an instance of a DOM helper with a new document object.
 *     DOM helper.
 */
class DomHelper {

  /**
   * Create an instance of a DOM helper with a new document object.
   * @param {Document=} opt_document Document object to associate with this
   *     DOM helper.
   */
  constructor(opt_document) {
    /**
     * Reference to the document object to use
     * @type {!Document}
     * @private
     */
    this.document_ = opt_document || window.document || document;
  }

  /**
   * Gets the dom helper object for the document where the element resides.
   * @param {Node=} opt_node If present, gets the DomHelper for this node.
   * @return {!DomHelper} The DomHelper.
   */
  getDomHelper(opt_node) {
    return getDomHelper(opt_node);
  }

  /**
   * Sets the document object.
   * @param {!Document} document Document object.
   */
  setDocument(document) {
    this.document_ = document;
  };

  /**
   * Gets the document object being used by the dom library.
   * @return {!Document} Document object.
   */
  getDocument() {
    return this.document_;
  };

  /**
   * Alias for `getElementById`. If a DOM node is passed in then we just
   * return that.
   * @param {string|Element} element Element ID or a DOM node.
   * @return {Element} The element with the given ID, or the node passed in.
   */
  getElement(element) {
    return getElementHelper_(this.document_, element);
  };

  /**
   * Gets an element by id, asserting that the element is found.
   *
   * This is used when an element is expected to exist, and should fail with
   * an assertion error if it does not (if assertions are enabled).
   *
   * @param {string} id Element ID.
   * @return {!Element} The element with the given ID, if it exists.
   */
  getRequiredElement(id) {
    return getRequiredElementHelper_(this.document_, id);
  };

  /**
   * Gets elements by tag name.
   * @param {!TagName<T>} tagName
   * @param {(!Document|!Element)=} opt_parent Parent element or document where to
   *     look for elements. Defaults to document of this DomHelper.
   * @return {!NodeList<R>} List of elements. The members of the list are
   *     {!Element} if tagName is not a member of TagName or more
   *     specific types if it is (e.g. {!HTMLAnchorElement} for
   *     TagName.A).
   * @template T
   * @template R := cond(isUnknown(T), 'Element', T) =:
   */
  getElementsByTagName(tagName, opt_parent) {
    var parent = opt_parent || this.document_;
    return parent.getElementsByTagName(String(tagName));
  };

  /**
   * Looks up elements by both tag and class name, using browser native functions
   * (`querySelectorAll`, `getElementsByTagName` or
   * `getElementsByClassName`) where possible. The returned array is a live
   * NodeList or a static list depending on the code path taken.
   *
   * @param {(string|?TagName<T>)=} opt_tag Element tag name or * for all
   *     tags.
   * @param {?string=} opt_class Optional class name.
   * @param {(Document|Element)=} opt_el Optional element to look in.
   * @return {!IArrayLike<R>} Array-like list of elements (only a length property
   *     and numerical indices are guaranteed to exist). The members of the array
   *     are {!Element} if opt_tag is not a member of TagName or more
   *     specific types if it is (e.g. {!HTMLAnchorElement} for
   *     TagName.A).
   * @template T
   * @template R := cond(isUnknown(T), 'Element', T) =:
   */
  getElementsByTagNameAndClass(
      opt_tag, opt_class, opt_el) {
    return getElementsByTagNameAndClass_(
        this.document_, opt_tag, opt_class, opt_el);
  };

  /**
   * Gets the first element matching the tag and the class.
   *
   * @param {(string|?TagName<T>)=} opt_tag Element tag name.
   * @param {?string=} opt_class Optional class name.
   * @param {(Document|Element)=} opt_el Optional element to look in.
   * @return {?R} Reference to a DOM node. The return type is {?Element} if
   *     tagName is a string or a more specific type if it is a member of
   *     TagName (e.g. {?HTMLAnchorElement} for TagName.A).
   * @template T
   * @template R := cond(isUnknown(T), 'Element', T) =:
   */
  getElementByTagNameAndClass(
      opt_tag, opt_class, opt_el) {
    return getElementByTagNameAndClass_(
        this.document_, opt_tag, opt_class, opt_el);
  };

  /**
   * Returns an array of all the elements with the provided className.
   * @param {string} className the name of the class to look for.
   * @param {Element|Document=} opt_el Optional element to look in.
   * @return {!IArrayLike<!Element>} The items found with the class name provided.
   */
  getElementsByClass(className, opt_el) {
    var doc = opt_el || this.document_;
    return getElementsByClass(className, doc);
  };

  /**
   * Returns the first element we find matching the provided class name.
   * @param {string} className the name of the class to look for.
   * @param {(Element|Document)=} opt_el Optional element to look in.
   * @return {Element} The first item found with the class name provided.
   */
  getElementByClass(className, opt_el) {
    var doc = opt_el || this.document_;
    return getElementByClass(className, doc);
  };

  /**
   * Ensures an element with the given className exists, and then returns the
   * first element with the provided className.
   * @param {string} className the name of the class to look for.
   * @param {(!Element|!Document)=} opt_root Optional element or document to look
   *     in.
   * @return {!Element} The first item found with the class name provided.
   * @throws {AssertionError} Thrown if no element is found.
   */
  getRequiredElementByClass(
      className, opt_root) {
    var root = opt_root || this.document_;
    return getRequiredElementByClass(className, root);
  };

  /**
   * Sets a number of properties on a node.
   * @param {Element} element DOM node to set properties on.
   * @param {Object} properties Hash of property:value pairs.
   */
  setProperties(element, properties) {
    return setProperties(element, properties);
  }

  /**
   * Gets the dimensions of the viewport.
   * @param {Window=} opt_window Optional window element to test. Defaults to
   *     the window of the Dom Helper.
   * @return {!Size} Object with values 'width' and 'height'.
   */
  getViewportSize(opt_window) {
    // TODO(arv): This should not take an argument. That breaks the rule of a
    // a DomHelper representing a single frame/window/document.
    return getViewportSize(opt_window || this.getWindow());
  };

  /**
   * Calculates the height of the document.
   *
   * @return {number} The height of the document.
   */
  getDocumentHeight() {
    return getDocumentHeight_(this.getWindow());
  };

  /**
   * Returns a dom node with a set of attributes.  This function accepts varargs
   * for subsequent nodes to be added.  Subsequent nodes will be added to the
   * first node as childNodes.
   *
   * So:
   * <code>createDom(TagName.DIV, null, createDom(TagName.P),
   * createDom(TagName.P));</code> would return a div with two child
   * paragraphs
   *
   * An easy way to move all child nodes of an existing element to a new parent
   * element is:
   * <code>createDom(TagName.DIV, null, oldElement.childNodes);</code>
   * which will remove all child nodes from the old element and add them as
   * child nodes of the new DIV.
   *
   * @param {string|!TagName<T>} tagName Tag to create.
   * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
   *     of name-value pairs for attributes. If a string, then this is the
   *     className of the new element. If an array, the elements will be joined
   *     together as the className of the new element.
   * @param {...(Appendable|undefined)} var_args Further DOM nodes or
   *     strings for text nodes. If one of the var_args is an array or
   *     NodeList, its elements will be added as childNodes instead.
   * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
   *     is a string or a more specific type if it is a member of
   *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
   * @template T
   * @template R := cond(isUnknown(T), 'Element', T) =:
   */
  createDom(
      tagName, opt_attributes, var_args) {
    return createDom_(this.document_, arguments);
  };

  /**
   * Creates a new element.
   * @param {string|!TagName<T>} name Tag to create.
   * @return {R} The new element. The return type is {!Element} if name is
   *     a string or a more specific type if it is a member of TagName
   *     (e.g. {!HTMLAnchorElement} for TagName.A).
   * @template T
   * @template R := cond(isUnknown(T), 'Element', T) =:
   */
  createElement(name) {
    return createElement_(this.document_, name);
  };

  /**
   * Creates a new text node.
   * @param {number|string} content Content.
   * @return {!Text} The new text node.
   */
  createTextNode(content) {
    return this.document_.createTextNode(String(content));
  };

  /**
   * Create a table.
   * @param {number} rows The number of rows in the table.  Must be >= 1.
   * @param {number} columns The number of columns in the table.  Must be >= 1.
   * @param {boolean=} opt_fillWithNbsp If true, fills table entries with
   *     `Unicode.NBSP` characters.
   * @return {!HTMLElement} The created table.
   */
  createTable(
      rows, columns, opt_fillWithNbsp) {
    return createTable_(
        this.document_, rows, columns, !!opt_fillWithNbsp);
  };

  /**
   * Converts an HTML into a node or a document fragment. A single Node is used if
   * `html` only generates a single node. If `html` generates multiple
   * nodes then these are put inside a `DocumentFragment`. This is a safe
   * version of `DomHelper#htmlToDocumentFragment` which is now
   * deleted.
   * @param {!SafeHtml} html The HTML markup to convert.
   * @return {!Node} The resulting node.
   */
  safeHtmlToNode(html) {
    return safeHtmlToNode_(this.document_, html);
  };

  /**
   * Returns true if the browser is in "CSS1-compatible" (standards-compliant)
   * mode, false otherwise.
   * @return {boolean} True if in CSS1-compatible mode.
   */
  isCss1CompatMode() {
    return isCss1CompatMode_(this.document_);
  };

  /**
   * Gets the window object associated with the document.
   * @return {!Window} The window associated with the given document.
   */
  getWindow() {
    return getWindow_(this.document_);
  };

  /**
   * Gets the document scroll element.
   * @return {!Element} Scrolling element.
   */
  getDocumentScrollElement() {
    return getDocumentScrollElement_(this.document_);
  };

  /**
   * Gets the document scroll distance as a coordinate object.
   * @return {!Coordinate} Object with properties 'x' and 'y'.
   */
  getDocumentScroll() {
    return getDocumentScroll_(this.document_);
  };

  /**
   * Determines the active element in the given document.
   * @param {Document=} opt_doc The document to look in.
   * @return {Element} The active element.
   */
  getActiveElement(opt_doc) {
    return getActiveElement(opt_doc || this.document_);
  };

  /**
   * Appends a child to a node.
   * @param {Node} parent Parent.
   * @param {Node} child Child.
   */
  appendChild(parent, child) {
    return appendChild(parent, child);
  }

  /**
   * Appends a node with text or other nodes.
   * @param {!Node} parent The node to append nodes to.
   * @param {...Appendable} var_args The things to append to the node.
   *     If this is a Node it is appended as is.
   *     If this is a string then a text node is appended.
   *     If this is an array like object then fields 0 to length - 1 are appended.
   */
  append(parent, var_args) {
    return append(parent, var_args);
  }

  /**
   * Determines if the given node can contain children, intended to be used for
   * HTML generation.
   *
   * @param {Node} node The node to check.
   * @return {boolean} Whether the node can contain children.
   */
  canHaveChildren(node) {
    return canHaveChildren(node);
  }

  /**
   * Removes all the child nodes on a DOM node.
   * @param {Node} node Node to remove children from.
   */
  removeChildren(node) {
    return removeChildren(node);
  }

  /**
   * Inserts a new node before an existing reference node (i.e., as the previous
   * sibling). If the reference node has no parent, then does nothing.
   * @param {Node} newNode Node to insert.
   * @param {Node} refNode Reference node to insert before.
   */
  insertSiblingBefore(newNode, refNode) {
    return insertSiblingBefore(newNode, refNode);
  }

  /**
   * Inserts a new node after an existing reference node (i.e., as the next
   * sibling). If the reference node has no parent, then does nothing.
   * @param {Node} newNode Node to insert.
   * @param {Node} refNode Reference node to insert after.
   */
  insertSiblingAfter(newNode, refNode) {
    return insertSiblingAfter(newNode, refNode);
  }

  /**
   * Insert a child at a given index. If index is larger than the number of child
   * nodes that the parent currently has, the node is inserted as the last child
   * node.
   * @param {Element} parent The element into which to insert the child.
   * @param {Node} child The element to insert.
   * @param {number} index The index at which to insert the new child node. Must
   *     not be negative.
   */
  insertChildAt(parent, child, index) {
    return insertChildAt(parent, child, index);
  }

  /**
   * Removes a node from its parent.
   * @param {Node} node The node to remove.
   * @return {Node} The node removed if removed; else, null.
   */
  removeNode(node) {
    return removeNode(node);
  }

  /**
   * Replaces a node in the DOM tree. Will do nothing if `oldNode` has no
   * parent.
   * @param {Node} newNode Node to insert.
   * @param {Node} oldNode Node to replace.
   */
  replaceNode(newNode, oldNode) {
    return replaceNode(newNode, oldNode);
  }

  /**
   * Flattens an element. That is, removes it and replace it with its children.
   * @param {Element} element The element to flatten.
   * @return {Element|undefined} The original element, detached from the document
   *     tree, sans children, or undefined if the element was already not in the
   *     document.
   */
  flattenElement(element) {
    return flattenElement(element);
  }

  /**
   * Returns an array containing just the element children of the given element.
   * @param {Element} element The element whose element children we want.
   * @return {!(Array<!Element>|NodeList<!Element>)} An array or array-like list
   *     of just the element children of the given element.
   */
  getChildren(element) {
    return getChildren(element);
  }

  /**
   * Returns the first child node that is an element.
   * @param {Node} node The node to get the first child element of.
   * @return {Element} The first child node of `node` that is an element.
   */
  getFirstElementChild(node) {
    return getFirstElementChild(node);
  }

  /**
   * Returns the last child node that is an element.
   * @param {Node} node The node to get the last child element of.
   * @return {Element} The last child node of `node` that is an element.
   */
  getLastElementChild(node) {
    return getLastElementChild(node);
  }

  /**
   * Returns the first next sibling that is an element.
   * @param {Node} node The node to get the next sibling element of.
   * @return {Element} The next sibling of `node` that is an element.
   */
  getNextElementSibling(node) {
    return getNextElementSibling(node);
  }

  /**
   * Returns the first previous sibling that is an element.
   * @param {Node} node The node to get the previous sibling element of.
   * @return {Element} The first previous sibling of `node` that is
   *     an element.
   */
  getPreviousElementSibling(node) {
    return getPreviousElementSibling(node);
  }

  /**
   * Returns the next node in source order from the given node.
   * @param {Node} node The node.
   * @return {Node} The next node in the DOM tree, or null if this was the last
   *     node.
   */
  getNextNode(node) {
    return getNextNode(node);
  }

  /**
   * Returns the previous node in source order from the given node.
   * @param {Node} node The node.
   * @return {Node} The previous node in the DOM tree, or null if this was the
   *     first node.
   */
  getPreviousNode(node) {
    return getPreviousNode(node);
  }

  /**
   * Whether the object looks like a DOM node.
   * @param {?} obj The object being tested for node likeness.
   * @return {boolean} Whether the object looks like a DOM node.
   */
  isNodeLike(obj) {
    return isNodeLike(obj);
  }

  /**
   * Whether the object looks like an Element.
   * @param {?} obj The object being tested for Element likeness.
   * @return {boolean} Whether the object looks like an Element.
   */
  isElement(obj) {
    return isElement(obj);
  }

  /**
   * Returns true if the specified value is a Window object. This includes the
   * global window for HTML pages, and iframe windows.
   * @param {?} obj Variable to test.
   * @return {boolean} Whether the variable is a window.
   */
  isWindow(obj) {
    return isWindow(obj);
  }

  /**
   * Returns an element's parent, if it's an Element.
   * @param {Element} element The DOM element.
   * @return {Element} The parent, or null if not an Element.
   */
  getParentElement(element) {
    return getParentElement(element);
  }

  /**
   * Whether a node contains another node.
   * @param {Node} parent The node that should contain the other node.
   * @param {Node} descendant The node to test presence of.
   * @return {boolean} Whether the parent node contains the descendant node.
   */
  contains(parent, descendant) {
    return contains(parent, descendant);
  }

  /**
   * Compares the document order of two nodes, returning 0 if they are the same
   * node, a negative number if node1 is before node2, and a positive number if
   * node2 is before node1.  Note that we compare the order the tags appear in the
   * document so in the tree <b><i>text</i></b> the B node is considered to be
   * before the I node.
   *
   * @param {Node} node1 The first node to compare.
   * @param {Node} node2 The second node to compare.
   * @return {number} 0 if the nodes are the same node, a negative number if node1
   *     is before node2, and a positive number if node2 is before node1.
   */
  compareNodeOrder(node1, node2) {
    return compareNodeOrder(node1, node2);
  }

  /**
   * Find the deepest common ancestor of the given nodes.
   * @param {...Node} var_args The nodes to find a common ancestor of.
   * @return {Node} The common ancestor of the nodes, or null if there is none.
   *     null will only be returned if two or more of the nodes are from different
   *     documents.
   */
  findCommonAncestor(var_args) {
    return findCommonAncestor(var_args);
  }

  /**
   * Returns the owner document for a node.
   * @param {Node} node The node to get the document for.
   * @return {!Document} The document owning the node.
   */
  getOwnerDocument(node) {
    return getOwnerDocument(node);
  }

  /**
   * Cross browser function for getting the document element of an iframe.
   * @param {Element} iframe Iframe element.
   * @return {!Document} The frame content document.
   */
  getFrameContentDocument(iframe) {
    return getFrameContentDocument(iframe);
  }

  /**
   * Cross browser function for getting the window of a frame or iframe.
   * @param {Element} frame Frame element.
   * @return {Window} The window associated with the given frame.
   */
  getFrameContentWindow(frame) {
    return getFrameContentWindow(frame);
  }

  /**
   * Sets the text content of a node, with cross-browser support.
   * @param {Node} node The node to change the text content of.
   * @param {string|number} text The value that should replace the node's content.
   */
  setTextContent(node, text) {
    return setTextContent(node, text);
  }

  /**
   * Gets the outerHTML of a node, which islike innerHTML, except that it
   * actually contains the HTML of the node itself.
   * @param {Element} element The element to get the HTML of.
   * @return {string} The outerHTML of the given element.
   */
  getOuterHtml(element) {
    return getOuterHtml(element);
  }

  /**
   * Finds the first descendant node that matches the filter function. This does
   * a depth first search.
   * @param {Node} root The root of the tree to search.
   * @param {function(Node) : boolean} p The filter function.
   * @return {Node|undefined} The found node or undefined if none is found.
   */
  findNode(root, p) {
    return findNode(root, p);
  }

  /**
   * Finds all the descendant nodes that matches the filter function. This does a
   * depth first search.
   * @param {Node} root The root of the tree to search.
   * @param {function(Node) : boolean} p The filter function.
   * @return {Array<Node>} The found nodes or an empty array if none are found.
   */
  findNodes(root, p) {
    return findNodes(root, p);
  }

  /**
   * Returns true if the element has a tab index that allows it to receive
   * keyboard focus (tabIndex >= 0), false otherwise.  Note that some elements
   * natively support keyboard focus, even if they have no tab index.
   * @param {!Element} element Element to check.
   * @return {boolean} Whether the element has a tab index that allows keyboard
   *     focus.
   */
  isFocusableTabIndex(element) {
    return isFocusableTabIndex(element);
  }

  /**
   * Enables or disables keyboard focus support on the element via its tab index.
   * Only elements for which {@link isFocusableTabIndex} returns true
   * (or elements that natively support keyboard focus, like form elements) can
   * receive keyboard focus.  See http://go/tabindex for more info.
   * @param {Element} element Element whose tab index is to be changed.
   * @param {boolean} enable Whether to set or remove a tab index on the element
   *     that supports keyboard focus.
   */
  setFocusableTabIndex(element, enable) {
    return setFocusableTabIndex(element, enable);
  }

  /**
   * Returns true if the element can be focused, i.e. it has a tab index that
   * allows it to receive keyboard focus (tabIndex >= 0), or it is an element
   * that natively supports keyboard focus.
   * @param {!Element} element Element to check.
   * @return {boolean} Whether the element allows keyboard focus.
   */
  isFocusable(element) {
    return isFocusable(element);
  }

  /**
   * Returns the text contents of the current node, without markup. New lines are
   * stripped and whitespace is collapsed, such that each character would be
   * visible.
   *
   * In browsers that support it, innerText is used.  Other browsers attempt to
   * simulate it via node traversal.  Line breaks are canonicalized in IE.
   *
   * @param {Node} node The node from which we are getting content.
   * @return {string} The text content.
   */
  getTextContent(node) {
    return getTextContent(node);
  }

  /**
   * Returns the text length of the text contained in a node, without markup. This
   * is equivalent to the selection length if the node was selected, or the number
   * of cursor movements to traverse the node. Images & BRs take one space.  New
   * lines are ignored.
   *
   * @param {Node} node The node whose text content length is being calculated.
   * @return {number} The length of `node`'s text content.
   */
  getNodeTextLength(node) {
    return getNodeTextLength(node);
  }

  /**
   * Returns the text offset of a node relative to one of its ancestors. The text
   * length is the same as the length calculated by
   * `getNodeTextLength`.
   *
   * @param {Node} node The node whose offset is being calculated.
   * @param {Node=} opt_offsetParent Defaults to the node's owner document's body.
   * @return {number} The text offset.
   */
  getNodeTextOffset(node, opt_offsetParent) {
    return getNodeTextOffset(node, opt_offsetParent);
  }

  /**
   * Returns the node at a given offset in a parent node.  If an object is
   * provided for the optional third parameter, the node and the remainder of the
   * offset will stored as properties of this object.
   * @param {Node} parent The parent node.
   * @param {number} offset The offset into the parent node.
   * @param {Object=} opt_result Object to be used to store the return value. The
   *     return value will be stored in the form {node: Node, remainder: number}
   *     if this object is provided.
   * @return {Node} The node at the given offset.
   */
  getNodeAtOffset(parent, offset, opt_result) {
    return getNodeAtOffset(parent, offset, opt_result);
  }

  /**
   * Returns true if the object is a `NodeList`.  To qualify as a NodeList,
   * the object must have a numeric length property and an item function (which
   * has type 'string' on IE for some reason).
   * @param {Object} val Object to test.
   * @return {boolean} Whether the object is a NodeList.
   */
  isNodeList(val) {
    return isNodeList(val);
  }

  /**
   * Walks up the DOM hierarchy returning the first ancestor that has the passed
   * tag name and/or class name. If the passed element matches the specified
   * criteria, the element itself is returned.
   * @param {Node} element The DOM node to start with.
   * @param {?(TagName<T>|string)=} opt_tag The tag name to match (or
   *     null/undefined to match only based on class name).
   * @param {?string=} opt_class The class name to match (or null/undefined to
   *     match only based on tag name).
   * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
   *     dom.
   * @return {?R} The first ancestor that matches the passed criteria, or
   *     null if no match is found. The return type is {?Element} if opt_tag is
   *     not a member of TagName or a more specific type if it is (e.g.
   *     {?HTMLAnchorElement} for TagName.A).
   * @template T
   * @template R := cond(isUnknown(T), 'Element', T) =:
   */
  getAncestorByTagNameAndClass(element, opt_tag, opt_class, opt_maxSearchSteps) {
    return getAncestorByTagNameAndClass(element, opt_tag, opt_class, opt_maxSearchSteps);
  }

  /**
   * Walks up the DOM hierarchy returning the first ancestor that has the passed
   * class name. If the passed element matches the specified criteria, the
   * element itself is returned.
   * @param {Node} element The DOM node to start with.
   * @param {string} className The class name to match.
   * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
   *     dom.
   * @return {Element} The first ancestor that matches the passed criteria, or
   *     null if none match.
   */
  getAncestorByClass(element, className, opt_maxSearchSteps) {
    return getAncestorByClass(element, className, opt_maxSearchSteps);
  }

  /**
   * Walks up the DOM hierarchy returning the first ancestor that passes the
   * matcher function.
   * @param {Node} element The DOM node to start with.
   * @param {function(Node) : boolean} matcher A function that returns true if the
   *     passed node matches the desired criteria.
   * @param {boolean=} opt_includeNode If true, the node itself is included in
   *     the search (the first call to the matcher will pass startElement as
   *     the node to test).
   * @param {number=} opt_maxSearchSteps Maximum number of levels to search up the
   *     dom.
   * @return {Node} DOM node that matched the matcher, or null if there was
   *     no match.
   */
  getAncestor(element, matcher, opt_includeNode, opt_maxSearchSteps) {
    return getAncestor(element, matcher, opt_includeNode, opt_maxSearchSteps);
  }

  /**
   * Gets '2d' context of a canvas. Shortcut for canvas.getContext('2d') with a
   * type information.
   * @param {!HTMLCanvasElement} canvas
   * @return {!CanvasRenderingContext2D}
   */
  getCanvasContext2D(canvas) {
    return getCanvasContext2D(canvas);
  }
}

/**
 * Alias for `getElement`.
 * @param {string|Element} element Element ID or a DOM node.
 * @return {Element} The element with the given ID, or the node passed in.
 * @deprecated Use {@link DomHelper.prototype.getElement} instead.
 */
DomHelper.prototype.$ = DomHelper.prototype.getElement;

/**
 * Alias for `getElementsByTagNameAndClass`.
 * @deprecated Use DomHelper getElementsByTagNameAndClass.
 *
 * @param {(string|?TagName<T>)=} opt_tag Element tag name.
 * @param {?string=} opt_class Optional class name.
 * @param {Element=} opt_el Optional element to look in.
 * @return {!IArrayLike<R>} Array-like list of elements (only a length property
 *     and numerical indices are guaranteed to exist). The members of the array
 *     are {!Element} if opt_tag is a string or more specific types if it is
 *     a member of TagName (e.g. {!HTMLAnchorElement} for
 *     TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 */
DomHelper.prototype.$$ =
    DomHelper.prototype.getElementsByTagNameAndClass;

/**
 * Typedef for use with createDom and append.
 * @typedef {Object|string|Array|NodeList}
 */
let Appendable;

/**
 * Alias for `createDom`.
 * @param {string|!TagName<T>} tagName Tag to create.
 * @param {?Object|?Array<string>|string=} opt_attributes If object, then a map
 *     of name-value pairs for attributes. If a string, then this is the
 *     className of the new element. If an array, the elements will be joined
 *     together as the className of the new element.
 * @param {...(Appendable|undefined)} var_args Further DOM nodes or
 *     strings for text nodes.  If one of the var_args is an array, its children
 *     will be added as childNodes instead.
 * @return {R} Reference to a DOM node. The return type is {!Element} if tagName
 *     is a string or a more specific type if it is a member of
 *     TagName (e.g. {!HTMLAnchorElement} for TagName.A).
 * @template T
 * @template R := cond(isUnknown(T), 'Element', T) =:
 * @deprecated Use {@link DomHelper.prototype.createDom} instead.
 */
DomHelper.prototype.$dom = DomHelper.prototype.createDom;

export {$, $$, $dom, ASSUME_QUIRKS_MODE, ASSUME_STANDARDS_MODE, Appendable, DomHelper, append, appendChild, canHaveChildren, compareNodeOrder, constHtmlToNode, contains, createDom, createElement, createTable, createTextNode, findCommonAncestor, findElement, findElements, findNode, findNodes, flattenElement, getActiveElement, getAncestor, getAncestorByClass, getAncestorByTagNameAndClass, getCanvasContext2D, getChildren, getDocument, getDocumentHeight, getDocumentHeightForWindow, getDocumentScroll, getDocumentScrollElement, getDomHelper, getElement, getElementByClass, getElementByTagNameAndClass, getElementsByClass, getElementsByTagName, getElementsByTagNameAndClass, getFirstElementChild, getFrameContentDocument, getFrameContentWindow, getLastElementChild, getNextElementSibling, getNextNode, getNodeAtOffset, getNodeTextLength, getNodeTextOffset, getOuterHtml, getOwnerDocument, getPageScroll, getParentElement, getPixelRatio, getPreviousElementSibling, getPreviousNode, getRawTextContent, getRequiredElement, getRequiredElementByClass, getTextContent, getViewportSize, getWindow, insertChildAt, insertSiblingAfter, insertSiblingBefore, isCss1CompatMode, isElement, isFocusable, isFocusableTabIndex, isInDocument, isNodeLike, isNodeList, isWindow, removeChildren, removeNode, replaceNode, safeHtmlToNode, setFocusableTabIndex, setProperties, setTextContent};