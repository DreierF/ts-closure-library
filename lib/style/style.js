import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeType} from './../dom/nodetype.js';
import {TagName} from './../dom/tagname.js';
import * as vendor from './../dom/vendor.js';
import {Event as EventsEvent} from './../events/event.js';
import * as google from './../google.js';
import {SafeStyleSheet} from './../html/safestylesheet.js';
import {Box} from './../math/box.js';
import {Coordinate} from './../math/coordinate.js';
import {Rect} from './../math/rect.js';
import {Size} from './../math/size.js';
import * as goog_object from './../object/object.js';
import * as reflect from './../reflect/reflect.js';
import * as strings from './../string/string.js';
import * as userAgent from './../useragent/useragent.js';
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
 * @fileoverview Utilities for element styles.
 *
 * @see ../demos/inline_block_quirks.html
 * @see ../demos/inline_block_standards.html
 * @see ../demos/style_viewport.html
 */

/**
 * Sets a style value on an element.
 *
 * This function is not indended to patch issues in the browser's style
 * handling, but to allow easy programmatic access to setting dash-separated
 * style properties.  An example is setting a batch of properties from a data
 * object without overwriting old styles.  When possible, use native APIs:
 * elem.style.propertyKey = 'value' or (if obliterating old styles is fine)
 * elem.style.cssText = 'property1: value1; property2: value2'.
 *
 * @param {Element} element The element to change.
 * @param {string|Object} style If a string, a style name. If an object, a hash
 *     of style names to style values.
 * @param {string|number|boolean=} opt_value If style was a string, then this
 *     should be the value.
 */
function setStyle(element, style, opt_value) {
  if (typeof style === 'string') {
    setStyle_(element, opt_value, style);
  } else {
    for (var key in style) {
      setStyle_(element, style[key], key);
    }
  }
};

/**
 * Sets a style value on an element, with parameters swapped to work with
 * `goog_object.forEach()`. Prepends a vendor-specific prefix when
 * necessary.
 * @param {Element} element The element to change.
 * @param {string|number|boolean|undefined} value Style value.
 * @param {string} style Style name.
 * @private
 */
function setStyle_(element, value, style) {
  var propertyName = getVendorJsStyleName_(element, style);

  if (propertyName) {
    // TODO(johnlenz): coerce to string?
    element.style[propertyName] = /** @type {?} */ (value);
  }
};

/**
 * Style name cache that stores previous property name lookups.
 *
 * This is used by setStyle to speed up property lookups, entries look like:
 *   { StyleName: ActualPropertyName }
 *
 * @private {!Object<string, string>}
 */
let styleNameCache_ = {};

/**
 * Returns the style property name in camel-case. If it does not exist and a
 * vendor-specific version of the property does exist, then return the vendor-
 * specific property name instead.
 * @param {Element} element The element to change.
 * @param {string} style Style name.
 * @return {string} Vendor-specific style.
 * @private
 */
function getVendorJsStyleName_(element, style) {
  var propertyName = styleNameCache_[style];
  if (!propertyName) {
    var camelStyle = strings.toCamelCase(style);
    propertyName = camelStyle;

    if (element.style[camelStyle] === undefined) {
      var prefixedStyle = vendor.getVendorJsPrefix() +
          strings.toTitleCase(camelStyle);

      if (element.style[prefixedStyle] !== undefined) {
        propertyName = prefixedStyle;
      }
    }
    styleNameCache_[style] = propertyName;
  }

  return propertyName;
};

/**
 * Returns the style property name in CSS notation. If it does not exist and a
 * vendor-specific version of the property does exist, then return the vendor-
 * specific property name instead.
 * @param {Element} element The element to change.
 * @param {string} style Style name.
 * @return {string} Vendor-specific style.
 * @private
 */
function getVendorStyleName_(element, style) {
  var camelStyle = strings.toCamelCase(style);

  if (element.style[camelStyle] === undefined) {
    var prefixedStyle = vendor.getVendorJsPrefix() +
        strings.toTitleCase(camelStyle);

    if (element.style[prefixedStyle] !== undefined) {
      return vendor.getVendorPrefix() + '-' + style;
    }
  }

  return style;
};

/**
 * Retrieves an explicitly-set style value of a node. This returns '' if there
 * isn't a style attribute on the element or if this style property has not been
 * explicitly set in script.
 *
 * @param {Element} element Element to get style of.
 * @param {string} property Property to get, css-style (if you have a camel-case
 * property, use element.style[style]).
 * @return {string} Style value.
 */
function getStyle(element, property) {
  // element.style is '' for well-known properties which are unset.
  // For for browser specific styles as 'filter' is undefined
  // so we need to return '' explicitly to make it consistent across
  // browsers.
  var styleValue = element.style[strings.toCamelCase(property)];

  // Using typeof here because of a bug in Safari 5.1, where this value
  // was undefined, but === undefined returned false.
  if (typeof(styleValue) !== 'undefined') {
    return styleValue;
  }

  return element.style[getVendorJsStyleName_(element, property)] ||
      '';
};

/**
 * Retrieves a computed style value of a node. It returns empty string if the
 * value cannot be computed (which will be the case in Internet Explorer) or
 * "none" if the property requested is an SVG one and it has not been
 * explicitly set (firefox and webkit).
 *
 * @param {Element} element Element to get style of.
 * @param {string} property Property to get (camel-case).
 * @return {string} Style value.
 */
function getComputedStyle(element, property) {
  var doc = googdom.getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      // element.style[..] is undefined for browser specific styles
      // as 'filter'.
      return styles[property] || styles.getPropertyValue(property) || '';
    }
  }

  return '';
};

/**
 * Gets the cascaded style value of a node, or null if the value cannot be
 * computed (only Internet Explorer can do this).
 *
 * @param {Element} element Element to get style of.
 * @param {string} style Property to get (camel-case).
 * @return {string} Style value.
 */
function getCascadedStyle(element, style) {
  // TODO(nicksantos): This should be documented to return null. #fixTypes
  return /** @type {string} */ (
      element.currentStyle ? element.currentStyle[style] : null);
};

/**
 * Cross-browser pseudo get computed style. It returns the computed style where
 * available. If not available it tries the cascaded style value (IE
 * currentStyle) and in worst case the inline style value.  It shouldn't be
 * called directly, see http://wiki/Main/ComputedStyleVsCascadedStyle for
 * discussion.
 *
 * @param {Element} element Element to get style of.
 * @param {string} style Property to get (must be camelCase, not css-style.).
 * @return {string} Style value.
 * @private
 */
function getStyle_(element, style) {
  return getComputedStyle(element, style) ||
      getCascadedStyle(element, style) ||
      (element.style && element.style[style]);
};

/**
 * Retrieves the computed value of the box-sizing CSS attribute.
 * Browser support: http://caniuse.com/css3-boxsizing.
 * @param {!Element} element The element whose box-sizing to get.
 * @return {?string} 'content-box', 'border-box' or 'padding-box'. null if
 *     box-sizing is not supported (IE7 and below).
 */
function getComputedBoxSizing(element) {
  return getStyle_(element, 'boxSizing') ||
      getStyle_(element, 'MozBoxSizing') ||
      getStyle_(element, 'WebkitBoxSizing') || null;
};

/**
 * Retrieves the computed value of the position CSS attribute.
 * @param {Element} element The element to get the position of.
 * @return {string} Position value.
 */
function getComputedPosition(element) {
  return getStyle_(element, 'position');
};

/**
 * Retrieves the computed background color string for a given element. The
 * string returned is suitable for assigning to another element's
 * background-color, but is not guaranteed to be in any particular string
 * format. Accessing the color in a numeric form may not be possible in all
 * browsers or with all input.
 *
 * If the background color for the element is defined as a hexadecimal value,
 * the resulting string can be parsed by goog.color.parse in all supported
 * browsers.
 *
 * Whether named colors like "red" or "lightblue" get translated into a
 * format which can be parsed is browser dependent. Calling this function on
 * transparent elements will return "transparent" in most browsers or
 * "rgba(0, 0, 0, 0)" in WebKit.
 * @param {Element} element The element to get the background color of.
 * @return {string} The computed string value of the background color.
 */
function getBackgroundColor(element) {
  return getStyle_(element, 'backgroundColor');
};

/**
 * Retrieves the computed value of the overflow-x CSS attribute.
 * @param {Element} element The element to get the overflow-x of.
 * @return {string} The computed string value of the overflow-x attribute.
 */
function getComputedOverflowX(element) {
  return getStyle_(element, 'overflowX');
};

