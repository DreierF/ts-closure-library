import * as dom from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import * as goog_events from './../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventHandler} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {Coordinate} from './../math/coordinate.js';
import {Rect} from './../math/rect.js';
import * as bidi from './../style/bidi.js';
import * as style from './../style/style.js';
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
 * @fileoverview Drag Utilities.
 *
 * Provides extensible functionality for drag & drop behaviour.
 *
 * @see ../demos/drag.html
 * @see ../demos/dragger.html
 */

/**
 * A class that allows mouse or touch-based dragging (moving) of an element
 *
 *     the target is used.
 *     and height.
 *
 * @extends {EventsEventTarget}
 * @class
 */
class Dragger extends EventsEventTarget {

  /**
   * A class that allows mouse or touch-based dragging (moving) of an element
   *
   * @param {Element} target The element that will be dragged.
   * @param {Element=} opt_handle An optional handle to control the drag, if null
   *     the target is used.
   * @param {Rect=} opt_limits Object containing left, top, width,
   *     and height.
   *
   */
  constructor(target, opt_handle, opt_limits) {
    super();
  
    /**
     * Reference to drag target element.
     * @type {?Element}
     */
    this.target = target;
  
    /**
     * Reference to the handler that initiates the drag.
     * @type {?Element}
     */
    this.handle = opt_handle || target;
  
    /**
     * Object representing the limits of the drag region.
     * @type {Rect}
     */
    this.limits = opt_limits || new Rect(NaN, NaN, NaN, NaN);
  
    /**
     * Reference to a document object to use for the events.
     * @private {Document}
     */
    this.document_ = dom.getOwnerDocument(target);
  
    /** @private {!EventHandler} */
    this.eventHandler_ = new EventHandler(this);
    this.registerDisposable(this.eventHandler_);
  
    /**
     * Whether the element is rendered right-to-left. We initialize this lazily.
     * @private {boolean|undefined}}
     */
    this.rightToLeft_;
  
    /**
     * Current x position of mouse or touch relative to viewport.
     * @type {number}
     */
    this.clientX = 0;
  
    /**
     * Current y position of mouse or touch relative to viewport.
     * @type {number}
     */
    this.clientY = 0;
  
    /**
     * Current x position of mouse or touch relative to screen. Deprecated because
     * it doesn't take into affect zoom level or pixel density.
     * @type {number}
     * @deprecated Consider switching to clientX instead.
     */
    this.screenX = 0;
  
    /**
     * Current y position of mouse or touch relative to screen. Deprecated because
     * it doesn't take into affect zoom level or pixel density.
     * @type {number}
     * @deprecated Consider switching to clientY instead.
     */
    this.screenY = 0;
  
    /**
     * The x position where the first mousedown or touchstart occurred.
     * @type {number}
     */
    this.startX = 0;
  
    /**
     * The y position where the first mousedown or touchstart occurred.
     * @type {number}
     */
    this.startY = 0;
  
    /**
     * Current x position of drag relative to target's parent.
     * @type {number}
     */
    this.deltaX = 0;
  
    /**
     * Current y position of drag relative to target's parent.
     * @type {number}
     */
    this.deltaY = 0;
  
    /**
     * The current page scroll value.
     * @type {?Coordinate}
     */
    this.pageScroll;
  
    /**
     * Whether dragging is currently enabled.
     * @private {boolean}
     */
    this.enabled_ = true;
  
    /**
     * Whether object is currently being dragged.
     * @private {boolean}
     */
    this.dragging_ = false;
  
    /**
     * Whether mousedown should be default prevented.
     * @private {boolean}
     **/
    this.preventMouseDown_ = true;
  
    /**
     * The amount of distance, in pixels, after which a mousedown or touchstart is
     * considered a drag.
     * @private {number}
     */
    this.hysteresisDistanceSquared_ = 0;
  
    /**
     * The SCROLL event target used to make drag element follow scrolling.
     * @private {?EventTarget}
     */
    this.scrollTarget_;
  
    /**
     * Whether IE drag events cancelling is on.
     * @private {boolean}
     */
    this.ieDragStartCancellingOn_ = false;
  
    /**
     * Whether the dragger implements the changes described in http://b/6324964,
     * making it truly RTL.  This is a temporary flag to allow clients to
     * transition to the new behavior at their convenience.  At some point it will
     * be the default.
     * @private {boolean}
     */
    this.useRightPositioningForRtl_ = false;
  
    // Add listener. Do not use the event handler here since the event handler is
    // used for listeners added and removed during the drag operation.
    goog_events.listen(
        this.handle,
        [EventsEventType.TOUCHSTART, EventsEventType.MOUSEDOWN],
        this.startDrag, false, this);
  
    /** @private {boolean} Avoids setCapture() calls to fix click handlers. */
    this.useSetCapture_ = Dragger.HAS_SET_CAPTURE_;
  }

