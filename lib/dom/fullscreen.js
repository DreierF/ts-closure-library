import * as goog_dom from './dom.js';
import {DomHelper} from './dom.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Functions for managing full screen status of the DOM.
 */

/**
 * Event types for full screen.
 * @enum {string}
 */
let EventType = {
  /** Dispatched by the Document when the fullscreen status changes. */
  CHANGE: (function() {
    var el = goog_dom.getDomHelper().getDocument().documentElement;
    if (el.requestFullscreen) {
      return 'fullscreenchange';
    }
    if (el.webkitRequestFullscreen) {
      return 'webkitfullscreenchange';
    }
    if (el.mozRequestFullScreen) {
      return 'mozfullscreenchange';
    }
    if (el.msRequestFullscreen) {
      return 'MSFullscreenChange';
    }
    // Opera 12-14, and W3C standard (Draft):
    // https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
    return 'fullscreenchange';
  })()
};

/**
 * Options for fullscreen navigation UI:
 * https://fullscreen.spec.whatwg.org/#dictdef-fullscreenoptions
 * @enum {string}
 */
let FullscreenNavigationUI = {
  AUTO: 'auto',
  HIDE: 'hide',
  SHOW: 'show'
};

/**
 * @record
 */
function FullscreenOptions() {};

/** @type {!FullscreenNavigationUI} */
FullscreenOptions.prototype.navigationUI;

/**
 * Determines if full screen is supported.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {boolean} True iff full screen is supported.
 */
function isSupported(opt_domHelper) {
  var doc = getDocument_(opt_domHelper);
  var body = doc.body;
  return !!(
      body.webkitRequestFullscreen ||
      (body.mozRequestFullScreen && doc.mozFullScreenEnabled) ||
      (body.msRequestFullscreen && doc.msFullscreenEnabled) ||
      (body.requestFullscreen && doc.fullscreenEnabled));
};

/**
 * Requests putting the element in full screen.
 * @param {!Element} element The element to put full screen.
 * @param {!FullscreenOptions=} opt_options Options for full
 *     screen. This field will be ignored on older browsers.
   @return {!Promise<undefined>|undefined} A promise in later versions of Chrome
       and undefined otherwise.
 */
function requestFullScreen(element, opt_options) {
  if (element.requestFullscreen) {
    return element.requestFullscreen(opt_options);
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }
};

/**
 * Requests putting the element in full screen with full keyboard access.
 * @param {!Element} element The element to put full screen.
   @return {!Promise<undefined>|undefined} A promise in later versions of Chrome
       and undefined otherwise.
 */
function requestFullScreenWithKeys(element) {
  if (element.mozRequestFullScreenWithKeys) {
    return element.mozRequestFullScreenWithKeys();
  } else {
    return requestFullScreen(element);
  }
};

/**
 * Exits full screen.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 */
function exitFullScreen(opt_domHelper) {
  var doc = getDocument_(opt_domHelper);
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  }
};

/**
 * Determines if the document is full screen.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {boolean} Whether the document is full screen.
 */
function isFullScreen(opt_domHelper) {
  var doc = getDocument_(opt_domHelper);
  // IE 11 doesn't have similar boolean property, so check whether
  // document.msFullscreenElement is null instead.
  return !!(
      doc.webkitIsFullScreen || doc.mozFullScreen || doc.msFullscreenElement ||
      doc.fullscreenElement);
};

/**
 * Get the root element in full screen mode.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {?Element} The root element in full screen mode.
 */
function getFullScreenElement(opt_domHelper) {
  var doc = getDocument_(opt_domHelper);
  var element_list = [
    doc.fullscreenElement, doc.webkitFullscreenElement,
    doc.mozFullScreenElement, doc.msFullscreenElement
  ];
  for (var i = 0; i < element_list.length; i++) {
    if (element_list[i] != null) {
      return element_list[i];
    }
  }
  return null;
};

/**
 * Gets the document object of the dom.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {!Document} The dom document.
 * @private
 */
function getDocument_(opt_domHelper) {
  return opt_domHelper ? opt_domHelper.getDocument() :
                         goog_dom.getDomHelper().getDocument();
};

export {EventType, FullscreenNavigationUI, FullscreenOptions, exitFullScreen, getFullScreenElement, isFullScreen, isSupported, requestFullScreen, requestFullScreenWithKeys};