/**
 * Retrieves the computed value of the overflow-y CSS attribute.
 * @param {Element} element The element to get the overflow-y of.
 * @return {string} The computed string value of the overflow-y attribute.
 */
function getComputedOverflowY(element) {
  return getStyle_(element, 'overflowY');
};

/**
 * Retrieves the computed value of the z-index CSS attribute.
 * @param {Element} element The element to get the z-index of.
 * @return {string|number} The computed value of the z-index attribute.
 */
function getComputedZIndex(element) {
  return getStyle_(element, 'zIndex');
};

/**
 * Retrieves the computed value of the text-align CSS attribute.
 * @param {Element} element The element to get the text-align of.
 * @return {string} The computed string value of the text-align attribute.
 */
function getComputedTextAlign(element) {
  return getStyle_(element, 'textAlign');
};

/**
 * Retrieves the computed value of the cursor CSS attribute.
 * @param {Element} element The element to get the cursor of.
 * @return {string} The computed string value of the cursor attribute.
 */
function getComputedCursor(element) {
  return getStyle_(element, 'cursor');
};

/**
 * Retrieves the computed value of the CSS transform attribute.
 * @param {Element} element The element to get the transform of.
 * @return {string} The computed string representation of the transform matrix.
 */
function getComputedTransform(element) {
  var property = getVendorStyleName_(element, 'transform');
  return getStyle_(element, property) ||
      getStyle_(element, 'transform');
};

/**
 * Sets the top/left values of an element.  If no unit is specified in the
 * argument then it will add px. The second argument is required if the first
 * argument is a string or number and is ignored if the first argument
 * is a coordinate.
 * @param {Element} el Element to move.
 * @param {string|number|Coordinate} arg1 Left position or coordinate.
 * @param {string|number=} opt_arg2 Top position.
 */
function setPosition(el, arg1, opt_arg2) {
  var x, y;

  if (arg1 instanceof Coordinate) {
    x = arg1.x;
    y = arg1.y;
  } else {
    x = arg1;
    y = opt_arg2;
  }

  el.style.left = getPixelStyleValue_(
      /** @type {number|string} */ (x), false);
  el.style.top = getPixelStyleValue_(
      /** @type {number|string} */ (y), false);
};

/**
 * Gets the offsetLeft and offsetTop properties of an element and returns them
 * in a Coordinate object
 * @param {Element} element Element.
 * @return {!Coordinate} The position.
 */
function getPosition(element) {
  return new Coordinate(
      /** @type {!HTMLElement} */ (element).offsetLeft,
      /** @type {!HTMLElement} */ (element).offsetTop);
};

/**
 * Returns the viewport element for a particular document
 * @param {Node=} opt_node DOM node (Document is OK) to get the viewport element
 *     of.
 * @return {Element} document.documentElement or document.body.
 */
function getClientViewportElement(opt_node) {
  var doc;
  if (opt_node) {
    doc = googdom.getOwnerDocument(opt_node);
  } else {
    doc = googdom.getDocument();
  }

  // In old IE versions the document.body represented the viewport
  if (userAgent.IE && !userAgent.isDocumentModeOrHigher(9) &&
      !googdom.getDomHelper(doc).isCss1CompatMode()) {
    return doc.body;
  }
  return doc.documentElement;
};

/**
 * Calculates the viewport coordinates relative to the page/document
 * containing the node. The viewport may be the browser viewport for
 * non-iframe document, or the iframe container for iframe'd document.
 * @param {!Document} doc The document to use as the reference point.
 * @return {!Coordinate} The page offset of the viewport.
 */
function getViewportPageOffset(doc) {
  var body = doc.body;
  var documentElement = doc.documentElement;
  var scrollLeft = body.scrollLeft || documentElement.scrollLeft;
  var scrollTop = body.scrollTop || documentElement.scrollTop;
  return new Coordinate(scrollLeft, scrollTop);
};

/**
 * Gets the client rectangle of the DOM element.
 *
 * getBoundingClientRect is part of a new CSS object model draft (with a
 * long-time presence in IE), replacing the error-prone parent offset
 * computation and the now-deprecated Gecko getBoxObjectFor.
 *
 * This utility patches common browser bugs in getBoundingClientRect. It
 * will fail if getBoundingClientRect is unsupported.
 *
 * If the element is not in the DOM, the result is undefined, and an error may
 * be thrown depending on user agent.
 *
 * @param {!Element} el The element whose bounding rectangle is being queried.
 * @return {Object} A native bounding rectangle with numerical left, top,
 *     right, and bottom.  Reported by Firefox to be of object type ClientRect.
 * @private
 */
function getBoundingClientRect_(el) {
  var rect;
  try {
    rect = el.getBoundingClientRect();
  } catch (e) {
    // In IE < 9, calling getBoundingClientRect on an orphan element raises an
    // "Unspecified Error". All other browsers return zeros.
    return {'left': 0, 'top': 0, 'right': 0, 'bottom': 0};
  }

  // Patch the result in IE only, so that this function can be inlined if
  // compiled for non-IE.
  if (userAgent.IE && el.ownerDocument.body) {
    // In IE, most of the time, 2 extra pixels are added to the top and left
    // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
    // IE6 standards mode, this border can be overridden by setting the
    // document element's border to zero -- thus, we cannot rely on the
    // offset always being 2 pixels.

    // In quirks mode, the offset can be determined by querying the body's
    // clientLeft/clientTop, but in standards mode, it is found by querying
    // the document element's clientLeft/clientTop.  Since we already called
    // getBoundingClientRect we have already forced a reflow, so it is not
    // too expensive just to query them all.

    // See: http://msdn.microsoft.com/en-us/library/ms536433(VS.85).aspx
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop;
  }
  return rect;
};

/**
 * Returns the first parent that could affect the position of a given element.
 * @param {Element} element The element to get the offset parent for.
 * @return {Element} The first offset parent or null if one cannot be found.
 */
function getOffsetParent(element) {
  // element.offsetParent does the right thing in IE7 and below.  In other
  // browsers it only includes elements with position absolute, relative or
  // fixed, not elements with overflow set to auto or scroll.
  if (userAgent.IE && !userAgent.isDocumentModeOrHigher(8)) {
    asserts.assert(element && 'offsetParent' in element);
    return element.offsetParent;
  }

  var doc = googdom.getOwnerDocument(element);
  var positionStyle = getStyle_(element, 'position');
  var skipStatic = positionStyle == 'fixed' || positionStyle == 'absolute';
  for (var parent = element.parentNode; parent && parent != doc;
       parent = parent.parentNode) {
    // Skip shadowDOM roots.
    if (parent.nodeType == NodeType.DOCUMENT_FRAGMENT && parent.host) {
      // Cast because the assignment is not type safe, and without a cast we
      // start typing parent loosely and get bad disambiguation.
      parent = /** @type {!Element} */ (parent.host);
    }
    positionStyle =
        getStyle_(/** @type {!Element} */ (parent), 'position');
    skipStatic = skipStatic && positionStyle == 'static' &&
        parent != doc.documentElement && parent != doc.body;
    if (!skipStatic &&
        (parent.scrollWidth > parent.clientWidth ||
         parent.scrollHeight > parent.clientHeight ||
         positionStyle == 'fixed' || positionStyle == 'absolute' ||
         positionStyle == 'relative')) {
      return /** @type {!Element} */ (parent);
    }
  }
  return null;
};

/**
 * Calculates and returns the visible rectangle for a given element. Returns a
 * box describing the visible portion of the nearest scrollable offset ancestor.
 * Coordinates are given relative to the document.
 *
 * @param {Element} element Element to get the visible rect for.
 * @return {Box} Bounding elementBox describing the visible rect or
 *     null if scrollable ancestor isn't inside the visible viewport.
 */
function getVisibleRectForElement(element) {
  var visibleRect = new Box(0, Infinity, Infinity, 0);
  var dom = googdom.getDomHelper(element);
  var body = dom.getDocument().body;
  var documentElement = dom.getDocument().documentElement;
  var scrollEl = dom.getDocumentScrollElement();

  // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.
  for (var el = element; el = getOffsetParent(el);) {
    // clientWidth is zero for inline block elements in IE.
    // on WEBKIT, body element can have clientHeight = 0 and scrollHeight > 0
    if ((!userAgent.IE || el.clientWidth != 0) &&
        (!userAgent.WEBKIT || el.clientHeight != 0 || el != body) &&
        // body may have overflow set on it, yet we still get the entire
        // viewport. In some browsers, el.offsetParent may be
        // document.documentElement, so check for that too.
        (el != body && el != documentElement &&
         getStyle_(el, 'overflow') != 'visible')) {
      var pos = getPageOffset(el);
      var client = getClientLeftTop(el);
      pos.x += client.x;
      pos.y += client.y;

      visibleRect.top = Math.max(visibleRect.top, pos.y);
      visibleRect.right = Math.min(visibleRect.right, pos.x + el.clientWidth);
      visibleRect.bottom =
          Math.min(visibleRect.bottom, pos.y + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.x);
    }
  }

  // Clip by window's viewport.
  var scrollX = scrollEl.scrollLeft, scrollY = scrollEl.scrollTop;
  visibleRect.left = Math.max(visibleRect.left, scrollX);
  visibleRect.top = Math.max(visibleRect.top, scrollY);
  var winSize = dom.getViewportSize();
  visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
  visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
  return visibleRect.top >= 0 && visibleRect.left >= 0 &&
          visibleRect.bottom > visibleRect.top &&
          visibleRect.right > visibleRect.left ?
      visibleRect :
      null;
};