  /**
   * Creates copy of node being dragged.  This is a utility function to be used
   * wherever it is inappropriate for the original source to follow the mouse
   * cursor itself.
   *
   * @param {Element} sourceEl Element to copy.
   * @return {!Element} The clone of `sourceEl`.
   */
  static cloneNode(sourceEl) {
    var clonedEl = sourceEl.cloneNode(true),
        origTexts =
            dom.getElementsByTagName(TagName.TEXTAREA, sourceEl),
        dragTexts =
            dom.getElementsByTagName(TagName.TEXTAREA, clonedEl);
    // Cloning does not copy the current value of textarea elements, so correct
    // this manually.
    for (var i = 0; i < origTexts.length; i++) {
      dragTexts[i].value = origTexts[i].value;
    }
    switch (sourceEl.tagName) {
      case String(TagName.TR):
        return dom.createDom(
            TagName.TABLE, null,
            dom.createDom(TagName.TBODY, null, clonedEl));
      case String(TagName.TD):
      case String(TagName.TH):
        return dom.createDom(
            TagName.TABLE, null,
            dom.createDom(
                TagName.TBODY, null,
                dom.createDom(TagName.TR, null, clonedEl)));
      case String(TagName.TEXTAREA):
        clonedEl.value = sourceEl.value;
      default:
        return clonedEl;
    }
  };

  /**
   * Prevents the dragger from calling setCapture(), even in browsers that support
   * it.  If the draggable item has click handlers, setCapture() can break them.
   * @param {boolean} allow True to use setCapture if the browser supports it.
   */
  setAllowSetCapture(allow) {
    this.useSetCapture_ = allow && Dragger.HAS_SET_CAPTURE_;
  };

  /**
   * Turns on/off true RTL behavior.  This should be called immediately after
   * construction.  This is a temporary flag to allow clients to transition
   * to the new component at their convenience.  At some point true will be the
   * default.
   * @param {boolean} useRightPositioningForRtl True if "right" should be used for
   *     positioning, false if "left" should be used for positioning.
   */
  enableRightPositioningForRtl(
      useRightPositioningForRtl) {
    this.useRightPositioningForRtl_ = useRightPositioningForRtl;
  };

  /**
   * Returns the event handler, intended for subclass use.
   * @return {!EventHandler<T>} The event handler.
   * @this {T}
   * @template T
   */
  getHandler() {
    // TODO(user): templated "this" values currently result in "this" being
    // "unknown" in the body of the function.
    var self = /** @type {Dragger} */ (this);
    return self.eventHandler_;
  };

  /**
   * Sets (or reset) the Drag limits after a Dragger is created.
   * @param {Rect?} limits Object containing left, top, width,
   *     height for new Dragger limits. If target is right-to-left and
   *     enableRightPositioningForRtl(true) is called, then rect is interpreted as
   *     right, top, width, and height.
   */
  setLimits(limits) {
    this.limits = limits || new Rect(NaN, NaN, NaN, NaN);
  };

  /**
   * Sets the distance the user has to drag the element before a drag operation is
   * started.
   * @param {number} distance The number of pixels after which a mousedown and
   *     move is considered a drag.
   */
  setHysteresis(distance) {
    this.hysteresisDistanceSquared_ = Math.pow(distance, 2);
  };

