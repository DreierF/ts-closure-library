import * as dom from './../dom/dom.js';
import * as math from './../math/math.js';
import * as style from './../style/style.js';
import * as userAgent from './../useragent/useragent.js';
import {BrowserEvent as EventsBrowserEvent} from './browserevent.js';
import * as goog_events from './eventhandler.js';
import {Key} from './eventhandler.js';
import {EventTarget as EventsEventTarget} from './eventhandler.js';
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
 * @fileoverview This event wrapper will dispatch an event when the user uses
 * the mouse wheel to scroll an element. You can get the direction by checking
 * the deltaX and deltaY properties of the event.
 *
 * This class aims to smooth out inconsistencies between browser platforms with
 * regards to mousewheel events, but we do not cover every possible
 * software/hardware combination out there, some of which occasionally produce
 * very large deltas in mousewheel events. If your application wants to guard
 * against extremely large deltas, use the setMaxDeltaX and setMaxDeltaY APIs
 * to set maximum values that make sense for your application.
 *
 * @see ../demos/mousewheelhandler.html
 */

/**
 * This event handler allows you to catch mouse wheel events in a consistent
 * manner.
 *     event on.
 *     capture phase.
 * @extends {EventsEventTarget}
 */
class MouseWheelHandler extends EventsEventTarget {

  /**
   * This event handler allows you to catch mouse wheel events in a consistent
   * manner.
   * @param {Element|Document} element The element to listen to the mouse wheel
   *     event on.
   * @param {boolean=} opt_capture Whether to handle the mouse wheel event in
   *     capture phase.
   */
  constructor(element, opt_capture) {
    super();
    /**
     * Optional maximum magnitude for x delta on each mousewheel event.
     * @type {number|undefined}
     * @private
     */
    this.maxDeltaX_ = undefined;
  
    /**
     * Optional maximum magnitude for y delta on each mousewheel event.
     * @type {number|undefined}
     * @private
     */
    this.maxDeltaY_ = undefined;
  
  
    /**
     * This is the element that we will listen to the real mouse wheel events on.
     * @type {Element|Document}
     * @private
     */
    this.element_ = element;
  
    var rtlElement = dom.isElement(this.element_) ?
        /** @type {Element} */ (this.element_) :
                               (this.element_ ?
                                    /** @type {Document} */ (this.element_).body :
                                    null);
  
    /**
     * True if the element exists and is RTL, false otherwise.
     * @type {boolean}
     * @private
     */
    this.isRtl_ = !!rtlElement && style.isRightToLeft(rtlElement);
  
    var type = userAgent.GECKO ? 'DOMMouseScroll' : 'mousewheel';
  
    /**
     * The key returned from the goog_events.listen.
     * @type {Key}
     * @private
     */
    this.listenKey_ = goog_events.listen(this.element_, type, this, opt_capture);
  }

  /**
   * @param {number} maxDeltaX Maximum magnitude for x delta on each mousewheel
   *     event. Should be non-negative.
   */
  setMaxDeltaX(maxDeltaX) {
    this.maxDeltaX_ = maxDeltaX;
  };

  /**
   * @param {number} maxDeltaY Maximum magnitude for y delta on each mousewheel
   *     event. Should be non-negative.
   */
  setMaxDeltaY(maxDeltaY) {
    this.maxDeltaY_ = maxDeltaY;
  };