/**
 * Calculate the scroll position of `container` with the minimum amount so
 * that the content and the borders of the given `element` become visible.
 * If the element is bigger than the container, its top left corner will be
 * aligned as close to the container's top left corner as possible.
 *
 * @param {Element} element The element to make visible.
 * @param {Element=} opt_container The container to scroll. If not set, then the
 *     document scroll element will be used.
 * @param {boolean=} opt_center Whether to center the element in the container.
 *     Defaults to false.
 * @return {!Coordinate} The new scroll position of the container,
 *     in form of Coordinate(scrollLeft, scrollTop).
 */
function getContainerOffsetToScrollInto(
    element, opt_container, opt_center) {
  var container = opt_container || googdom.getDocumentScrollElement();
  // Absolute position of the element's border's top left corner.
  var elementPos = getPageOffset(element);
  // Absolute position of the container's border's top left corner.
  var containerPos = getPageOffset(container);
  var containerBorder = getBorderBox(container);
  if (container == googdom.getDocumentScrollElement()) {
    // The element position is calculated based on the page offset, and the
    // document scroll element holds the scroll position within the page. We can
    // use the scroll position to calculate the relative position from the
    // element.
    var relX = elementPos.x - container.scrollLeft;
    var relY = elementPos.y - container.scrollTop;
    if (userAgent.IE && !userAgent.isDocumentModeOrHigher(10)) {
      // In older versions of IE getPageOffset(element) does not include the
      // container border so it has to be added to accommodate.
      relX += containerBorder.left;
      relY += containerBorder.top;
    }
  } else {
    // Relative pos. of the element's border box to the container's content box.
    var relX = elementPos.x - containerPos.x - containerBorder.left;
    var relY = elementPos.y - containerPos.y - containerBorder.top;
  }
  // How much the element can move in the container, i.e. the difference between
  // the element's bottom-right-most and top-left-most position where it's
  // fully visible.
  var elementSize = getSizeWithDisplay_(element);
  var spaceX = container.clientWidth - elementSize.width;
  var spaceY = container.clientHeight - elementSize.height;
  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;
  if (opt_center) {
    // All browsers round non-integer scroll positions down.
    scrollLeft += relX - spaceX / 2;
    scrollTop += relY - spaceY / 2;
  } else {
    // This formula was designed to give the correct scroll values in the
    // following cases:
    // - element is higher than container (spaceY < 0) => scroll down by relY
    // - element is not higher that container (spaceY >= 0):
    //   - it is above container (relY < 0) => scroll up by abs(relY)
    //   - it is below container (relY > spaceY) => scroll down by relY - spaceY
    //   - it is in the container => don't scroll
    scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0));
    scrollTop += Math.min(relY, Math.max(relY - spaceY, 0));
  }
  return new Coordinate(scrollLeft, scrollTop);
};

/**
 * Changes the scroll position of `container` with the minimum amount so
 * that the content and the borders of the given `element` become visible.
 * If the element is bigger than the container, its top left corner will be
 * aligned as close to the container's top left corner as possible.
 *
 * @param {Element} element The element to make visible.
 * @param {Element=} opt_container The container to scroll. If not set, then the
 *     document scroll element will be used.
 * @param {boolean=} opt_center Whether to center the element in the container.
 *     Defaults to false.
 */
function scrollIntoContainerView(
    element, opt_container, opt_center) {
  var container = opt_container || googdom.getDocumentScrollElement();
  var offset =
      getContainerOffsetToScrollInto(element, container, opt_center);
  container.scrollLeft = offset.x;
  container.scrollTop = offset.y;
};

/**
 * Returns clientLeft (width of the left border and, if the directionality is
 * right to left, the vertical scrollbar) and clientTop as a coordinate object.
 *
 * @param {Element} el Element to get clientLeft for.
 * @return {!Coordinate} Client left and top.
 */
function getClientLeftTop(el) {
  return new Coordinate(el.clientLeft, el.clientTop);
};

/**
 * Returns a Coordinate object relative to the top-left of the HTML document.
 * Implemented as a single function to save having to do two recursive loops in
 * opera and safari just to get both coordinates.  If you just want one value do
 * use getPageOffsetLeft() and getPageOffsetTop(), but
 * note if you call both those methods the tree will be analysed twice.
 *
 * @param {Element} el Element to get the page offset for.
 * @return {!Coordinate} The page offset.
 */
function getPageOffset(el) {
  var doc = googdom.getOwnerDocument(el);
  // TODO(gboyer): Update the jsdoc in a way that doesn't break the universe.
  asserts.assertObject(el, 'Parameter is required');

  // NOTE(arv): If element is hidden (display none or disconnected or any the
  // ancestors are hidden) we get (0,0) by default but we still do the
  // accumulation of scroll position.

  // TODO(arv): Should we check if the node is disconnected and in that case
  //            return (0,0)?

  var pos = new Coordinate(0, 0);
  var viewportElement = getClientViewportElement(doc);
  if (el == viewportElement) {
    // viewport is always at 0,0 as that defined the coordinate system for this
    // function - this avoids special case checks in the code below
    return pos;
  }

  var box = getBoundingClientRect_(el);
  // Must add the scroll coordinates in to get the absolute page offset
  // of element since getBoundingClientRect returns relative coordinates to
  // the viewport.
  var scrollCoord = googdom.getDomHelper(doc).getDocumentScroll();
  pos.x = box.left + scrollCoord.x;
  pos.y = box.top + scrollCoord.y;

  return pos;
};

/**
 * Returns the left coordinate of an element relative to the HTML document
 * @param {Element} el Elements.
 * @return {number} The left coordinate.
 */
function getPageOffsetLeft(el) {
  return getPageOffset(el).x;
};

/**
 * Returns the top coordinate of an element relative to the HTML document
 * @param {Element} el Elements.
 * @return {number} The top coordinate.
 */
function getPageOffsetTop(el) {
  return getPageOffset(el).y;
};

/**
 * Returns a Coordinate object relative to the top-left of an HTML document
 * in an ancestor frame of this element. Used for measuring the position of
 * an element inside a frame relative to a containing frame.
 *
 * @param {Element} el Element to get the page offset for.
 * @param {Window} relativeWin The window to measure relative to. If relativeWin
 *     is not in the ancestor frame chain of the element, we measure relative to
 *     the top-most window.
 * @return {!Coordinate} The page offset.
 */
function getFramedPageOffset(el, relativeWin) {
  var position = new Coordinate(0, 0);

  // Iterate up the ancestor frame chain, keeping track of the current window
  // and the current element in that window.
  var currentWin = googdom.getWindow(googdom.getOwnerDocument(el));

  // MS Edge throws when accessing "parent" if el's containing iframe has been
  // deleted.
  if (!reflect.canAccessProperty(currentWin, 'parent')) {
    return position;
  }

  var currentEl = el;
  do {
    // if we're at the top window, we want to get the page offset.
    // if we're at an inner frame, we only want to get the window position
    // so that we can determine the actual page offset in the context of
    // the outer window.
    var offset = currentWin == relativeWin ?
        getPageOffset(currentEl) :
        getClientPositionForElement_(asserts.assert(currentEl));

    position.x += offset.x;
    position.y += offset.y;
  } while (currentWin && currentWin != relativeWin &&
           currentWin != currentWin.parent &&
           (currentEl = currentWin.frameElement) &&
           (currentWin = currentWin.parent));

  return position;
};

/**
 * Translates the specified rect relative to origBase page, for newBase page.
 * If origBase and newBase are the same, this function does nothing.
 *
 * @param {Rect} rect The source rectangle relative to origBase page,
 *     and it will have the translated result.
 * @param {DomHelper} origBase The DomHelper for the input rectangle.
 * @param {DomHelper} newBase The DomHelper for the resultant
 *     coordinate.  This must be a DOM for an ancestor frame of origBase
 *     or the same as origBase.
 */