  /**
   * Gets the distance the user has to drag the element before a drag operation is
   * started.
   * @return {number} distance The number of pixels after which a mousedown and
   *     move is considered a drag.
   */
  getHysteresis() {
    return Math.sqrt(this.hysteresisDistanceSquared_);
  };

  /**
   * Sets the SCROLL event target to make drag element follow scrolling.
   *
   * @param {EventTarget} scrollTarget The event target that dispatches SCROLL
   *     events.
   */
  setScrollTarget(scrollTarget) {
    this.scrollTarget_ = scrollTarget;
  };

  /**
   * Enables cancelling of built-in IE drag events.
   * @param {boolean} cancelIeDragStart Whether to enable cancelling of IE
   *     dragstart event.
   */
  setCancelIeDragStart(cancelIeDragStart) {
    this.ieDragStartCancellingOn_ = cancelIeDragStart;
  };

  /**
   * @return {boolean} Whether the dragger is enabled.
   */
  getEnabled() {
    return this.enabled_;
  };

  /**
   * Set whether dragger is enabled
   * @param {boolean} enabled Whether dragger is enabled.
   */
  setEnabled(enabled) {
    this.enabled_ = enabled;
  };

  /**
   * Set whether mousedown should be default prevented.
   * @param {boolean} preventMouseDown Whether mousedown should be default
   *     prevented.
   */
  setPreventMouseDown(preventMouseDown) {
    this.preventMouseDown_ = preventMouseDown;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    goog_events.unlisten(
        this.handle,
        [EventsEventType.TOUCHSTART, EventsEventType.MOUSEDOWN],
        this.startDrag, false, this);
    this.cleanUpAfterDragging_();
  
    this.target = null;
    this.handle = null;
  };

  /**
   * Whether the DOM element being manipulated is rendered right-to-left.
   * @return {boolean} True if the DOM element is rendered right-to-left, false
   *     otherwise.
   * @private
   */
  isRightToLeft_() {
    if (this.rightToLeft_ === undefined) {
      this.rightToLeft_ = style.isRightToLeft(this.target);
    }
    return this.rightToLeft_;
  };

  /**
   * Event handler that is used to start the drag
   * @param {EventsBrowserEvent} e Event object.
   */
  startDrag(e) {
    var isMouseDown = e.type == EventsEventType.MOUSEDOWN;
  
    // Dragger.startDrag() can be called by AbstractDragDrop with a mousemove
    // event and IE does not report pressed mouse buttons on mousemove. Also,
    // it does not make sense to check for the button if the user is already
    // dragging.
  
    if (this.enabled_ && !this.dragging_ &&
        (!isMouseDown || e.isMouseActionButton())) {
      if (this.hysteresisDistanceSquared_ == 0) {
        if (this.fireDragStart_(e)) {
          this.dragging_ = true;
          if (this.preventMouseDown_ && isMouseDown) {
            e.preventDefault();
          }
        } else {
          // If the start drag is cancelled, don't setup for a drag.
          return;
        }
      } else if (this.preventMouseDown_ && isMouseDown) {
        // Need to preventDefault for hysteresis to prevent page getting selected.
        e.preventDefault();
      }
      this.setupDragHandlers();
  
      this.clientX = this.startX = e.clientX;
      this.clientY = this.startY = e.clientY;
      this.screenX = e.screenX;
      this.screenY = e.screenY;
      this.computeInitialPosition();
      this.pageScroll = dom.getDomHelper(this.document_).getDocumentScroll();
    } else {
      this.dispatchEvent(EventType.EARLY_CANCEL);
    }
  };