  /**
   * Handles the events on the element.
   * @param {EventsBrowserEvent} e The underlying browser event.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleEvent(e) {
    var deltaX = 0;
    var deltaY = 0;
    var detail = 0;
    var be = e.getBrowserEvent();
    if (be.type == 'mousewheel') {
      // In IE we get a multiple of 120; we adjust to a multiple of 3 to
      // represent number of lines scrolled (like Gecko).
      // Newer versions of Webkit match IE behavior, and WebKit on
      // Windows also matches IE behavior.
      // See bug https://bugs.webkit.org/show_bug.cgi?id=24368
      var wheelDeltaScaleFactor = 40;
  
      detail = MouseWheelHandler.smartScale_(
          -be.wheelDelta, wheelDeltaScaleFactor);
      if (be.wheelDeltaX !== undefined) {
        // Webkit has two properties to indicate directional scroll, and
        // can scroll both directions at once.
        deltaX = MouseWheelHandler.smartScale_(
            -be.wheelDeltaX, wheelDeltaScaleFactor);
        deltaY = MouseWheelHandler.smartScale_(
            -be.wheelDeltaY, wheelDeltaScaleFactor);
      } else {
        deltaY = detail;
      }
  
      // Historical note: Opera (pre 9.5) used to negate the detail value.
    } else {  // Gecko
      // Gecko returns multiple of 3 (representing the number of lines scrolled)
      detail = be.detail;
  
      // Gecko sometimes returns really big values if the user changes settings to
      // scroll a whole page per scroll
      if (detail > 100) {
        detail = 3;
      } else if (detail < -100) {
        detail = -3;
      }
  
      // Firefox 3.1 adds an axis field to the event to indicate direction of
      // scroll.  See https://developer.mozilla.org/en/Gecko-Specific_DOM_Events
      if (be.axis !== undefined && be.axis === be.HORIZONTAL_AXIS) {
        deltaX = detail;
      } else {
        deltaY = detail;
      }
    }
  
    if (typeof this.maxDeltaX_ === 'number') {
      deltaX = math.clamp(deltaX, -this.maxDeltaX_, this.maxDeltaX_);
    }
    if (typeof this.maxDeltaY_ === 'number') {
      deltaY = math.clamp(deltaY, -this.maxDeltaY_, this.maxDeltaY_);
    }
    // Don't clamp 'detail', since it could be ambiguous which axis it refers to
    // and because it's informally deprecated anyways.
  
    // For horizontal scrolling we need to flip the value for RTL grids.
    if (this.isRtl_) {
      deltaX = -deltaX;
    }
    var newEvent = new MouseWheelEvent(detail, be, deltaX, deltaY);
    this.dispatchEvent(newEvent);
  };

  /**
   * Helper for scaling down a mousewheel delta by a scale factor, if appropriate.
   * @param {number} mouseWheelDelta Delta from a mouse wheel event. Expected to
   *     be an integer.
   * @param {number} scaleFactor Factor to scale the delta down by. Expected to
   *     be an integer.
   * @return {number} Scaled-down delta value, or the original delta if the
   *     scaleFactor does not appear to be applicable.
   * @private
   */
  static smartScale_(
      mouseWheelDelta, scaleFactor) {
    // The basic problem here is that in Webkit on Mac and Linux, we can get two
    // very different types of mousewheel events: from continuous devices
    // (touchpads, Mighty Mouse) or non-continuous devices (normal wheel mice).
    //
    // Non-continuous devices in Webkit get their wheel deltas scaled up to
    // behave like IE. Continuous devices return much smaller unscaled values
    // (which most of the time will not be cleanly divisible by the IE scale
    // factor), so we should not try to normalize them down.
    //
    // Detailed discussion:
    //   https://bugs.webkit.org/show_bug.cgi?id=29601
    //   http://trac.webkit.org/browser/trunk/WebKit/chromium/src/mac/WebInputEventFactory.mm#L1063
    if (userAgent.WEBKIT && (userAgent.MAC || userAgent.LINUX) &&
        (mouseWheelDelta % scaleFactor) != 0) {
      return mouseWheelDelta;
    } else {
      return mouseWheelDelta / scaleFactor;
    }
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    goog_events.unlistenByKey(this.listenKey_);
    this.listenKey_ = null;
  };
}

/**
 * Enum type for the events fired by the mouse wheel handler.
 * @enum {string}
 */
let EventType = {
  MOUSEWHEEL: 'mousewheel'
};

/**
 * A base class for mouse wheel events. This is used with the
 * MouseWheelHandler.
 *
 *     direction.
 *     direction.
 * @extends {EventsBrowserEvent}
 * @final
 */
class MouseWheelEvent extends EventsBrowserEvent {

  /**
   * A base class for mouse wheel events. This is used with the
   * MouseWheelHandler.
   *
   * @param {number} detail The number of rows the user scrolled.
   * @param {Event} browserEvent Browser event object.
   * @param {number} deltaX The number of rows the user scrolled in the X
   *     direction.
   * @param {number} deltaY The number of rows the user scrolled in the Y
   *     direction.
   */
  constructor(detail, browserEvent, deltaX, deltaY) {
    super(browserEvent);
  
    this.type = EventType.MOUSEWHEEL;
  
    /**
     * The number of lines the user scrolled
     * @type {number}
     * NOTE: Informally deprecated. Use deltaX and deltaY instead, they provide
     * more information.
     */
    this.detail = detail;
  
    /**
     * The number of "lines" scrolled in the X direction.
     *
     * Note that not all browsers provide enough information to distinguish
     * horizontal and vertical scroll events, so for these unsupported browsers,
     * we will always have a deltaX of 0, even if the user scrolled their mouse
     * wheel or trackpad sideways.
     *
     * Currently supported browsers are Webkit and Firefox 3.1 or later.
     *
     * @type {number}
     */
    this.deltaX = deltaX;
  
    /**
     * The number of lines scrolled in the Y direction.
     * @type {number}
     */
    this.deltaY = deltaY;
  }
}

export {EventType, MouseWheelEvent, MouseWheelHandler};