function translateRectForAnotherFrame(rect, origBase, newBase) {
  if (origBase.getDocument() != newBase.getDocument()) {
    var body = origBase.getDocument().body;
    var pos = getFramedPageOffset(body, newBase.getWindow());

    // Adjust Body's margin.
    pos = Coordinate.difference(pos, getPageOffset(body));

    if (userAgent.IE && !userAgent.isDocumentModeOrHigher(9) &&
        !origBase.isCss1CompatMode()) {
      pos = Coordinate.difference(pos, origBase.getDocumentScroll());
    }

    rect.left += pos.x;
    rect.top += pos.y;
  }
};

/**
 * Returns the position of an element relative to another element in the
 * document.  A relative to B
 * @param {Element|Event|EventsEvent} a Element or mouse event whose
 *     position we're calculating.
 * @param {Element|Event|EventsEvent} b Element or mouse event position
 *     is relative to.
 * @return {!Coordinate} The relative position.
 */
function getRelativePosition(a, b) {
  var ap = getClientPosition(a);
  var bp = getClientPosition(b);
  return new Coordinate(ap.x - bp.x, ap.y - bp.y);
};

/**
 * Returns the position of the event or the element's border box relative to
 * the client viewport.
 * @param {!Element} el Element whose position to get.
 * @return {!Coordinate} The position.
 * @private
 */
function getClientPositionForElement_(el) {
  var box = getBoundingClientRect_(el);
  return new Coordinate(box.left, box.top);
};

/**
 * Returns the position of the event or the element's border box relative to
 * the client viewport. If an event is passed, and if this event is a "touch"
 * event, then the position of the first changedTouches will be returned.
 * @param {Element|Event|EventsEvent} el Element or a mouse / touch event.
 * @return {!Coordinate} The position.
 * @suppress {checkTypes}
 */
function getClientPosition(el) {
  asserts.assert(el);
  if (el.nodeType == NodeType.ELEMENT) {
    return getClientPositionForElement_(
        /** @type {!Element} */ (el));
  } else {
    var targetEvent = el.changedTouches ? el.changedTouches[0] : el;
    return new Coordinate(targetEvent.clientX, targetEvent.clientY);
  }
};

/**
 * Moves an element to the given coordinates relative to the client viewport.
 * @param {Element} el Absolutely positioned element to set page offset for.
 *     It must be in the document.
 * @param {number|Coordinate} x Left position of the element's margin
 *     box or a coordinate object.
 * @param {number=} opt_y Top position of the element's margin box.
 */
function setPageOffset(el, x, opt_y) {
  // Get current pageoffset
  var cur = getPageOffset(el);

  if (x instanceof Coordinate) {
    opt_y = x.y;
    x = x.x;
  }

  // NOTE(arv): We cannot allow strings for x and y. We could but that would
  // require us to manually transform between different units

  // Work out deltas
  var dx = asserts.assertNumber(x) - cur.x;
  var dy = Number(opt_y) - cur.y;

  // Set position to current left/top + delta
  setPosition(
      el, /** @type {!HTMLElement} */ (el).offsetLeft + dx,
      /** @type {!HTMLElement} */ (el).offsetTop + dy);
};

/**
 * Sets the width/height values of an element.  If an argument is numeric,
 * or a Size is passed, it is assumed to be pixels and will add
 * 'px' after converting it to an integer in string form. (This just sets the
 * CSS width and height properties so it might set content-box or border-box
 * size depending on the box model the browser is using.)
 *
 * @param {Element} element Element to set the size of.
 * @param {string|number|Size} w Width of the element, or a
 *     size object.
 * @param {string|number=} opt_h Height of the element. Required if w is not a
 *     size object.
 */
function setSize(element, w, opt_h) {
  var h;
  if (w instanceof Size) {
    h = w.height;
    w = w.width;
  } else {
    if (opt_h == undefined) {
      throw new Error('missing height argument');
    }
    h = opt_h;
  }

  setWidth(element, /** @type {string|number} */ (w));
  setHeight(element, h);
};

/**
 * Helper function to create a string to be set into a pixel-value style
 * property of an element. Can round to the nearest integer value.
 *
 * @param {string|number} value The style value to be used. If a number,
 *     'px' will be appended, otherwise the value will be applied directly.
 * @param {boolean} round Whether to round the nearest integer (if property
 *     is a number).
 * @return {string} The string value for the property.
 * @private
 */
function getPixelStyleValue_(value, round) {
  if (typeof value == 'number') {
    value = (round ? Math.round(value) : value) + 'px';
  }

  return value;
};

/**
 * Set the height of an element.  Sets the element's style property.
 * @param {Element} element Element to set the height of.
 * @param {string|number} height The height value to set.  If a number, 'px'
 *     will be appended, otherwise the value will be applied directly.
 */
function setHeight(element, height) {
  element.style.height = getPixelStyleValue_(height, true);
};

/**
 * Set the width of an element.  Sets the element's style property.
 * @param {Element} element Element to set the width of.
 * @param {string|number} width The width value to set.  If a number, 'px'
 *     will be appended, otherwise the value will be applied directly.
 */
function setWidth(element, width) {
  element.style.width = getPixelStyleValue_(width, true);
};

/**
 * Gets the height and width of an element, even if its display is none.
 *
 * Specifically, this returns the height and width of the border box,
 * irrespective of the box model in effect.
 *
 * Note that this function does not take CSS transforms into account. Please see
 * `getTransformedSize`.
 * @param {Element} element Element to get size of.
 * @return {!Size} Object with width/height properties.
 */
function getSize(element) {
  return evaluateWithTemporaryDisplay_(
      getSizeWithDisplay_, /** @type {!Element} */ (element));
};

/**
 * Call `fn` on `element` such that `element`'s dimensions are
 * accurate when it's passed to `fn`.
 * @param {function(!Element): T} fn Function to call with `element` as
 *     an argument after temporarily changing `element`'s display such
 *     that its dimensions are accurate.
 * @param {!Element} element Element (which may have display none) to use as
 *     argument to `fn`.
 * @return {T} Value returned by calling `fn` with `element`.
 * @template T
 * @private
 */
function evaluateWithTemporaryDisplay_(fn, element) {
  if (getStyle_(element, 'display') != 'none') {
    return fn(element);
  }

  var style = element.style;
  var originalDisplay = style.display;
  var originalVisibility = style.visibility;
  var originalPosition = style.position;

  style.visibility = 'hidden';
  style.position = 'absolute';
  style.display = 'inline';

  var retVal = fn(element);

  style.display = originalDisplay;
  style.position = originalPosition;
  style.visibility = originalVisibility;

  return retVal;
};

/**
 * Gets the height and width of an element when the display is not none.
 * @param {Element} element Element to get size of.
 * @return {!Size} Object with width/height properties.
 * @private
 */