  /**
   * Sets up event handlers when dragging starts.
   * @protected
   */
  setupDragHandlers() {
    var doc = this.document_;
    var docEl = doc.documentElement;
    // Use bubbling when we have setCapture since we got reports that IE has
    // problems with the capturing events in combination with setCapture.
    var useCapture = !this.useSetCapture_;
  
    this.eventHandler_.listen(
        doc, [EventsEventType.TOUCHMOVE, EventsEventType.MOUSEMOVE],
        this.handleMove_, {capture: useCapture, passive: false});
    this.eventHandler_.listen(
        doc, [EventsEventType.TOUCHEND, EventsEventType.MOUSEUP],
        this.endDrag, useCapture);
  
    if (this.useSetCapture_) {
      docEl.setCapture(false);
      this.eventHandler_.listen(
          docEl, EventsEventType.LOSECAPTURE, this.endDrag);
    } else {
      // Make sure we stop the dragging if the window loses focus.
      // Don't use capture in this listener because we only want to end the drag
      // if the actual window loses focus. Since blur events do not bubble we use
      // a bubbling listener on the window.
      this.eventHandler_.listen(
          dom.getWindow(doc), EventsEventType.BLUR, this.endDrag);
    }
  
    if (userAgent.IE && this.ieDragStartCancellingOn_) {
      // Cancel IE's 'ondragstart' event.
      this.eventHandler_.listen(
          doc, EventsEventType.DRAGSTART, EventsEvent.preventDefault);
    }
  
    if (this.scrollTarget_) {
      this.eventHandler_.listen(
          this.scrollTarget_, EventsEventType.SCROLL, this.onScroll_,
          useCapture);
    }
  };

  /**
   * Fires a EventType.START event.
   * @param {EventsBrowserEvent} e Browser event that triggered the drag.
   * @return {boolean} False iff preventDefault was called on the DragEvent.
   * @private
   */
  fireDragStart_(e) {
    return this.dispatchEvent(
        new DragEvent(
            EventType.START, this, e.clientX, e.clientY, e));
  };

  /**
   * Unregisters the event handlers that are only active during dragging, and
   * releases mouse capture.
   * @private
   */
  cleanUpAfterDragging_() {
    this.eventHandler_.removeAll();
    if (this.useSetCapture_) {
      this.document_.releaseCapture();
    }
  };

  /**
   * Event handler that is used to end the drag.
   * @param {EventsBrowserEvent} e Event object.
   * @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
   */
  endDrag(e, opt_dragCanceled) {
    this.cleanUpAfterDragging_();
  
    if (this.dragging_) {
      this.dragging_ = false;
  
      var x = this.limitX(this.deltaX);
      var y = this.limitY(this.deltaY);
      var dragCanceled =
          opt_dragCanceled || e.type == EventsEventType.TOUCHCANCEL;
      this.dispatchEvent(
          new DragEvent(
              EventType.END, this, e.clientX, e.clientY, e, x, y,
              dragCanceled));
    } else {
      this.dispatchEvent(EventType.EARLY_CANCEL);
    }
  };

  /**
   * Event handler that is used to end the drag by cancelling it.
   * @param {EventsBrowserEvent} e Event object.
   */
  endDragCancel(e) {
    this.endDrag(e, true);
  };

  /**
   * Event handler that is used on mouse / touch move to update the drag
   * @param {EventsBrowserEvent} e Event object.
   * @private
   */
  handleMove_(e) {
    if (this.enabled_) {
      // dx in right-to-left cases is relative to the right.
      var sign =
          this.useRightPositioningForRtl_ && this.isRightToLeft_() ? -1 : 1;
      var dx = sign * (e.clientX - this.clientX);
      var dy = e.clientY - this.clientY;
      this.clientX = e.clientX;
      this.clientY = e.clientY;
      this.screenX = e.screenX;
      this.screenY = e.screenY;
  
      if (!this.dragging_) {
        var diffX = this.startX - this.clientX;
        var diffY = this.startY - this.clientY;
        var distance = diffX * diffX + diffY * diffY;
        if (distance > this.hysteresisDistanceSquared_) {
          if (this.fireDragStart_(e)) {
            this.dragging_ = true;
          } else {
            // DragListGroup disposes of the dragger if BEFOREDRAGSTART is
            // canceled.
            if (!this.isDisposed()) {
              this.endDrag(e);
            }
            return;
          }
        }
      }
  
      var pos = this.calculatePosition_(dx, dy);
      var x = pos.x;
      var y = pos.y;
  
      if (this.dragging_) {
        var rv = this.dispatchEvent(
            new DragEvent(
                EventType.BEFOREDRAG, this, e.clientX, e.clientY,
                e, x, y));
  
        // Only do the defaultAction and dispatch drag event if predrag didn't
        // prevent default
        if (rv) {
          this.doDrag(e, x, y, false);
          e.preventDefault();
        }
      }
    }
  };

  /**
   * Calculates the drag position.
   *
   * @param {number} dx The horizontal movement delta.
   * @param {number} dy The vertical movement delta.
   * @return {!Coordinate} The newly calculated drag element position.
   * @private
   */
  calculatePosition_(dx, dy) {
    // Update the position for any change in body scrolling
    var pageScroll = dom.getDomHelper(this.document_).getDocumentScroll();
    dx += pageScroll.x - this.pageScroll.x;
    dy += pageScroll.y - this.pageScroll.y;
    this.pageScroll = pageScroll;
  
    this.deltaX += dx;
    this.deltaY += dy;
  
    var x = this.limitX(this.deltaX);
    var y = this.limitY(this.deltaY);
    return new Coordinate(x, y);
  };

  /**
   * Event handler for scroll target scrolling.
   * @param {EventsBrowserEvent} e The event.
   * @private
   */
  onScroll_(e) {
    var pos = this.calculatePosition_(0, 0);
    e.clientX = this.clientX;
    e.clientY = this.clientY;
    this.doDrag(e, pos.x, pos.y, true);
  };

  /**
   * @param {EventsBrowserEvent} e The closure object
   *     representing the browser event that caused a drag event.
   * @param {number} x The new horizontal position for the drag element.
   * @param {number} y The new vertical position for the drag element.
   * @param {boolean} dragFromScroll Whether dragging was caused by scrolling
   *     the associated scroll target.
   * @protected
   */
  doDrag(e, x, y, dragFromScroll) {
    this.defaultAction(x, y);
    this.dispatchEvent(
        new DragEvent(
            EventType.DRAG, this, e.clientX, e.clientY, e, x, y));
  };

  /**
   * Returns the 'real' x after limits are applied (allows for some
   * limits to be undefined).
   * @param {number} x X-coordinate to limit.
   * @return {number} The 'real' X-coordinate after limits are applied.
   */
  limitX(x) {
    var rect = this.limits;
    var left = !isNaN(rect.left) ? rect.left : null;
    var width = !isNaN(rect.width) ? rect.width : 0;
    var maxX = left != null ? left + width : Infinity;
    var minX = left != null ? left : -Infinity;
    return Math.min(maxX, Math.max(minX, x));
  };

  /**
   * Returns the 'real' y after limits are applied (allows for some
   * limits to be undefined).
   * @param {number} y Y-coordinate to limit.
   * @return {number} The 'real' Y-coordinate after limits are applied.
   */
  limitY(y) {
    var rect = this.limits;
    var top = !isNaN(rect.top) ? rect.top : null;
    var height = !isNaN(rect.height) ? rect.height : 0;
    var maxY = top != null ? top + height : Infinity;
    var minY = top != null ? top : -Infinity;
    return Math.min(maxY, Math.max(minY, y));
  };

  /**
   * Overridable function for computing the initial position of the target
   * before dragging begins.
   * @protected
   */
  computeInitialPosition() {
    this.deltaX = this.useRightPositioningForRtl_ ?
        bidi.getOffsetStart(this.target) :
        /** @type {!HTMLElement} */ (this.target).offsetLeft;
    this.deltaY = /** @type {!HTMLElement} */ (this.target).offsetTop;
  };