function getSizeWithDisplay_(element) {
  var offsetWidth = /** @type {!HTMLElement} */ (element).offsetWidth;
  var offsetHeight = /** @type {!HTMLElement} */ (element).offsetHeight;
  var webkitOffsetsZero =
      userAgent.WEBKIT && !offsetWidth && !offsetHeight;
  if ((offsetWidth === undefined || webkitOffsetsZero) &&
      element.getBoundingClientRect) {
    // Fall back to calling getBoundingClientRect when offsetWidth or
    // offsetHeight are not defined, or when they are zero in WebKit browsers.
    // This makes sure that we return for the correct size for SVG elements, but
    // will still return 0 on Webkit prior to 534.8, see
    // http://trac.webkit.org/changeset/67252.
    var clientRect = getBoundingClientRect_(element);
    return new Size(
        clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
  }
  return new Size(offsetWidth, offsetHeight);
};

/**
 * Gets the height and width of an element, post transform, even if its display
 * is none.
 *
 * This is like `getSize`, except:
 * <ol>
 * <li>Takes webkitTransforms such as rotate and scale into account.
 * <li>Will return null if `element` doesn't respond to
 *     `getBoundingClientRect`.
 * <li>Currently doesn't make sense on non-WebKit browsers which don't support
 *    webkitTransforms.
 * </ol>
 * @param {!Element} element Element to get size of.
 * @return {Size} Object with width/height properties.
 */
function getTransformedSize(element) {
  if (!element.getBoundingClientRect) {
    return null;
  }

  var clientRect = evaluateWithTemporaryDisplay_(
      getBoundingClientRect_, element);
  return new Size(
      clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
};

/**
 * Returns a bounding rectangle for a given element in page space.
 * @param {Element} element Element to get bounds of. Must not be display none.
 * @return {!Rect} Bounding rectangle for the element.
 */
function getBounds(element) {
  var o = getPageOffset(element);
  var s = getSize(element);
  return new Rect(o.x, o.y, s.width, s.height);
};

/**
 * Converts a CSS selector in the form style-property to styleProperty.
 * @param {*} selector CSS Selector.
 * @return {string} Camel case selector.
 * @deprecated Use strings.toCamelCase instead.
 */
function toCamelCase(selector) {
  return strings.toCamelCase(String(selector));
};

/**
 * Converts a CSS selector in the form styleProperty to style-property.
 * @param {string} selector Camel case selector.
 * @return {string} Selector cased.
 * @deprecated Use strings.toSelectorCase instead.
 */
function toSelectorCase(selector) {
  return strings.toSelectorCase(selector);
};

/**
 * Gets the opacity of a node (x-browser). This gets the inline style opacity
 * of the node, and does not take into account the cascaded or the computed
 * style for this node.
 * @param {Element} el Element whose opacity has to be found.
 * @return {number|string} Opacity between 0 and 1 or an empty string {@code ''}
 *     if the opacity is not set.
 */
function getOpacity(el) {
  asserts.assert(el);
  var style = el.style;
  var result = '';
  if ('opacity' in style) {
    result = style.opacity;
  } else if ('MozOpacity' in style) {
    result = style.MozOpacity;
  } else if ('filter' in style) {
    var match = style.filter.match(/alpha\(opacity=([\d.]+)\)/);
    if (match) {
      result = String(match[1] / 100);
    }
  }
  return result == '' ? result : Number(result);
};

/**
 * Sets the opacity of a node (x-browser).
 * @param {Element} el Elements whose opacity has to be set.
 * @param {number|string} alpha Opacity between 0 and 1 or an empty string
 *     {@code ''} to clear the opacity.
 */
function setOpacity(el, alpha) {
  asserts.assert(el);
  var style = el.style;
  if ('opacity' in style) {
    style.opacity = alpha;
  } else if ('MozOpacity' in style) {
    style.MozOpacity = alpha;
  } else if ('filter' in style) {
    // TODO(arv): Overwriting the filter might have undesired side effects.
    if (alpha === '') {
      style.filter = '';
    } else {
      style.filter = 'alpha(opacity=' + (Number(alpha) * 100) + ')';
    }
  }
};

/**
 * Sets the background of an element to a transparent image in a browser-
 * independent manner.
 *
 * This function does not support repeating backgrounds or alternate background
 * positions to match the behavior of Internet Explorer. It also does not
 * support sizingMethods other than crop since they cannot be replicated in
 * browsers other than Internet Explorer.
 *
 * @param {Element} el The element to set background on.
 * @param {string} src The image source URL.
 */
function setTransparentBackgroundImage(el, src) {
  var style = el.style;
  // It is safe to use the style.filter in IE only. In Safari 'filter' is in
  // style object but access to style.filter causes it to throw an exception.
  // Note: IE8 supports images with an alpha channel.
  if (userAgent.IE && !userAgent.isVersionOrHigher('8')) {
    // See TODO in setOpacity.
    style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(' +
        'src="' + src + '", sizingMethod="crop")';
  } else {
    // Set style properties individually instead of using background shorthand
    // to prevent overwriting a pre-existing background color.
    style.backgroundImage = 'url(' + src + ')';
    style.backgroundPosition = 'top left';
    style.backgroundRepeat = 'no-repeat';
  }
};

/**
 * Clears the background image of an element in a browser independent manner.
 * @param {Element} el The element to clear background image for.
 */
function clearTransparentBackgroundImage(el) {
  var style = el.style;
  if ('filter' in style) {
    // See TODO in setOpacity.
    style.filter = '';
  } else {
    // Set style properties individually instead of using background shorthand
    // to prevent overwriting a pre-existing background color.
    style.backgroundImage = 'none';
  }
};

/**
 * Shows or hides an element from the page. Hiding the element is done by
 * setting the display property to "none", removing the element from the
 * rendering hierarchy so it takes up no space. To show the element, the default
 * inherited display property is restored (defined either in stylesheets or by
 * the browser's default style rules.)
 *
 * Caveat 1: if the inherited display property for the element is set to "none"
 * by the stylesheets, that is the property that will be restored by a call to
 * showElement(), effectively toggling the display between "none" and "none".
 *
 * Caveat 2: if the element display style is set inline (by setting either
 * element.style.display or a style attribute in the HTML), a call to
 * showElement will clear that setting and defer to the inherited style in the
 * stylesheet.
 * @param {Element} el Element to show or hide.
 * @param {*} display True to render the element in its default style,
 *     false to disable rendering the element.
 * @deprecated Use setElementShown instead.
 */
function showElement(el, display) {
  setElementShown(el, display);
};

/**
 * Shows or hides an element from the page. Hiding the element is done by
 * setting the display property to "none", removing the element from the
 * rendering hierarchy so it takes up no space. To show the element, the default
 * inherited display property is restored (defined either in stylesheets or by
 * the browser's default style rules).
 *
 * Caveat 1: if the inherited display property for the element is set to "none"
 * by the stylesheets, that is the property that will be restored by a call to
 * setElementShown(), effectively toggling the display between "none" and
 * "none".
 *
 * Caveat 2: if the element display style is set inline (by setting either
 * element.style.display or a style attribute in the HTML), a call to
 * setElementShown will clear that setting and defer to the inherited style in
 * the stylesheet.
 * @param {Element} el Element to show or hide.
 * @param {*} isShown True to render the element in its default style,
 *     false to disable rendering the element.
 */
function setElementShown(el, isShown) {
  el.style.display = isShown ? '' : 'none';
};

/**
 * Test whether the given element has been shown or hidden via a call to
 * {@link #setElementShown}.
 *
 * Note this is strictly a companion method for a call
 * to {@link #setElementShown} and the same caveats apply; in particular, this
 * method does not guarantee that the return value will be consistent with
 * whether or not the element is actually visible.
 *
 * @param {Element} el The element to test.
 * @return {boolean} Whether the element has been shown.
 * @see #setElementShown
 */
function isElementShown(el) {
  return el.style.display != 'none';
};

/**
 * Installs the style sheet into the window that contains opt_node.  If
 * opt_node is null, the main window is used.
 * @param {!SafeStyleSheet} safeStyleSheet The style sheet to install.
 * @param {?Node=} opt_node Node whose parent document should have the
 *     styles installed.
 * @return {!HTMLStyleElement|!StyleSheet} In IE<11, a StyleSheet object with no
 *     owning &lt;style&gt; tag (this is how IE creates style sheets).  In every
 *     other browser, a &lt;style&gt; element with an attached style.  This
 *     doesn't return a StyleSheet object so that setSafeStyleSheet can replace
 *     it (otherwise, if you pass a StyleSheet to setSafeStyleSheet, it will
 *     make a new StyleSheet and leave the original StyleSheet orphaned).
 */
function installSafeStyleSheet(safeStyleSheet, opt_node) {
  var dh = googdom.getDomHelper(opt_node);

  // IE < 11 requires createStyleSheet. Note that doc.createStyleSheet will be
  // undefined as of IE 11.
  var doc = dh.getDocument();
  if (userAgent.IE && doc.createStyleSheet) {
    /** @type {(!HTMLStyleElement|!StyleSheet)} */
    var styleSheet = doc.createStyleSheet();
    setSafeStyleSheet(styleSheet, safeStyleSheet);
    return styleSheet;
  } else {
    var head = dh.getElementsByTagNameAndClass(TagName.HEAD)[0];

    // In opera documents are not guaranteed to have a head element, thus we
    // have to make sure one exists before using it.
    if (!head) {
      var body = dh.getElementsByTagNameAndClass(TagName.BODY)[0];
      head = dh.createDom(TagName.HEAD);
      body.parentNode.insertBefore(head, body);
    }
    var el = dh.createDom(TagName.STYLE);
    // NOTE(user): Setting styles after the style element has been appended
    // to the head results in a nasty Webkit bug in certain scenarios. Please
    // refer to https://bugs.webkit.org/show_bug.cgi?id=26307 for additional
    // details.
    setSafeStyleSheet(el, safeStyleSheet);
    dh.appendChild(head, el);
    return el;
  }
};

/**
 * Removes the styles added by {@link #installStyles}.
 * @param {Element|StyleSheet} styleSheet The value returned by
 *     {@link #installStyles}.
 */
function uninstallStyles(styleSheet) {
  var node = styleSheet.ownerNode || styleSheet.owningElement ||
      /** @type {Element} */ (styleSheet);
  googdom.removeNode(node);
};

/**
 * Sets the content of a style element.  The style element can be any valid
 * style element.  This element will have its content completely replaced by
 * the safeStyleSheet.
 * @param {!Element|!StyleSheet} element A stylesheet element as returned by
 *     installStyles.
 * @param {!SafeStyleSheet} safeStyleSheet The new content of the
 *     stylesheet.
 */
function setSafeStyleSheet(element, safeStyleSheet) {
  var stylesString = SafeStyleSheet.unwrap(safeStyleSheet);
  if (userAgent.IE && element.cssText !== undefined) {
    // Adding the selectors individually caused the browser to hang if the
    // selector was invalid or there were CSS comments.  Setting the cssText of
    // the style node works fine and ignores CSS that IE doesn't understand.
    // However IE >= 11 doesn't support cssText any more, so we make sure that
    // cssText is a defined property and otherwise fall back to innerHTML.
    element.cssText = stylesString;
  } else {
    // Setting textContent doesn't work in Safari, see b/29340337.
    element.innerHTML = stylesString;
  }
};

/**
 * Sets 'white-space: pre-wrap' for a node (x-browser).
 *
 * There are as many ways of specifying pre-wrap as there are browsers.
 *
 * CSS3/IE8: white-space: pre-wrap;
 * Mozilla:  white-space: -moz-pre-wrap;
 * Opera:    white-space: -o-pre-wrap;
 * IE6/7:    white-space: pre; word-wrap: break-word;
 *
 * @param {Element} el Element to enable pre-wrap for.
 */
function setPreWrap(el) {
  var style = el.style;
  if (userAgent.IE && !userAgent.isVersionOrHigher('8')) {
    style.whiteSpace = 'pre';
    style.wordWrap = 'break-word';
  } else if (userAgent.GECKO) {
    style.whiteSpace = '-moz-pre-wrap';
  } else {
    style.whiteSpace = 'pre-wrap';
  }
};

/**
 * Sets 'display: inline-block' for an element (cross-browser).
 * @param {Element} el Element to which the inline-block display style is to be
 *    applied.
 * @see ../demos/inline_block_quirks.html
 * @see ../demos/inline_block_standards.html
 */
function setInlineBlock(el) {
  var style = el.style;
  // Without position:relative, weirdness ensues.  Just accept it and move on.
  style.position = 'relative';

  if (userAgent.IE && !userAgent.isVersionOrHigher('8')) {
    // IE8 supports inline-block so fall through to the else
    // Zoom:1 forces hasLayout, display:inline gives inline behavior.
    style.zoom = '1';
    style.display = 'inline';
  } else {
    // Opera, Webkit, and Safari seem to do OK with the standard inline-block
    // style.
    style.display = 'inline-block';
  }
};

/**
 * Returns true if the element is using right to left (rtl) direction.
 * @param {Element} el  The element to test.
 * @return {boolean} True for right to left, false for left to right.
 */
function isRightToLeft(el) {
  return 'rtl' == getStyle_(el, 'direction');
};

/**
 * The CSS style property corresponding to an element being
 * unselectable on the current browser platform (null if none).
 * Opera and IE instead use a DOM attribute 'unselectable'. MS Edge uses
 * the Webkit prefix.
 * @type {?string}
 * @private
 */
let unselectableStyle_ = userAgent.GECKO ?
    'MozUserSelect' :
    userAgent.WEBKIT || userAgent.EDGE ? 'WebkitUserSelect' : null;

/**
 * Returns true if the element is set to be unselectable, false otherwise.
 * Note that on some platforms (e.g. Mozilla), even if an element isn't set
 * to be unselectable, it will behave as such if any of its ancestors is
 * unselectable.
 * @param {Element} el  Element to check.
 * @return {boolean}  Whether the element is set to be unselectable.
 */
function isUnselectable(el) {
  if (unselectableStyle_) {
    return el.style[unselectableStyle_].toLowerCase() == 'none';
  } else if (userAgent.IE || userAgent.OPERA) {
    return el.getAttribute('unselectable') == 'on';
  }
  return false;
};

/**
 * Makes the element and its descendants selectable or unselectable.  Note
 * that on some platforms (e.g. Mozilla), even if an element isn't set to
 * be unselectable, it will behave as such if any of its ancestors is
 * unselectable.
 * @param {Element} el  The element to alter.
 * @param {boolean} unselectable  Whether the element and its descendants
 *     should be made unselectable.
 * @param {boolean=} opt_noRecurse  Whether to only alter the element's own
 *     selectable state, and leave its descendants alone; defaults to false.
 */
function setUnselectable(el, unselectable, opt_noRecurse) {
  // TODO(attila): Do we need all of TR_DomUtil.makeUnselectable() in Closure?
  var descendants = !opt_noRecurse ? el.getElementsByTagName('*') : null;
  var name = unselectableStyle_;
  if (name) {
    // Add/remove the appropriate CSS style to/from the element and its
    // descendants.
    var value = unselectable ? 'none' : '';
    // MathML elements do not have a style property. Verify before setting.
    if (el.style) {
      el.style[name] = value;
    }
    if (descendants) {
      for (var i = 0, descendant; descendant = descendants[i]; i++) {
        if (descendant.style) {
          descendant.style[name] = value;
        }
      }
    }
  } else if (userAgent.IE || userAgent.OPERA) {
    // Toggle the 'unselectable' attribute on the element and its descendants.
    var value = unselectable ? 'on' : '';
    el.setAttribute('unselectable', value);
    if (descendants) {
      for (var i = 0, descendant; descendant = descendants[i]; i++) {
        descendant.setAttribute('unselectable', value);
      }
    }
  }
};

/**
 * Gets the border box size for an element.
 * @param {Element} element  The element to get the size for.
 * @return {!Size} The border box size.
 */
function getBorderBoxSize(element) {
  return new Size(
      /** @type {!HTMLElement} */ (element).offsetWidth,
      /** @type {!HTMLElement} */ (element).offsetHeight);
};

/**
 * Sets the border box size of an element. This is potentially expensive in IE
 * if the document is CSS1Compat mode
 * @param {Element} element  The element to set the size on.
 * @param {Size} size  The new size.
 */
function setBorderBoxSize(element, size) {
  var doc = googdom.getOwnerDocument(element);
  var isCss1CompatMode = googdom.getDomHelper(doc).isCss1CompatMode();

  if (userAgent.IE && !userAgent.isVersionOrHigher('10') &&
      (!isCss1CompatMode || !userAgent.isVersionOrHigher('8'))) {
    var style = element.style;
    if (isCss1CompatMode) {
      var paddingBox = getPaddingBox(element);
      var borderBox = getBorderBox(element);
      style.pixelWidth = size.width - borderBox.left - paddingBox.left -
          paddingBox.right - borderBox.right;
      style.pixelHeight = size.height - borderBox.top - paddingBox.top -
          paddingBox.bottom - borderBox.bottom;
    } else {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    }
  } else {
    setBoxSizingSize_(element, size, 'border-box');
  }
};

/**
 * Gets the content box size for an element.  This is potentially expensive in
 * all browsers.
 * @param {Element} element  The element to get the size for.
 * @return {!Size} The content box size.
 */
function getContentBoxSize(element) {
  var doc = googdom.getOwnerDocument(element);
  var ieCurrentStyle = userAgent.IE && element.currentStyle;
  if (ieCurrentStyle && googdom.getDomHelper(doc).isCss1CompatMode() &&
      ieCurrentStyle.width != 'auto' && ieCurrentStyle.height != 'auto' &&
      !ieCurrentStyle.boxSizing) {
    // If IE in CSS1Compat mode than just use the width and height.
    // If we have a boxSizing then fall back on measuring the borders etc.
    var width = getIePixelValue_(
        element, /** @type {string} */ (ieCurrentStyle.width), 'width',
        'pixelWidth');
    var height = getIePixelValue_(
        element, /** @type {string} */ (ieCurrentStyle.height), 'height',
        'pixelHeight');
    return new Size(width, height);
  } else {
    var borderBoxSize = getBorderBoxSize(element);
    var paddingBox = getPaddingBox(element);
    var borderBox = getBorderBox(element);
    return new Size(
        borderBoxSize.width - borderBox.left - paddingBox.left -
            paddingBox.right - borderBox.right,
        borderBoxSize.height - borderBox.top - paddingBox.top -
            paddingBox.bottom - borderBox.bottom);
  }
};

/**
 * Sets the content box size of an element. This is potentially expensive in IE
 * if the document is BackCompat mode.
 * @param {Element} element  The element to set the size on.
 * @param {Size} size  The new size.
 */
function setContentBoxSize(element, size) {
  var doc = googdom.getOwnerDocument(element);
  var isCss1CompatMode = googdom.getDomHelper(doc).isCss1CompatMode();
  if (userAgent.IE && !userAgent.isVersionOrHigher('10') &&
      (!isCss1CompatMode || !userAgent.isVersionOrHigher('8'))) {
    var style = element.style;
    if (isCss1CompatMode) {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    } else {
      var paddingBox = getPaddingBox(element);
      var borderBox = getBorderBox(element);
      style.pixelWidth = size.width + borderBox.left + paddingBox.left +
          paddingBox.right + borderBox.right;
      style.pixelHeight = size.height + borderBox.top + paddingBox.top +
          paddingBox.bottom + borderBox.bottom;
    }
  } else {
    setBoxSizingSize_(element, size, 'content-box');
  }
};

/**
 * Helper function that sets the box sizing as well as the width and height
 * @param {Element} element  The element to set the size on.
 * @param {Size} size  The new size to set.
 * @param {string} boxSizing  The box-sizing value.
 * @private
 */
function setBoxSizingSize_(element, size, boxSizing) {
  var style = element.style;
  if (userAgent.GECKO) {
    style.MozBoxSizing = boxSizing;
  } else if (userAgent.WEBKIT) {
    style.WebkitBoxSizing = boxSizing;
  } else {
    // Includes IE8 and Opera 9.50+
    style.boxSizing = boxSizing;
  }

  // Setting this to a negative value will throw an exception on IE
  // (and doesn't do anything different than setting it to 0).
  style.width = Math.max(size.width, 0) + 'px';
  style.height = Math.max(size.height, 0) + 'px';
};

/**
 * IE specific function that converts a non pixel unit to pixels.
 * @param {Element} element  The element to convert the value for.
 * @param {string} value  The current value as a string. The value must not be
 *     ''.
 * @param {string} name  The CSS property name to use for the converstion. This
 *     should be 'left', 'top', 'width' or 'height'.
 * @param {string} pixelName  The CSS pixel property name to use to get the
 *     value in pixels.
 * @return {number} The value in pixels.
 * @private
 */
function getIePixelValue_(element, value, name, pixelName) {
  // Try if we already have a pixel value. IE does not do half pixels so we
  // only check if it matches a number followed by 'px'.
  if (/^\d+px?$/.test(value)) {
    return parseInt(value, 10);
  } else {
    var oldStyleValue = element.style[name];
    var oldRuntimeValue = element.runtimeStyle[name];
    // set runtime style to prevent changes
    element.runtimeStyle[name] = element.currentStyle[name];
    element.style[name] = value;
    var pixelValue = element.style[pixelName];
    // restore
    element.style[name] = oldStyleValue;
    element.runtimeStyle[name] = oldRuntimeValue;
    return +pixelValue;
  }
};

/**
 * Helper function for getting the pixel padding or margin for IE.
 * @param {Element} element  The element to get the padding for.
 * @param {string} propName  The property name.
 * @return {number} The pixel padding.
 * @private
 */
function getIePixelDistance_(element, propName) {
  var value = getCascadedStyle(element, propName);
  return value ?
      getIePixelValue_(element, value, 'left', 'pixelLeft') :
      0;
};

/**
 * Gets the computed paddings or margins (on all sides) in pixels.
 * @param {Element} element  The element to get the padding for.
 * @param {string} stylePrefix  Pass 'padding' to retrieve the padding box,
 *     or 'margin' to retrieve the margin box.
 * @return {!Box} The computed paddings or margins.
 * @private
 */
function getBox_(element, stylePrefix) {
  if (userAgent.IE) {
    var left = getIePixelDistance_(element, stylePrefix + 'Left');
    var right = getIePixelDistance_(element, stylePrefix + 'Right');
    var top = getIePixelDistance_(element, stylePrefix + 'Top');
    var bottom =
        getIePixelDistance_(element, stylePrefix + 'Bottom');
    return new Box(top, right, bottom, left);
  } else {
    // On non-IE browsers, getComputedStyle is always non-null.
    var left = getComputedStyle(element, stylePrefix + 'Left');
    var right = getComputedStyle(element, stylePrefix + 'Right');
    var top = getComputedStyle(element, stylePrefix + 'Top');
    var bottom = getComputedStyle(element, stylePrefix + 'Bottom');

    // NOTE(arv): Gecko can return floating point numbers for the computed
    // style values.
    return new Box(
        parseFloat(top), parseFloat(right), parseFloat(bottom),
        parseFloat(left));
  }
};

/**
 * Gets the computed paddings (on all sides) in pixels.
 * @param {Element} element  The element to get the padding for.
 * @return {!Box} The computed paddings.
 */
function getPaddingBox(element) {
  return getBox_(element, 'padding');
};

/**
 * Gets the computed margins (on all sides) in pixels.
 * @param {Element} element  The element to get the margins for.
 * @return {!Box} The computed margins.
 */
function getMarginBox(element) {
  return getBox_(element, 'margin');
};

/**
 * A map used to map the border width keywords to a pixel width.
 * @type {!Object}
 * @private
 */
let ieBorderWidthKeywords_ = {
  'thin': 2,
  'medium': 4,
  'thick': 6
};

/**
 * Helper function for IE to get the pixel border.
 * @param {Element} element  The element to get the pixel border for.
 * @param {string} prop  The part of the property name.
 * @return {number} The value in pixels.
 * @private
 */
function getIePixelBorder_(element, prop) {
  if (getCascadedStyle(element, prop + 'Style') == 'none') {
    return 0;
  }
  var width = getCascadedStyle(element, prop + 'Width');
  if (width in ieBorderWidthKeywords_) {
    return ieBorderWidthKeywords_[width];
  }
  return getIePixelValue_(element, width, 'left', 'pixelLeft');
};

/**
 * Gets the computed border widths (on all sides) in pixels
 * @param {Element} element  The element to get the border widths for.
 * @return {!Box} The computed border widths.
 */
function getBorderBox(element) {
  if (userAgent.IE && !userAgent.isDocumentModeOrHigher(9)) {
    var left = getIePixelBorder_(element, 'borderLeft');
    var right = getIePixelBorder_(element, 'borderRight');
    var top = getIePixelBorder_(element, 'borderTop');
    var bottom = getIePixelBorder_(element, 'borderBottom');
    return new Box(top, right, bottom, left);
  } else {
    // On non-IE browsers, getComputedStyle is always non-null.
    var left = getComputedStyle(element, 'borderLeftWidth');
    var right = getComputedStyle(element, 'borderRightWidth');
    var top = getComputedStyle(element, 'borderTopWidth');
    var bottom = getComputedStyle(element, 'borderBottomWidth');

    return new Box(
        parseFloat(top), parseFloat(right), parseFloat(bottom),
        parseFloat(left));
  }
};

/**
 * Returns the font face applied to a given node. Opera and IE should return
 * the font actually displayed. Firefox returns the author's most-preferred
 * font (whether the browser is capable of displaying it or not.)
 * @param {Element} el  The element whose font family is returned.
 * @return {string} The font family applied to el.
 */
function getFontFamily(el) {
  var doc = googdom.getOwnerDocument(el);
  var font = '';
  // The moveToElementText method from the TextRange only works if the element
  // is attached to the owner document.
  if (doc.body.createTextRange && googdom.contains(doc, el)) {
    var range = doc.body.createTextRange();
    range.moveToElementText(el);

    try {
      font = range.queryCommandValue('FontName');
    } catch (e) {
      // This is a workaround for a awkward exception.
      // On some IE, there is an exception coming from it.
      // The error description from this exception is:
      // This window has already been registered as a drop target
      // This is bogus description, likely due to a bug in ie.
      font = '';
    }
  }
  if (!font) {
    // Note if for some reason IE can't derive FontName with a TextRange, we
    // fallback to using currentStyle
    font = getStyle_(el, 'fontFamily');
  }

  // Firefox returns the applied font-family string (author's list of
  // preferred fonts.) We want to return the most-preferred font, in lieu of
  // the *actually* applied font.
  var fontsArray = font.split(',');
  if (fontsArray.length > 1) font = fontsArray[0];

  // Sanitize for x-browser consistency:
  // Strip quotes because browsers aren't consistent with how they're
  // applied; Opera always encloses, Firefox sometimes, and IE never.
  return strings.stripQuotes(font, '"\'');
};

/**
 * Regular expression used for getLengthUnits.
 * @type {RegExp}
 * @private
 */
let lengthUnitRegex_ = /[^\d]+$/;

/**
 * Returns the units used for a CSS length measurement.
 * @param {string} value  A CSS length quantity.
 * @return {?string} The units of measurement.
 */
function getLengthUnits(value) {
  var units = value.match(lengthUnitRegex_);
  return units && units[0] || null;
};

/**
 * Map of absolute CSS length units
 * @type {!Object}
 * @private
 */
let ABSOLUTE_CSS_LENGTH_UNITS_ = {
  'cm': 1,
  'in': 1,
  'mm': 1,
  'pc': 1,
  'pt': 1
};

/**
 * Map of relative CSS length units that can be accurately converted to px
 * font-size values using getIePixelValue_. Only units that are defined in
 * relation to a font size are convertible (%, small, etc. are not).
 * @type {!Object}
 * @private
 */
let CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
  'em': 1,
  'ex': 1
};

/**
 * Returns the font size, in pixels, of text in an element.
 * @param {Element} el  The element whose font size is returned.
 * @return {number} The font size (in pixels).
 */
function getFontSize(el) {
  var fontSize = getStyle_(el, 'fontSize');
  var sizeUnits = getLengthUnits(fontSize);
  if (fontSize && 'px' == sizeUnits) {
    // NOTE(user): This could be parseFloat instead, but IE doesn't return
    // decimal fractions in getStyle_ and Firefox reports the fractions, but
    // ignores them when rendering. Interestingly enough, when we force the
    // issue and size something to e.g., 50% of 25px, the browsers round in
    // opposite directions with Firefox reporting 12px and IE 13px. I punt.
    return parseInt(fontSize, 10);
  }

  // In IE, we can convert absolute length units to a px value using
  // getIePixelValue_. Units defined in relation to a font size
  // (em, ex) are applied relative to the element's parentNode and can also
  // be converted.
  if (userAgent.IE) {
    if (String(sizeUnits) in ABSOLUTE_CSS_LENGTH_UNITS_) {
      return getIePixelValue_(el, fontSize, 'left', 'pixelLeft');
    } else if (
        el.parentNode && el.parentNode.nodeType == NodeType.ELEMENT &&
        String(sizeUnits) in CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      // Check the parent size - if it is the same it means the relative size
      // value is inherited and we therefore don't want to count it twice.  If
      // it is different, this element either has explicit style or has a CSS
      // rule applying to it.
      var parentElement = /** @type {!Element} */ (el.parentNode);
      var parentSize = getStyle_(parentElement, 'fontSize');
      return getIePixelValue_(
          parentElement, fontSize == parentSize ? '1em' : fontSize, 'left',
          'pixelLeft');
    }
  }

  // Sometimes we can't cleanly find the font size (some units relative to a
  // node's parent's font size are difficult: %, smaller et al), so we create
  // an invisible, absolutely-positioned span sized to be the height of an 'M'
  // rendered in its parent's (i.e., our target element's) font size. This is
  // the definition of CSS's font size attribute.
  var sizeElement = googdom.createDom(TagName.SPAN, {
    'style': 'visibility:hidden;position:absolute;' +
        'line-height:0;padding:0;margin:0;border:0;height:1em;'
  });
  googdom.appendChild(el, sizeElement);
  fontSize = sizeElement.offsetHeight;
  googdom.removeNode(sizeElement);

  return fontSize;
};

/**
 * Parses a style attribute value.  Converts CSS property names to camel case.
 * @param {string} value The style attribute value.
 * @return {!Object} Map of CSS properties to string values.
 */
function parseStyleAttribute(value) {
  var result = {};
  googarray.forEach(value.split(/\s*;\s*/), function(pair) {
    var keyValue = pair.match(/\s*([\w-]+)\s*\:(.+)/);
    if (keyValue) {
      var styleName = keyValue[1];
      var styleValue = strings.trim(keyValue[2]);
      result[strings.toCamelCase(styleName.toLowerCase())] = styleValue;
    }
  });
  return result;
};

/**
 * Reverse of parseStyleAttribute; that is, takes a style object and returns the
 * corresponding attribute value.  Converts camel case property names to proper
 * CSS selector names.
 * @param {Object} obj Map of CSS properties to values.
 * @return {string} The style attribute value.
 */
function toStyleAttribute(obj) {
  var buffer = [];
  goog_object.forEach(obj, function(value, key) {
    buffer.push(strings.toSelectorCase(key), ':', value, ';');
  });
  return buffer.join('');
};

/**
 * Sets CSS float property on an element.
 * @param {Element} el The element to set float property on.
 * @param {string} value The value of float CSS property to set on this element.
 */
function setFloat(el, value) {
  el.style[userAgent.IE ? 'styleFloat' : 'cssFloat'] = value;
};

/**
 * Gets value of explicitly-set float CSS property on an element.
 * @param {Element} el The element to get float property of.
 * @return {string} The value of explicitly-set float CSS property on this
 *     element.
 */
function getFloat(el) {
  return el.style[userAgent.IE ? 'styleFloat' : 'cssFloat'] || '';
};

/**
 * Returns the scroll bar width (represents the width of both horizontal
 * and vertical scroll).
 *
 * @param {string=} opt_className An optional class name (or names) to apply
 *     to the invisible div created to measure the scrollbar. This is necessary
 *     if some scrollbars are styled differently than others.
 * @return {number} The scroll bar width in px.
 */
function getScrollbarWidth(opt_className) {
  // Add two hidden divs.  The child div is larger than the parent and
  // forces scrollbars to appear on it.
  // Using overflow:scroll does not work consistently with scrollbars that
  // are styled with ::-webkit-scrollbar.
  var outerDiv = googdom.createElement(TagName.DIV);
  if (opt_className) {
    outerDiv.className = opt_className;
  }
  outerDiv.style.cssText = 'overflow:auto;' +
      'position:absolute;top:0;width:100px;height:100px';
  var innerDiv = googdom.createElement(TagName.DIV);
  setSize(innerDiv, '200px', '200px');
  outerDiv.appendChild(innerDiv);
  googdom.appendChild(googdom.getDocument().body, outerDiv);
  var width = outerDiv.offsetWidth - outerDiv.clientWidth;
  googdom.removeNode(outerDiv);
  return width;
};

/**
 * Regular expression to extract x and y translation components from a CSS
 * transform Matrix representation.
 *
 * @type {!RegExp}
 * @const
 * @private
 */
let MATRIX_TRANSLATION_REGEX_ = new RegExp(
    'matrix\\([0-9\\.\\-]+, [0-9\\.\\-]+, ' +
    '[0-9\\.\\-]+, [0-9\\.\\-]+, ' +
    '([0-9\\.\\-]+)p?x?, ([0-9\\.\\-]+)p?x?\\)');

/**
 * Returns the x,y translation component of any CSS transforms applied to the
 * element, in pixels.
 *
 * @param {!Element} element The element to get the translation of.
 * @return {!Coordinate} The CSS translation of the element in px.
 */
function getCssTranslation(element) {
  var transform = getComputedTransform(element);
  if (!transform) {
    return new Coordinate(0, 0);
  }
  var matches = transform.match(MATRIX_TRANSLATION_REGEX_);
  if (!matches) {
    return new Coordinate(0, 0);
  }
  return new Coordinate(
      parseFloat(matches[1]), parseFloat(matches[2]));
};

export {clearTransparentBackgroundImage, getBackgroundColor, getBorderBox, getBorderBoxSize, getBounds, getCascadedStyle, getClientLeftTop, getClientPosition, getClientViewportElement, getComputedBoxSizing, getComputedCursor, getComputedOverflowX, getComputedOverflowY, getComputedPosition, getComputedStyle, getComputedTextAlign, getComputedTransform, getComputedZIndex, getContainerOffsetToScrollInto, getContentBoxSize, getCssTranslation, getFloat, getFontFamily, getFontSize, getFramedPageOffset, getLengthUnits, getMarginBox, getOffsetParent, getOpacity, getPaddingBox, getPageOffset, getPageOffsetLeft, getPageOffsetTop, getPosition, getRelativePosition, getScrollbarWidth, getSize, getStyle, getTransformedSize, getViewportPageOffset, getVisibleRectForElement, installSafeStyleSheet, isElementShown, isRightToLeft, isUnselectable, parseStyleAttribute, scrollIntoContainerView, setBorderBoxSize, setContentBoxSize, setElementShown, setFloat, setHeight, setInlineBlock, setOpacity, setPageOffset, setPosition, setPreWrap, setSafeStyleSheet, setSize, setStyle, setTransparentBackgroundImage, setUnselectable, setWidth, showElement, toCamelCase, toSelectorCase, toStyleAttribute, translateRectForAnotherFrame, uninstallStyles};