  /**
   * Overridable function for handling the default action of the drag behaviour.
   * Normally this is simply moving the element to x,y though in some cases it
   * might be used to resize the layer.  This is basically a shortcut to
   * implementing a default ondrag event handler.
   * @param {number} x X-coordinate for target element. In right-to-left, x this
   *     is the number of pixels the target should be moved to from the right.
   * @param {number} y Y-coordinate for target element.
   */
  defaultAction(x, y) {
    if (this.useRightPositioningForRtl_ && this.isRightToLeft_()) {
      this.target.style.right = x + 'px';
    } else {
      this.target.style.left = x + 'px';
    }
    this.target.style.top = y + 'px';
  };

  /**
   * @return {boolean} Whether the dragger is currently in the midst of a drag.
   */
  isDragging() {
    return this.dragging_;
  };
}

// Dragger is meant to be extended, but defines most properties on its
// prototype, thus making it unsuitable for sealing.
// google.tagUnsealableClass(Dragger);

/**
 * Whether setCapture is supported by the browser.
 * IE and Gecko after 1.9.3 have setCapture. MS Edge and WebKit
 * (https://bugs.webkit.org/show_bug.cgi?id=27330) don't.
 * @type {boolean}
 * @private
 */
Dragger.HAS_SET_CAPTURE_ = window.document &&
    window.document.documentElement &&
    !!window.document.documentElement.setCapture &&
    !!window.document.releaseCapture;

/**
 * Constants for event names.
 * @enum {string}
 */
let EventType = {
  // The drag action was canceled before the START event. Possible reasons:
  // disabled dragger, dragging with the right mouse button or releasing the
  // button before reaching the hysteresis distance.
  EARLY_CANCEL: 'earlycancel',
  START: 'start',
  BEFOREDRAG: 'beforedrag',
  DRAG: 'drag',
  END: 'end'
};

/**
 * Object representing a drag event
 *   representing the browser event that caused this drag event.
 * @class
 * @extends {EventsEvent}
 */
class DragEvent extends EventsEvent {

  /**
   * Object representing a drag event
   * @param {string} type Event type.
   * @param {Dragger} dragobj Drag object initiating event.
   * @param {number} clientX X-coordinate relative to the viewport.
   * @param {number} clientY Y-coordinate relative to the viewport.
   * @param {EventsBrowserEvent} browserEvent The closure object
   *   representing the browser event that caused this drag event.
   * @param {number=} opt_actX Optional actual x for drag if it has been limited.
   * @param {number=} opt_actY Optional actual y for drag if it has been limited.
   * @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
   */
  constructor(
      type, dragobj, clientX, clientY, browserEvent, opt_actX, opt_actY,
      opt_dragCanceled) {
    super(type);
  
    /**
     * X-coordinate relative to the viewport
     * @type {number}
     */
    this.clientX = clientX;
  
    /**
     * Y-coordinate relative to the viewport
     * @type {number}
     */
    this.clientY = clientY;
  
    /**
     * The closure object representing the browser event that caused this drag
     * event.
     * @type {EventsBrowserEvent}
     */
    this.browserEvent = browserEvent;
  
    /**
     * The real x-position of the drag if it has been limited
     * @type {number}
     */
    this.left = (opt_actX !== undefined) ? opt_actX : dragobj.deltaX;
  
    /**
     * The real y-position of the drag if it has been limited
     * @type {number}
     */
    this.top = (opt_actY !== undefined) ? opt_actY : dragobj.deltaY;
  
    /**
     * Reference to the drag object for this event
     * @type {Dragger}
     */
    this.dragger = dragobj;
  
    /**
     * Whether drag was canceled with this event. Used to differentiate between
     * a legitimate drag END that can result in an action and a drag END which is
     * a result of a drag cancelation. For now it can happen 1) with drag END
     * event on FireFox when user drags the mouse out of the window, 2) with
     * drag END event on IE7 which is generated on MOUSEMOVE event when user
     * moves the mouse into the document after the mouse button has been
     * released, 3) when TOUCHCANCEL is raised instead of TOUCHEND (on touch
     * events).
     * @type {boolean}
     */
    this.dragCanceled = !!opt_dragCanceled;
  }
}

export {DragEvent, Dragger, EventType};